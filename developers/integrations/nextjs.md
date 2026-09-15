# Next.js App Router Integration

Learn how to integrate OwnPay in Next.js 14+ using Route Handlers and Server Actions.

---

## 1. Route Handler: Create PaymentIntent (`app/api/checkout/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { OwnPayClient } from '@ownpay/sdk';

const ownpay = new OwnPayClient({
  apiKey: process.env.OWNPAY_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json();

    const intent = await ownpay.paymentIntents.create({
      amount: String(amount),
      currency: 'USD',
      settlementToken: 'USDC',
      settlementChain: 'base',
      recipientAddress: '0xYourMerchantSettlementAddress...',
      idempotencyKey: `next_${orderId}`,
    });

    return NextResponse.json({ clientSecret: intent.clientSecret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 2. Route Handler: Webhook Verification (`app/api/webhooks/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { OwnPayWebhooks } from '@ownpay/sdk';

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = req.headers.get('x-ownpay-signature');

  try {
    const event = OwnPayWebhooks.constructEvent(
      Buffer.from(bodyText, 'utf8'),
      signature!,
      process.env.OWNPAY_WEBHOOK_SECRET!
    );

    if (event.type === 'payment_intent.succeeded') {
      // Fulfill customer order
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
```
