import crypto from 'crypto';
import { ShopifyOffsiteGateway, ShopifyAdminClient } from '../packages/plugins/src/shopify';
import { WooCommerceHelper } from '../packages/plugins/src/woocommerce';

describe('@ownpay/plugins - E-Commerce Integrations Test Suite', () => {
  const testSecret = 'whsec_test_ecommerce_secret_999';

  describe('1. ShopifyOffsiteGateway Adapter', () => {
    const gateway = new ShopifyOffsiteGateway({
      apiKey: 'own_test_mock_key',
      webhookSecret: testSecret,
      baseUrl: 'https://ownpaylab.tech',
    });

    it('should verify legitimate signed Shopify webhooks', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = JSON.stringify({
        event: 'payment.confirmed',
        order_id: 'SH-44910',
        tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        amount: 120.0,
        currency: 'USD',
      });

      const hash = crypto
        .createHmac('sha256', testSecret)
        .update(`${timestamp}.${body}`)
        .digest('hex');
      const signature = `v1=${hash}`;

      const res = gateway.verifyWebhook(body, signature, timestamp);
      expect(res.valid).toBe(true);
      expect(res.event.order_id).toBe('SH-44910');
    });

    it('should reject tampered payload or mismatched signature', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = JSON.stringify({ event: 'payment.confirmed', order_id: 'SH-1', amount: 100 });
      const tampered = JSON.stringify({ event: 'payment.confirmed', order_id: 'SH-1', amount: 1 });

      const hash = crypto
        .createHmac('sha256', testSecret)
        .update(`${timestamp}.${body}`)
        .digest('hex');

      const res = gateway.verifyWebhook(tampered, `v1=${hash}`, timestamp);
      expect(res.valid).toBe(false);
    });

    it('should build valid GraphQL mutation for order settlement', () => {
      const admin = new ShopifyAdminClient({
        shopDomain: 'store.myshopify.com',
        accessToken: 'shpat_mock_token',
      });

      const mutation = admin.buildCaptureMutation({
        orderId: '98765',
        amount: 250.0,
        currency: 'USD',
        txHash: '0xabc123',
        chainId: 8453,
      });

      expect(mutation.query).toContain('orderMarkAsPaid');
      expect(mutation.variables.input.id).toBe('gid://shopify/Order/98765');
    });
  });

  describe('2. WooCommerceHelper Adapter', () => {
    it('should generate valid checkout redirect parameters', () => {
      const payload = WooCommerceHelper.buildIntentPayload(
        {
          orderId: 'WOO-501',
          orderNumber: '501',
          total: 75.5,
          currency: 'USD',
          billingEmail: 'shopper@example.com',
          returnUrl: 'https://myshop.com/checkout/order-received',
          chain: 'base',
        },
        'https://myshop.com/api/webhooks/ownpay'
      );

      expect(payload.amount).toBe(75.5);
      expect(payload.chain).toBe('base');
      expect(payload.asset).toBe('USDC');
      expect(payload.customer_email).toBe('shopper@example.com');
      expect(payload.metadata.wc_order_id).toBe('WOO-501');
    });

    it('should accurately verify WooCommerce webhook signatures', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payload = JSON.stringify({ orderId: 'WOO-501', event: 'intent.settled' });
      const hash = crypto
        .createHmac('sha256', testSecret)
        .update(`${timestamp}.${payload}`)
        .digest('hex');

      const isValid = WooCommerceHelper.verifyWebhookSignature(payload, `v1=${hash}`, timestamp, testSecret);
      expect(isValid).toBe(true);
    });
  });
});


