# Webhooks & Cryptographic Event Security

> **Status:** Specification & Security Guide  
> **Security Protocol:** HMAC SHA-256 Signature Verification  

---

## 1. Overview

Webhooks allow your application to receive real-time notifications when events occur in OwnPay (such as when a customer transaction achieves on-chain finality).

Because webhooks are delivered over the public internet, OwnPay cryptographically signs every webhook payload. **You must verify this signature before processing the event.**

---

## 2. Event Types

| Event Name | Description |
| :--- | :--- |
| `payment_intent.created` | Emitted when a new PaymentIntent is created. |
| `payment_intent.processing` | Emitted when a transaction is detected in the mempool or initial block. |
| `payment_intent.succeeded` | Emitted when the target confirmation depth is reached and funds are settled. |
| `payment_intent.failed` | Emitted if the transaction reverts, runs out of gas, or invalid parameters are used. |
| `payment_intent.canceled` | Emitted if an intent expires before receiving payment or is canceled. |

---

## 3. Cryptographic Signature Header

Every webhook request from OwnPay includes the header:

```http
X-OwnPay-Signature: t=1789449200,v1=5d41402abc4b2a76b9719d911017c592186e88544f8...
```

The header contains:
- `t`: The Unix timestamp (in seconds) when the event was dispatched.
- `v1`: The hexadecimal HMAC-SHA256 signature generated using your endpoint's Webhook Secret (`whsec_...`).

---

## 4. Verification Algorithm

To verify the signature manually:

1. **Extract Timestamp & Signature:** Parse `t` and `v1` from `X-OwnPay-Signature`.
2. **Prevent Replay Attacks:** Reject requests where `Math.abs(currentTime - t) > 300` (5 minutes).
3. **Construct Signed Payload:** Concatenate timestamp, a period (`.`), and the raw, unparsed request body string:
   ```text
   signed_payload = `${t}.${raw_request_body}`
   ```
4. **Compute Expected HMAC:** Compute the HMAC SHA-256 of `signed_payload` using your webhook secret.
5. **Constant-Time Comparison:** Compare the computed hash with `v1` using a timing-safe equality function (such as `crypto.timingSafeEqual`).

---

## 5. Implementation Example (TypeScript / Express)

```typescript
import crypto from 'crypto';
import express from 'express';

const app = express();

function verifyOwnPaySignature(
  rawBody: Buffer,
  signatureHeader: string,
  secret: string,
  toleranceSeconds = 300
): boolean {
  const parts = signatureHeader.split(',');
  const timestampPart = parts.find((p) => p.startsWith('t='));
  const sigPart = parts.find((p) => p.startsWith('v1='));

  if (!timestampPart || !sigPart) return false;

  const timestamp = parseInt(timestampPart.split('=')[1], 10);
  const signature = sigPart.split('=')[1];

  // Prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    return false;
  }

  // Construct payload and compute HMAC
  const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(signedPayload).digest('hex');

  // Constant-time equality comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Ensure you use raw body parser
app.post('/webhooks/ownpay', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-ownpay-signature'] as string;
  const secret = process.env.OWNPAY_WEBHOOK_SECRET || 'whsec_test_mock_secret';

  if (!verifyOwnPaySignature(req.body, sig, secret)) {
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString('utf8'));
  console.log('Verified Event:', event.type);

  res.status(200).json({ received: true });
});
```

---

## 6. Delivery Guarantees & Retry Schedule

OwnPay guarantees **at-least-once delivery**. If your server returns an HTTP status code outside the `2xx` range, or if the request times out (after 10 seconds), OwnPay automatically retries using exponential backoff:

```text
Attempt 1: Immediate
Attempt 2: 5 minutes later
Attempt 3: 15 minutes later
Attempt 4: 1 hour later
Attempt 5: 6 hours later
Attempt 6: 12 hours later
Attempt 7: 24 hours later
Attempt 8: 72 hours later (Final attempt before alert)
```

> [!TIP]
> Because delivery is at-least-once, your webhook handler must be **idempotent**. Store processed `event.id` values in your database and return `200 OK` immediately if an event was already handled.
