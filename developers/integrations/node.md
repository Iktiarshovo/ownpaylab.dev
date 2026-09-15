# Node.js & Express Integration

A minimal server setting up PaymentIntent creation and Webhook reception using Express.

---

## Server Setup

```typescript
import express from 'express';
import { OwnPayClient, OwnPayWebhooks } from '@ownpay/sdk';

const app = express();
const ownpay = new OwnPayClient({
  apiKey: process.env.OWNPAY_SECRET_KEY || 'own_sec_test_mock_1234567890abcdef',
});

// JSON body parsing for API endpoints
app.use('/api', express.json());

// Endpoint to create PaymentIntent
app.post('/api/checkout', async (req, res) => {
  try {
    const intent = await ownpay.paymentIntents.create({
      amount: req.body.amount,
      currency: 'USD',
      settlementToken: 'USDC',
      settlementChain: 'base',
      recipientAddress: '0xYourMerchantSettlementAddress...',
      idempotencyKey: `order_${Date.now()}`,
    });

    res.json({ clientSecret: intent.clientSecret });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Raw body parsing strictly for Webhook signature verification
app.post('/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-ownpay-signature'] as string;
  const secret = process.env.OWNPAY_WEBHOOK_SECRET || 'whsec_test_mock';

  try {
    const event = OwnPayWebhooks.constructEvent(req.body, sig, secret);

    if (event.type === 'payment_intent.succeeded') {
      console.log('Order paid successfully:', event.data.id);
    }

    res.status(200).send('OK');
  } catch (err: any) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
