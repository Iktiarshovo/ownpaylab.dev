/**
 * Express Webhook Listener with HMAC-SHA256 Signature Verification
 * Demonstrates secure webhook ingestion and idempotency handling.
 */

import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();

const WEBHOOK_SECRET = process.env.OWNPAY_WEBHOOK_SECRET || 'whsec_test_mock_secret_abcdef123456';

// In-memory set to deduplicate processed events
const processedEvents = new Set<string>();

function verifyHmacSignature(rawPayload: string, signatureHeader: string, secret: string): boolean {
  try {
    const parts = signatureHeader.split(',');
    const timestamp = parts.find((p) => p.startsWith('t='))?.split('=')[1];
    const signature = parts.find((p) => p.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !signature) return false;

    // Reject timestamps older than 5 minutes to prevent replay attacks
    const ageSeconds = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
    if (Math.abs(ageSeconds) > 300) return false;

    const payload = `${timestamp}.${rawPayload}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Ensure the webhook endpoint receives the raw Buffer
app.post(
  '/api/webhooks/ownpay',
  express.raw({ type: 'application/json' }),
  (req: Request, res: Response) => {
    const sigHeader = req.headers['x-ownpay-signature'];

    if (!sigHeader || typeof sigHeader !== 'string') {
      return res.status(400).send('Missing X-OwnPay-Signature header');
    }

    const rawBody = req.body.toString('utf8');

    if (!verifyHmacSignature(rawBody, sigHeader, WEBHOOK_SECRET)) {
      console.warn('[Webhook] Signature verification failed!');
      return res.status(401).send('Invalid signature');
    }

    const event = JSON.parse(rawBody);

    // Idempotency check
    if (processedEvents.has(event.id)) {
      console.log(`[Webhook] Event ${event.id} already processed. Returning 200 OK.`);
      return res.status(200).json({ received: true, status: 'duplicate' });
    }

    processedEvents.add(event.id);

    console.log(`[Webhook] Processing verified event: ${event.type} (${event.id})`);

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data;
      console.log(`[Webhook] Order ${intent.metadata?.orderId || intent.id} successfully settled!`);
      console.log(`[Webhook] On-chain Tx: ${intent.settlementDetails?.txHash}`);
    }

    res.status(200).json({ received: true });
  }
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Webhook listener running on http://localhost:${PORT}/api/webhooks/ownpay`);
});
