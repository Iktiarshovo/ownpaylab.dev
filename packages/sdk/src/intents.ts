import type { CreateIntentParams, IntentResponseData } from './types';

export interface RequestClient {
  request<T = any>(path: string, method?: string, body?: any): Promise<T>;
}

export class IntentsAPI {
  constructor(private readonly client: RequestClient) {}

  /**
   * Creates a new multi-chain payment intent on OwnPay.
   * Supports Base L2, Solana, BNB Smart Chain (BSC), and opBNB.
   */
  async create(params: CreateIntentParams): Promise<IntentResponseData> {
    const payload: Record<string, any> = {
      merchant_id: params.merchantId || 'auto',
      order_id: params.orderId,
      amount: params.amount,
      currency: params.currency || 'USD',
      title: params.title,
      customer_email: params.customerEmail,
      webhook_url: params.webhookUrl,
      metadata: params.metadata,
    };

    if (params.chain) {
      payload.chain = params.chain;
    }

    if (params.asset) {
      payload.asset = params.asset;
    }

    return this.client.request<IntentResponseData>('/api/v1/intents', 'POST', payload);
  }

  /**
   * Retrieves an existing payment intent by ID.
   */
  async get(intentId: string): Promise<IntentResponseData> {
    return this.client.request<IntentResponseData>(`/api/v1/intents/${intentId}`, 'GET');
  }

  /**
   * Verifies the on-chain settlement status of a payment intent.
   */
  async verify(intentId: string): Promise<{ settled: boolean; tx_hash?: string; status: string }> {
    return this.client.request(`/api/v1/intents/${intentId}/status`, 'GET');
  }
}
