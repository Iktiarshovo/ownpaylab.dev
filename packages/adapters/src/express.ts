import { Request, Response, NextFunction, Router } from 'express';
import { OwnPayClient, OwnPayWebhook, CreateIntentParams } from '../../sdk/src';

export interface ExpressAdapterOptions {
  apiKey: string;
  baseUrl?: string;
  webhookSecret?: string;
}

/**
 * Express middleware to automatically verify incoming OwnPay cryptographic HMAC signatures.
 * Requires `express.raw({ type: 'application/json' })` or rawBody attached to req.
 */
export function ownpayExpressWebhookMiddleware(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = (req.headers['x-ownpay-signature'] as string) || '';
    const timestamp = (req.headers['x-ownpay-timestamp'] as string) || '';

    // Extract raw body
    let rawBody = '';
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString('utf8');
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
    } else if ((req as any).rawBody) {
      rawBody = (req as any).rawBody.toString('utf8');
    } else {
      rawBody = JSON.stringify(req.body);
    }

    const isValid = OwnPayWebhook.verifySignature(rawBody, signature, timestamp, secret);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid OwnPay webhook signature' });
    }

    // Attach verified event
    try {
      (req as any).ownpayEvent = JSON.parse(rawBody);
    } catch {
      (req as any).ownpayEvent = req.body;
    }

    next();
  };
}

/**
 * Creates a drop-in Express Router with `/checkout` and `/verify/:id` endpoints
 */
export function createOwnPayExpressRouter(options: ExpressAdapterOptions): Router {
  const router = Router();
  const client = new OwnPayClient({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl || 'https://ownpaylab.tech'
  });

  router.post('/checkout', async (req: Request, res: Response) => {
    try {
      const { orderId, amount, currency, title, customerEmail, webhookUrl, chain, asset } = req.body;
      const intent = await client.intents.create({
        orderId: orderId || `order_${Date.now()}`,
        amount: Number(amount),
        currency: currency || 'USD',
        title,
        customerEmail,
        webhookUrl,
        chain,
        asset,
      });

      res.json({
        success: true,
        data: intent,
        checkoutUrl: `${client.baseUrl}/pay?intent_id=${intent.intent_id}`
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  router.get('/verify/:intentId', async (req: Request, res: Response) => {
    try {
      const status = await client.intents.verify(req.params.intentId);
      res.json({ success: true, data: status });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  return router;
}
