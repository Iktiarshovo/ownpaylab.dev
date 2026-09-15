# TypeScript / Node.js SDK Guide

> **Package:** `@ownpay/sdk`  
> **Source:** [GitHub Repository](https://github.com/Iktiarshovo/ownpaylab.dev)  
> **Target:** Node.js 18+, Bun, Deno, Next.js, Cloudflare Workers  

---

## Installation

```bash
npm install @ownpay/sdk
# or
pnpm add @ownpay/sdk
# or
yarn add @ownpay/sdk
```

---

## Client Initialization

```typescript
import { OwnPayClient } from '@ownpay/sdk';

const ownpay = new OwnPayClient({
  apiKey: process.env.OWNPAY_SECRET_KEY || 'own_sec_test_mock_1234567890abcdef',
  environment: 'sandbox', // 'sandbox' | 'production'
  maxNetworkRetries: 3,
  timeoutMs: 10000,
});
```

---

## Creating a PaymentIntent

```typescript
const intent = await ownpay.paymentIntents.create({
  amount: '35.00',
  currency: 'USD',
  settlementToken: 'USDC',
  settlementChain: 'base',
  recipientAddress: '0xYourMerchantSettlementAddress...',
  idempotencyKey: 'cart_12345',
  metadata: {
    customerId: 'cust_987',
  },
});

console.log('Created Intent ID:', intent.id);
console.log('Client Secret:', intent.clientSecret);
```

---

## Verifying Webhooks

```typescript
import { OwnPayWebhooks } from '@ownpay/sdk';

const event = OwnPayWebhooks.constructEvent(
  rawBodyBuffer,
  signatureHeader,
  process.env.OWNPAY_WEBHOOK_SECRET!
);

if (event.type === 'payment_intent.succeeded') {
  console.log('Confirmed payment:', event.data.id);
}
```
