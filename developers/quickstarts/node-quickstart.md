# 15-Minute Node.js Quickstart

Get a complete end-to-end payment flow running locally with Node.js, Express, and OwnPay Sandbox.

---

## Step 1: Initialize Project

```bash
mkdir ownpay-quickstart
cd ownpay-quickstart
npm init -y
npm install express @ownpay/sdk dotenv
npm install -D typescript @types/express @types/node tsx
npx tsc --init
```

---

## Step 2: Create Environment File (`.env`)

```env
OWNPAY_SECRET_KEY=own_sec_test_mock_1234567890abcdef
OWNPAY_WEBHOOK_SECRET=whsec_test_mock_secret
PORT=3000
```

---

## Step 3: Create Server (`src/server.ts`)

```typescript
import 'dotenv/config';
import express from 'express';
import { OwnPayClient, OwnPayWebhooks } from '@ownpay/sdk';

const app = express();
const ownpay = new OwnPayClient({ apiKey: process.env.OWNPAY_SECRET_KEY! });

// Checkout route
app.post('/api/create-payment', express.json(), async (req, res) => {
  try {
    const intent = await ownpay.paymentIntents.create({
      amount: '15.00',
      currency: 'USD',
      settlementToken: 'USDC',
      settlementChain: 'base',
      recipientAddress: '0xYourMerchantSettlementAddress...',
      idempotencyKey: `qs_${Date.now()}`,
    });
    res.json({ checkoutUrl: intent.checkoutUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook listener
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-ownpay-signature'] as string;
  try {
    const event = OwnPayWebhooks.constructEvent(req.body, sig, process.env.OWNPAY_WEBHOOK_SECRET!);
    console.log('Received event:', event.type);
    res.json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Signature Error: ${err.message}`);
  }
});

app.listen(3000, () => console.log('Quickstart server running on http://localhost:3000'));
```

---

## Step 4: Run Locally

```bash
npx tsx src/server.ts
```

Test payment intent creation:
```bash
curl -X POST http://localhost:3000/api/create-payment
```
