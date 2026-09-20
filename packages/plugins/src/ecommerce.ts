import { OwnPayClient, OwnPayWebhook, IntentResponseData } from '../../sdk/src';

export interface StoreCartItem {
  name: string;
  quantity: number;
  unitPrice: number;
  productId?: string;
}

export interface StoreCart {
  orderId: string;
  items: StoreCartItem[];
  currency: string;
  customerEmail?: string;
  couponCode?: string;
  chain?: 'base' | 'solana' | 'bsc' | 'opbnb';
  successUrl?: string;
  cancelUrl?: string;
}

export interface StoreCheckoutResult {
  intentId: string;
  orderId: string;
  checkoutUrl: string;
  usdcAmount: number;
  qrData: string;
  qrImage: string;
  discountAmount?: number;
  totalAmount?: number;
}

export class OwnPayStorePlugin {
  private client: OwnPayClient;
  private webhookSecret: string;

  constructor(options: { apiKey: string; webhookSecret: string; baseUrl?: string }) {
    this.client = new OwnPayClient({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl || 'https://ownpaylab.tech'
    });
    this.webhookSecret = options.webhookSecret;
  }

  /**
   * Convert e-commerce shopping cart into a Base USDC payment intent
   */
  async createCheckoutSession(cart: StoreCart): Promise<StoreCheckoutResult> {
    const totalAmount = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    let discountAmount = 0;
    let finalAmount = totalAmount;

    if (cart.couponCode) {
      try {
        const couponVal = await this.client.coupons.validate({
          code: cart.couponCode,
          subtotal: totalAmount,
          customerId: cart.customerEmail,
        });
        if (couponVal.valid) {
          discountAmount = couponVal.discountAmount;
          finalAmount = couponVal.finalAmount;
        }
      } catch {
        // Fallback to original total if coupon check fails
      }
    }

    const intent: IntentResponseData = await this.client.intents.create({
      orderId: cart.orderId,
      amount: finalAmount,
      currency: cart.currency,
      chain: cart.chain || 'base',
      title: cart.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      customerEmail: cart.customerEmail,
      metadata: {
        item_count: cart.items.length,
        original_subtotal: totalAmount,
        discount_amount: discountAmount,
        coupon_code: cart.couponCode,
        success_url: cart.successUrl,
        cancel_url: cart.cancelUrl
      }
    });

    return {
      intentId: intent.intent_id,
      orderId: intent.order_id,
      checkoutUrl: `${this.client.baseUrl}/pay?intent_id=${intent.intent_id}`,
      usdcAmount: intent.usdc_amount,
      qrData: intent.qr_data,
      qrImage: intent.qr_image,
      discountAmount,
      totalAmount: finalAmount,
    };
  }

  /**
   * Validate a promotional coupon code against an e-commerce cart subtotal
   */
  async validateCoupon(code: string, subtotal: number, customerEmail?: string) {
    return this.client.coupons.validate({
      code,
      subtotal,
      customerId: customerEmail,
    });
  }

  /**
   * Process and verify incoming signed webhook callback from OwnPay
   */
  handleWebhookFulfillment(
    rawBody: string | Buffer,
    signature: string,
    timestamp: string | number
  ): { fulfilled: boolean; orderId: string; txHash?: string } {
    const event = OwnPayWebhook.constructEvent(rawBody, signature, timestamp, this.webhookSecret);

    if (event.event === 'intent.settled') {
      const data = event.data;
      return {
        fulfilled: true,
        orderId: data.order_id,
        txHash: data.tx_hash
      };
    }

    return {
      fulfilled: false,
      orderId: event.data?.order_id
    };
  }
}
