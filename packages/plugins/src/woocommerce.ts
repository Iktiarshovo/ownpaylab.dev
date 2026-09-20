/**
 * OwnPay WooCommerce TypeScript Integration Helpers
 */

import * as crypto from 'crypto';

export interface WooCommerceOrderPayload {
  orderId: string;
  orderNumber: string;
  total: number;
  currency: string;
  billingEmail?: string;
  returnUrl?: string;
  cancelUrl?: string;
  chain?: 'base' | 'solana' | 'bsc' | 'opbnb' | string;
  chainId?: number;
  asset?: 'USDC' | string;
}

export interface WooCommerceWebhookEvent {
  event: 'payment.confirmed' | 'intent.settled';
  orderId: string;
  txHash: string;
  usdcAmount: string;
  chain?: string;
  chainId: number;
  network?: string;
  asset?: string;
}

export class WooCommerceHelper {
  /**
   * Constructs payload for OwnPay POST /api/v1/intents matching WooCommerce gateway standard
   */
  static buildIntentPayload(order: WooCommerceOrderPayload, webhookUrl: string) {
    const chain = order.chain || (order.chainId === 101 ? 'solana' : order.chainId === 56 ? 'bsc' : order.chainId === 204 ? 'opbnb' : 'base');
    return {
      merchant_id: 'auto',
      order_id: (order.orderId || order.orderNumber).toString(),
      amount: order.total,
      currency: order.currency,
      chain,
      asset: 'USDC',
      chain_id: order.chainId || (chain === 'solana' ? 101 : chain === 'bsc' ? 56 : chain === 'opbnb' ? 204 : 8453),
      customer_email: order.billingEmail,
      webhook_url: webhookUrl,
      title: `WooCommerce Order #${order.orderNumber}`,
      metadata: {
        source: 'woocommerce',
        chain,
        wc_order_id: order.orderId,
        return_url: order.returnUrl,
        cancel_url: order.cancelUrl,
      },
    };
  }

  /**
   * Verifies incoming webhook HMAC-SHA256 signature from OwnPay
   */
  static verifyWebhookSignature(
    rawBody: string,
    signature: string,
    timestamp: string | number,
    secret: string
  ): boolean {
    const ts = parseInt(timestamp.toString(), 10);
    const timeDiff = Math.abs(Math.floor(Date.now() / 1000) - ts);
    if (timeDiff > 300) return false;

    const expected = 'v1=' + crypto.createHmac('sha256', secret).update(`${ts}.${rawBody}`).digest('hex');
    if (expected.length !== signature.length) return false;
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }
}
