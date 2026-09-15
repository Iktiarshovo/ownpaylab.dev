# Getting Started with OwnPay

> **Status:** Developer Guide  
> **Environment:** Sandbox / Testnet (`Base Sepolia`, `Ethereum Sepolia`, `Solana Devnet`)  
> **Estimated Integration Time:** 15 minutes  

---

## 1. Prerequisites

Before starting, ensure you have:
- **Node.js** v18.0.0+ (or Python 3.10+)
- An active testnet wallet (e.g., MetaMask, Coinbase Wallet, or Phantom) funded with testnet USDC/ETH.
- An OwnPay Merchant Sandbox account on [https://ownpaylab.tech](https://ownpaylab.tech).

---

## 2. Obtain Your Sandbox Credentials

1. Log in to the Merchant Portal at [`https://ownpaylab.tech`](https://ownpaylab.tech).
2. Navigate to **Developers &rarr; API Keys**.
3. Generate a new Sandbox Keypair:
   - **Publishable Key (`own_pub_test_...`):** Safe for frontend checkout widgets.
   - **Secret Key (`own_sec_test_...`):** Keep secure on your backend server.
4. Set your **Webhook Endpoint URL** and copy your **Webhook Signing Secret** (`whsec_test_...`).

---

## 3. Install the SDK

Install the official OwnPay TypeScript/Node SDK:

```bash
# Using npm
npm install @ownpay/sdk

# Using pnpm
pnpm add @ownpay/sdk

# Using yarn
yarn add @ownpay/sdk
```

*(For Python developers, see [Python Quickstart](../developers/quickstarts/python-quickstart.md)).*

---

## 4. Initialize the Client

Initialize the SDK in your backend server:

```typescript
import { OwnPayClient } from '@ownpay/sdk';

const ownpay = new OwnPayClient({
  apiKey: process.env.OWNPAY_SECRET_KEY || 'own_sec_test_mock_1234567890abcdef',
  environment: 'sandbox', // Use 'production' for live mainnet
});
```

---

## 5. Create a PaymentIntent

A `PaymentIntent` tracks the complete lifecycle of a transaction from creation to on-chain settlement:

```typescript
import { Request, Response } from 'express';

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const intent = await ownpay.paymentIntents.create({
      amount: '49.99',
      currency: 'USD',
      settlementToken: 'USDC',
      settlementChain: 'base', // 'ethereum' | 'base' | 'polygon' | 'arbitrum' | 'solana'
      recipientAddress: '0xYourMerchantSettlementAddress1234567890abcdef',
      idempotencyKey: `order_${req.body.orderId}`,
      metadata: {
        customerId: req.body.customerId,
        cartId: req.body.cartId,
      },
    });

    // Return the client secret and checkout URL to the frontend
    res.status(201).json({
      intentId: intent.id,
      clientSecret: intent.clientSecret,
      checkoutUrl: intent.checkoutUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## 6. Render the Checkout UI (Frontend)

Embed the lightweight OwnPay Checkout modal using the client secret:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>OwnPay Checkout</title>
  <script src="https://www.ownpaylab.dev/sdk/v1/checkout.js"></script>
</head>
<body>
  <button id="pay-btn">Pay $49.99 with OwnPay</button>

  <script>
    const checkout = new OwnPayCheckout({
      publishableKey: 'own_pub_test_mock_9876543210fedcba',
    });

    document.getElementById('pay-btn').addEventListener('click', async () => {
      // 1. Fetch client secret from your server
      const res = await fetch('/api/create-payment-intent', { method: 'POST' });
      const { clientSecret } = await res.json();

      // 2. Open modal
      checkout.openModal({
        clientSecret,
        onSuccess: (payment) => {
          console.log('Payment completed on-chain:', payment.txHash);
          window.location.href = '/checkout/success';
        },
        onError: (err) => {
          console.error('Payment failed:', err);
        }
      });
    });
  </script>
</body>
</html>
```

---

## 7. Handle Webhook Verification

Never fulfill orders based solely on frontend callbacks. Always verify the cryptographically signed webhook payload on your server:

```typescript
import { OwnPayWebhooks } from '@ownpay/sdk';
import express from 'express';

const app = express();

app.post('/api/webhooks/ownpay', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-ownpay-signature'] as string;
  const webhookSecret = process.env.OWNPAY_WEBHOOK_SECRET || 'whsec_test_mock_secret';

  try {
    const event = OwnPayWebhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data;
      console.log(`Payment confirmed! Order ID: ${intent.metadata.orderId}`);
      console.log(`Settled TX: ${intent.settlementTxHash}`);
      // Fulfill customer order in your database
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## 8. Next Steps

- Review the [Payment Flow Guide](./payment-flow.md) for state transitions.
- Check the [Webhook Security Documentation](./webhooks.md).
- Dive into the [Agentic Rail & MCP Tooling](./agent-rail.md) if building AI autonomous payment workflows.
