# Webhook Signature Verification

Always verify the `X-OwnPay-Signature` header to ensure incoming webhook requests originated from OwnPay and have not been tampered with in transit.

---

## SDK Verification (Recommended)

Using `@ownpay/sdk`:

```typescript
import { OwnPayWebhooks } from '@ownpay/sdk';

try {
  const event = OwnPayWebhooks.constructEvent(
    rawBodyBuffer,
    req.headers['x-ownpay-signature'] as string,
    process.env.OWNPAY_WEBHOOK_SECRET!
  );
  console.log('Event verified successfully:', event.id);
} catch (err: any) {
  console.error('Invalid signature:', err.message);
}
```

---

## Manual Node.js Verification

```typescript
import crypto from 'crypto';

export function verifySignature(rawBody: string, header: string, secret: string): boolean {
  const [tPart, sigPart] = header.split(',');
  const timestamp = tPart.split('=')[1];
  const signature = sigPart.split('=')[1];

  const payload = `${timestamp}.${rawBody}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmac));
}
```
