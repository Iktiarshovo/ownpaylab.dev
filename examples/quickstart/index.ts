import { OwnPayClient, OwnPayWebhook } from '@ownpay/sdk';

// 1. Initialize OwnPay Client
const client = new OwnPayClient({
  apiKey: process.env.OWNPAY_API_KEY || 'own_sec_test_mock_1234567890abcdef',
  baseUrl: 'https://ownpaylab.tech',
});

async function main() {
  console.log('🚀 Starting OwnPay Quickstart Demo...');

  // 2. Create Multi-Chain Payment Intent (Base L2 USDC)
  const baseIntent = await client.intents.create({
    amount: '29.99',
    currency: 'USD',
    chain: 'base',
    asset: 'USDC',
    title: 'Pro Developer Plan',
    customerEmail: 'developer@example.com',
    webhookUrl: 'https://myservice.com/api/webhooks/ownpay',
    metadata: {
      userId: 'usr_developer_001',
      source: 'quickstart',
    },
  });

  console.log('✅ Created Base L2 Intent:', baseIntent);

  // 3. Create Solana Payment Intent
  const solanaIntent = await client.intents.create({
    amount: '15.00',
    currency: 'USD',
    chain: 'solana',
    asset: 'USDC',
    title: 'Compute Unit Top-up',
    customerEmail: 'developer@example.com',
  });

  console.log('✅ Created Solana Intent:', solanaIntent);

  // 4. Verify Webhook Signature Example
  const rawBody = JSON.stringify({ event: 'intent.settled', id: 'pi_sample' });
  const mockSecret = 'whsec_sample_webhook_secret';
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // In production, your webhook handler receives headers:
  // x-ownpay-signature and x-ownpay-timestamp
  const isValid = OwnPayWebhook.verifySignature(
    rawBody,
    'v1=sample_hex_signature',
    timestamp,
    mockSecret
  );

  console.log('🔒 Webhook verification test:', isValid);
}

main().catch(console.error);
