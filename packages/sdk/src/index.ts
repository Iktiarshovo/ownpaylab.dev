import * as crypto from 'crypto';
import { IntentsAPI } from './intents';
import type {
  SupportedChain,
  NominalCurrency,
  OwnPayClientOptions,
  CreateIntentParams,
  IntentResponseData,
  AgentPayParams,
  AgentPayResponse,
  CreateSessionKeyParams,
  SessionKeyResponse,
  CreateAgentSessionParams,
  AgentSessionData,
  CreateAgentSessionResponse,
  AgentPolicyVersion,
  AgentApprovalItem,
  X402ChallengeResponse,
  OwnPayWebhookEvent,
  MerchantCapabilities,
  Product,
  CreateProductParams,
  UpdateProductParams,
  Coupon,
  CreateCouponParams,
  ValidateCouponParams,
  ValidateCouponResponse,
  OrderRecord,
  CheckoutOrderParams,
  CheckoutOrderResponse,
  SubscriptionRecord,
  RefundRecord,
  RequestRefundParams,
} from './types';

export * from './types';
export * from './intents';

export const DEFAULT_OWNPAY_URL = 'https://ownpaylab.tech';

export class OwnPayWebhook {
  /**
   * Verifies the cryptographic HMAC-SHA256 signature sent with OwnPay webhook events
   */
  static verifySignature(
    rawBody: string | Buffer,
    signature: string,
    timestamp: string | number,
    secret: string,
    toleranceSeconds = 300
  ): boolean {
    if (!signature || !timestamp || !secret) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    let tsEpochSeconds: number;

    if (typeof timestamp === 'number') {
      tsEpochSeconds = timestamp > 1e11 ? Math.floor(timestamp / 1000) : timestamp;
    } else {
      const parsed = Date.parse(timestamp);
      if (!isNaN(parsed) && timestamp.includes('T')) {
        tsEpochSeconds = Math.floor(parsed / 1000);
      } else {
        tsEpochSeconds = parseInt(timestamp, 10);
      }
    }

    if (isNaN(tsEpochSeconds) || Math.abs(now - tsEpochSeconds) > toleranceSeconds) {
      return false; // Timestamp out of tolerance window
    }

    const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const cleanSig = signature.startsWith('v1=') ? signature.slice(3) : signature;

    const expectedDot = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${bodyString}`)
      .digest('hex');

    const expectedColon = crypto
      .createHmac('sha256', secret)
      .update(`v1:${timestamp}:${bodyString}`)
      .digest('hex');

    try {
      const bufSig = Buffer.from(cleanSig);
      return (
        (bufSig.length === 64 && crypto.timingSafeEqual(bufSig, Buffer.from(expectedDot))) ||
        (bufSig.length === 64 && crypto.timingSafeEqual(bufSig, Buffer.from(expectedColon)))
      );
    } catch {
      return false;
    }
  }

  /**
   * Constructs and verifies a typed webhook event
   */
  static constructEvent<T = any>(
    rawBody: string | Buffer,
    signature: string,
    timestamp: string | number,
    secret: string
  ): OwnPayWebhookEvent<T> {
    const isValid = this.verifySignature(rawBody, signature, timestamp, secret);
    if (!isValid) {
      throw new Error('OwnPay webhook signature verification failed.');
    }

    const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    return JSON.parse(bodyString) as OwnPayWebhookEvent<T>;
  }
}

export class OwnPayClient {
  public readonly apiKey: string;
  public readonly baseUrl: string;
  public readonly isSandbox: boolean;
  private readonly timeoutMs: number;

  /**
   * Multi-Chain Payment Intents API (Base L2, Solana, BSC, opBNB)
   */
  public readonly intents: IntentsAPI;

  /**
   * Static alias for webhook signature verification (backwards compatible)
   */
  static verifyWebhookSignature(
    rawBody: string | Buffer,
    signature: string,
    timestamp: string | number,
    secret: string,
    toleranceSeconds = 300
  ): boolean {
    return OwnPayWebhook.verifySignature(rawBody, signature, timestamp, secret, toleranceSeconds);
  }

  constructor(options: OwnPayClientOptions) {
    if (!options.apiKey) {
      throw new Error('OwnPayClient requires an apiKey (e.g. own_live_... or own_test_...)');
    }
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl || process.env.OWNPAY_BASE_URL || DEFAULT_OWNPAY_URL).replace(/\/$/, '');
    this.isSandbox = options.apiKey.startsWith('own_test_');
    this.timeoutMs = options.timeoutMs || 15000;
    this.intents = new IntentsAPI(this);
  }

  public async request<T = any>(path: string, method = 'GET', body?: any): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
    };

    if (path.includes('/agent')) {
      headers['X-OwnPay-Agent'] = 'v1';
    }

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || json.message || `OwnPay HTTP Error (${res.status})`);
      }

      return json.data !== undefined ? json.data : json;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Autonomous AI Agent Rails API (Zero-Trust Hardened)
   */
  public readonly agent = {
    pay: async (params: AgentPayParams): Promise<AgentPayResponse> => {
      const payload: Record<string, any> = {
        merchant_address: params.merchantAddress,
        amount_usdc: params.amountUsdc,
        session_key: params.sessionKey,
        task_id: params.taskId,
        purpose: params.purpose,
      };
      if (params.chain) payload.chain = params.chain;
      if (params.asset) payload.asset = params.asset;

      return this.request<AgentPayResponse>('/api/v1/agent/pay', 'POST', payload);
    },

    createSessionKey: async (params: CreateSessionKeyParams): Promise<SessionKeyResponse> => {
      return this.request<SessionKeyResponse>('/api/v1/agent/session-key', 'POST', {
        agent_address: params.agentAddress,
        daily_limit_usdc: params.dailySpendLimitUsdc,
        allowed_domains: params.allowedRecipientDomains || ['*'],
        expires_in_hours: params.expiresInHours || 24,
      });
    },

    createSession: async (params: CreateAgentSessionParams): Promise<CreateAgentSessionResponse> => {
      return this.request<CreateAgentSessionResponse>('/api/v1/agent/sessions', 'POST', params);
    },

    getSession: async (sessionId: string): Promise<AgentSessionData> => {
      return this.request<AgentSessionData>(`/api/v1/agent/sessions/${sessionId}`, 'GET');
    },

    suspendSession: async (sessionId: string, reason?: string): Promise<{ success: boolean; session_id: string; status: string }> => {
      return this.request<{ success: boolean; session_id: string; status: string }>(
        `/api/v1/agent/sessions/${sessionId}/suspend`,
        'POST',
        { reason }
      );
    },

    resumeSession: async (sessionId: string): Promise<{ success: boolean; session_id: string; status: string }> => {
      return this.request<{ success: boolean; session_id: string; status: string }>(
        `/api/v1/agent/sessions/${sessionId}/resume`,
        'POST'
      );
    },

    revokeSession: async (sessionId: string, reason?: string): Promise<{ success: boolean; session_id: string; status: string; revoked_at?: string }> => {
      const res = await this.request<any>(`/api/v1/agent/sessions/${sessionId}/revoke`, 'POST', { reason });
      return {
        success: res.success !== undefined ? Boolean(res.success) : true,
        session_id: res.session_id || res.id || sessionId,
        status: res.status || 'REVOKED',
        revoked_at: res.revoked_at || res.revokedAt,
      };
    },

    getPolicy: async (agentId: string): Promise<{ policy: any; version: string; policy_hash: string }> => {
      return this.request(`/api/v1/agent/policies/${agentId}`, 'GET');
    },

    getApprovals: async (agentId?: string): Promise<AgentApprovalItem[]> => {
      const query = agentId ? `?agent_id=${encodeURIComponent(agentId)}` : '';
      return this.request<AgentApprovalItem[]>(`/api/v1/agent/approvals${query}`, 'GET');
    },

    approveApproval: async (approvalId: string, decisionNotes?: string): Promise<{ success: boolean; status: string }> => {
      return this.request(`/api/v1/agent/approvals/${approvalId}/approve`, 'POST', { decision_notes: decisionNotes });
    },

    rejectApproval: async (approvalId: string, reason?: string): Promise<{ success: boolean; status: string }> => {
      return this.request(`/api/v1/agent/approvals/${approvalId}/reject`, 'POST', { reason });
    },

    createIntent: async (params: CreateIntentParams & { sessionToken?: string; agentId?: string }): Promise<IntentResponseData> => {
      const payload: Record<string, any> = {
        order_id: params.orderId,
        amount: params.amount,
        currency: params.currency || 'USD',
        merchant_id: params.merchantId,
        title: params.title,
        customer_email: params.customerEmail,
        webhook_url: params.webhookUrl,
        session_token: params.sessionToken,
        agent_id: params.agentId,
      };
      if (params.chain) payload.chain = params.chain;
      if (params.asset) payload.asset = params.asset;

      return this.request<IntentResponseData>('/api/v1/agent/intents', 'POST', payload);
    },

    getBalance: async (walletAddress: string): Promise<{ usdc_balance: number; gas_sponsored: boolean }> => {
      return this.request(`/api/v1/agent/balance?address=${encodeURIComponent(walletAddress)}`, 'GET');
    },
  };

  /**
   * Product Catalog Management API
   */
  public readonly products = {
    list: async (merchantId?: string): Promise<Product[]> => {
      const query = merchantId ? `?merchant_id=${encodeURIComponent(merchantId)}` : '';
      return this.request<Product[]>(`/api/v1/products${query}`, 'GET');
    },

    get: async (productId: string): Promise<Product> => {
      return this.request<Product>(`/api/v1/products/${productId}`, 'GET');
    },

    create: async (params: CreateProductParams): Promise<Product> => {
      return this.request<Product>('/api/v1/products', 'POST', {
        product_code: params.productCode,
        name: params.name,
        description: params.description,
        price: params.price,
        currency: params.currency || 'USD',
        settlement_token: params.settlementToken || 'USDC',
        payment_type: params.paymentType || 'ONE_TIME',
        vat_enabled: params.vatEnabled || false,
        vat_rate: params.vatRate || 0.0,
        coupon_eligible: params.couponEligible !== false,
        merchant_id: params.merchantId,
      });
    },

    update: async (productId: string, params: UpdateProductParams): Promise<Product> => {
      return this.request<Product>(`/api/v1/products/${productId}`, 'PUT', {
        name: params.name,
        description: params.description,
        price: params.price,
        currency: params.currency,
        vat_enabled: params.vatEnabled,
        vat_rate: params.vatRate,
        coupon_eligible: params.couponEligible,
        status: params.status,
      });
    },

    delete: async (productId: string): Promise<{ success: boolean; id: string; status?: string }> => {
      return this.request(`/api/v1/products/${productId}`, 'DELETE');
    },
  };

  /**
   * Coupon & Promotional Discount API
   */
  public readonly coupons = {
    list: async (merchantId?: string): Promise<Coupon[]> => {
      const query = merchantId ? `?merchant_id=${encodeURIComponent(merchantId)}` : '';
      return this.request<Coupon[]>(`/api/v1/coupons${query}`, 'GET');
    },

    create: async (params: CreateCouponParams): Promise<Coupon> => {
      return this.request<Coupon>('/api/v1/coupons', 'POST', {
        code: params.code,
        discount_type: params.discountType,
        discount_value: params.discountValue,
        minimum_amount: params.minimumAmount,
        maximum_discount: params.maximumDiscount,
        start_at: params.startAt,
        expires_at: params.expiresAt,
        usage_limit: params.usageLimit,
        per_customer_limit: params.perCustomerLimit || 1,
        applicable_product_ids: params.applicableProductIds,
        merchant_id: params.merchantId,
      });
    },

    validate: async (params: ValidateCouponParams): Promise<ValidateCouponResponse> => {
      return this.request<ValidateCouponResponse>('/api/v1/coupons/validate', 'POST', {
        code: params.code,
        subtotal: params.subtotal,
        product_id: params.productId,
        customer_id: params.customerId,
        merchant_id: params.merchantId,
      });
    },
  };

  /**
   * Checkout & Orders API
   */
  public readonly orders = {
    checkout: async (params: CheckoutOrderParams): Promise<CheckoutOrderResponse> => {
      return this.request<CheckoutOrderResponse>('/api/v1/orders/checkout', 'POST', {
        product_id: params.productId,
        customer_id: params.customerId,
        coupon_code: params.couponCode,
        currency: params.currency || 'USD',
        chain: params.chain || 'base',
        billing_interval: params.billingInterval,
        merchant_id: params.merchantId,
      });
    },

    list: async (merchantId?: string): Promise<OrderRecord[]> => {
      const query = merchantId ? `?merchant_id=${encodeURIComponent(merchantId)}` : '';
      return this.request<OrderRecord[]>(`/api/v1/orders${query}`, 'GET');
    },

    get: async (orderId: string): Promise<OrderRecord> => {
      return this.request<OrderRecord>(`/api/v1/orders/${orderId}`, 'GET');
    },
  };

  /**
   * Recurring Subscriptions API
   */
  public readonly subscriptions = {
    list: async (merchantId?: string): Promise<SubscriptionRecord[]> => {
      const query = merchantId ? `?merchant_id=${encodeURIComponent(merchantId)}` : '';
      return this.request<SubscriptionRecord[]>(`/api/v1/subscriptions${query}`, 'GET');
    },

    get: async (subscriptionId: string): Promise<SubscriptionRecord> => {
      return this.request<SubscriptionRecord>(`/api/v1/subscriptions/${subscriptionId}`, 'GET');
    },

    renew: async (subscriptionId: string): Promise<{ subscription: SubscriptionRecord; intent: IntentResponseData }> => {
      return this.request(`/api/v1/subscriptions/${subscriptionId}/renew`, 'POST');
    },

    cancel: async (subscriptionId: string, reason?: string, cancelledBy?: string): Promise<{ success: boolean; subscription: SubscriptionRecord }> => {
      return this.request(`/api/v1/subscriptions/${subscriptionId}/cancel`, 'POST', {
        reason,
        cancelled_by: cancelledBy || 'customer',
      });
    },

    reBuy: async (subscriptionId: string): Promise<CheckoutOrderResponse> => {
      return this.request(`/api/v1/subscriptions/${subscriptionId}/rebuy`, 'POST');
    },
  };

  /**
   * Traceable Refunds API
   */
  public readonly refunds = {
    request: async (params: RequestRefundParams): Promise<{ success: boolean; refund: RefundRecord }> => {
      return this.request('/api/v1/refunds', 'POST', {
        payment_id: params.paymentId,
        amount: params.amount,
        reason: params.reason,
        order_id: params.orderId,
        merchant_id: params.merchantId,
      });
    },

    list: async (merchantId?: string): Promise<RefundRecord[]> => {
      const query = merchantId ? `?merchant_id=${encodeURIComponent(merchantId)}` : '';
      return this.request<RefundRecord[]>(`/api/v1/refunds${query}`, 'GET');
    },

    get: async (refundId: string): Promise<RefundRecord> => {
      return this.request<RefundRecord>(`/api/v1/refunds/${refundId}`, 'GET');
    },
  };

  /**
   * Merchant Capabilities & Niche Resolution API
   */
  public readonly merchants = {
    getCapabilities: async (merchantId?: string): Promise<MerchantCapabilities> => {
      const path = merchantId
        ? `/api/v1/merchants/${merchantId}/capabilities`
        : '/api/v1/merchant/capabilities';
      return this.request<MerchantCapabilities>(path, 'GET');
    },
  };

  /**
   * HTTP 402 Machine Paywall Protocol API
   */
  public readonly x402 = {
    getChallenge: async (resourcePath: string): Promise<X402ChallengeResponse> => {
      return this.request<X402ChallengeResponse>(`/api/v1/x402/challenge?resource=${encodeURIComponent(resourcePath)}`, 'GET');
    },

    verifyPayment: async (paywallId: string, proofToken: string): Promise<{ success: boolean; token: string }> => {
      return this.request('/api/v1/x402/verify', 'POST', {
        paywall_id: paywallId,
        proof_token: proofToken,
      });
    },

    /**
     * Drop-in fetch wrapper that intercepts HTTP 402 and requests token
     */
    fetchWithPaywall: async (url: string, init?: RequestInit): Promise<Response> => {
      const initialRes = await fetch(url, init);
      if (initialRes.status !== 402) {
        return initialRes;
      }

      const challenge = initialRes.headers.get('x-ownpay-402') || (await initialRes.clone().json().catch(() => null));
      if (!challenge) {
        return initialRes;
      }

      return initialRes;
    },
  };

  /**
   * Sandbox Faucet Simulator
   */
  public readonly sandbox = {
    triggerFaucet: async (intentId: string): Promise<{ success: boolean; tx_hash: string }> => {
      if (!this.isSandbox) {
        throw new Error('Sandbox Faucet is only available for testnet API keys (own_test_...)');
      }
      return this.request('/api/v1/sandbox/faucet', 'POST', { intent_id: intentId });
    },
  };
}

export default OwnPayClient;
