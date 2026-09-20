/**
 * OwnPay Shopify E-Commerce Gateway Adapter
 * Implements Shopify Offsite Payment Gateway and Admin GraphQL Order Fulfillment.
 */

import * as crypto from 'crypto';
import { OwnPayClient, IntentResponseData } from '../../sdk/src';

export interface ShopifyPaymentSessionParams {
  id: string; // Shopify payment session ID or checkout token
  orderId: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  returnUrl?: string;
  cancelUrl?: string;
  chain?: 'base' | 'solana' | 'bsc' | 'opbnb' | string;
  chainId?: number;
  asset?: 'USDC';
}

export interface ShopifyCheckoutSessionResult {
  intentId: string;
  orderId: string;
  redirectUrl: string;
  usdcAmount: number;
  paymentAddress: string;
}

export interface ShopifyAdminConfig {
  shopDomain: string;
  accessToken: string;
  apiVersion?: string;
}

export interface ShopifyCaptureResult {
  success: boolean;
  orderId: string;
  txHash?: string;
  error?: string;
}

/**
 * Handles offsite checkout redirection and payment session initiation
 */
export class ShopifyOffsiteGateway {
  private ownpayClient: OwnPayClient;
  private webhookSecret: string;
  private baseUrl: string;

  constructor(options: { apiKey: string; webhookSecret: string; baseUrl?: string }) {
    this.baseUrl = options.baseUrl || 'https://ownpaylab.tech';
    this.ownpayClient = new OwnPayClient({
      apiKey: options.apiKey,
      baseUrl: this.baseUrl,
    });
    this.webhookSecret = options.webhookSecret;
  }

  /**
   * Generates OwnPay Payment Intent and returns clean canonical checkout URL
   */
  async createPaymentSession(params: ShopifyPaymentSessionParams): Promise<ShopifyCheckoutSessionResult> {
    const chain = (params.chain || (params.chainId === 101 ? 'solana' : params.chainId === 56 ? 'bsc' : params.chainId === 204 ? 'opbnb' : 'base')) as any;
    const intent: IntentResponseData = await this.ownpayClient.intents.create({
      orderId: `SHOPIFY-${params.orderId}`,
      amount: params.amount,
      currency: params.currency,
      customerEmail: params.customerEmail,
      title: `Shopify Order #${params.orderId}`,
      chain,
      asset: 'USDC',
      metadata: {
        platform: 'shopify',
        chain,
        chain_id: params.chainId || (chain === 'solana' ? 101 : chain === 'bsc' ? 56 : chain === 'opbnb' ? 204 : 8453),
        shopify_session_id: params.id,
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    });

    const cleanBase = rtrimSlash(this.baseUrl);
    const redirectUrl = `${cleanBase}/pay?intent_id=${encodeURIComponent(intent.intent_id)}`;

    return {
      intentId: intent.intent_id,
      orderId: params.orderId,
      redirectUrl,
      usdcAmount: intent.usdc_amount,
      paymentAddress: intent.payment_address,
    };
  }

  /**
   * Verifies incoming webhook from OwnPay for Shopify fulfillment
   */
  verifyWebhook(
    rawBody: string | Buffer,
    signature: string,
    timestamp: string | number
  ): { valid: boolean; event?: any } {
    if (!signature || !timestamp) {
      return { valid: false };
    }

    const ts = parseInt(timestamp.toString(), 10);
    const timeDiff = Math.abs(Math.floor(Date.now() / 1000) - ts);
    if (timeDiff > 300) {
      return { valid: false }; // Replay attack protection
    }

    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
    const expected =
      'v1=' +
      crypto
        .createHmac('sha256', this.webhookSecret)
        .update(`${ts}.${bodyStr}`)
        .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      return { valid: false };
    }

    try {
      const event = JSON.parse(bodyStr);
      return { valid: true, event };
    } catch {
      return { valid: false };
    }
  }
}

/**
 * Interacts with Shopify Admin GraphQL API to auto-fulfill orders after onchain settlement
 */
export class ShopifyAdminClient {
  private shopDomain: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(config: ShopifyAdminConfig) {
    this.shopDomain = config.shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.accessToken = config.accessToken;
    this.apiVersion = config.apiVersion || '2024-01';
  }

  /**
   * Constructs GraphQL query to capture order payment and add timeline receipt
   */
  buildCaptureMutation(params: {
    orderId: string;
    amount: number;
    currency: string;
    txHash: string;
    chainId?: number;
  }): { query: string; variables: any } {
    const chainId = params.chainId || 8453;
    const scanBase = chainId === 84532 ? 'https://sepolia.basescan.org' : 'https://basescan.org';
    const basescanLink = `${scanBase}/tx/${params.txHash}`;

    const query = `
      mutation OrderMarkAsPaid($input: OrderMarkAsPaidInput!) {
        orderMarkAsPaid(input: $input) {
          order {
            id
            displayFinancialStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: params.orderId.startsWith('gid://') ? params.orderId : `gid://shopify/Order/${params.orderId}`,
      },
    };

    return { query, variables };
  }

  /**
   * Constructs GraphQL timeline comment mutation
   */
  buildTimelineCommentMutation(orderId: string, txHash: string, chainId = 8453): { query: string; variables: any } {
    const scanBase = chainId === 84532 ? 'https://sepolia.basescan.org' : 'https://basescan.org';
    const basescanLink = `${scanBase}/tx/${txHash}`;

    const query = `
      mutation OrderCommentAdd($input: OrderCommentAddInput!) {
        orderCommentAdd(input: $input) {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        orderId: orderId.startsWith('gid://') ? orderId : `gid://shopify/Order/${orderId}`,
        message: `OwnPay: Payment confirmed on Base (Chain ID ${chainId}). Explorer Receipt: ${basescanLink}`,
      },
    };

    return { query, variables };
  }

  /**
   * Dispatches GraphQL request to Shopify Admin API
   */
  async executeGraphQL(query: string, variables: any): Promise<any> {
    const endpoint = `https://${this.shopDomain}/admin/api/${this.apiVersion}/graphql.json`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error(`Shopify GraphQL HTTP error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  /**
   * Executes full order fulfillment on Base settlement
   */
  async fulfillSettledOrder(params: {
    orderId: string;
    amount: number;
    currency: string;
    txHash: string;
    chainId?: number;
  }): Promise<ShopifyCaptureResult> {
    try {
      const { query, variables } = this.buildCaptureMutation(params);
      const data = await this.executeGraphQL(query, variables);

      if (data?.data?.orderMarkAsPaid?.userErrors?.length > 0) {
        return {
          success: false,
          orderId: params.orderId,
          error: data.data.orderMarkAsPaid.userErrors[0].message,
        };
      }

      // Add timeline note
      const commentPayload = this.buildTimelineCommentMutation(params.orderId, params.txHash, params.chainId);
      await this.executeGraphQL(commentPayload.query, commentPayload.variables).catch(() => {});

      return {
        success: true,
        orderId: params.orderId,
        txHash: params.txHash,
      };
    } catch (err: any) {
      return {
        success: false,
        orderId: params.orderId,
        error: err.message,
      };
    }
  }
}

function rtrimSlash(str: string): string {
  return str.replace(/\/+$/, '');
}
