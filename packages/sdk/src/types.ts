export type SupportedChain = 'base' | 'solana' | 'bsc' | 'opbnb';

export type NominalCurrency = 'USD' | 'EUR' | 'GBP' | 'BDT' | 'INR' | 'PKR' | 'USDC';

export interface OwnPayClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface CreateIntentParams {
  orderId: string;
  amount: number;
  currency?: NominalCurrency | string;
  merchantId?: string;
  title?: string;
  customerEmail?: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
  chain?: SupportedChain;
  asset?: 'USDC';
}

export interface IntentResponseData {
  intent_id: string;
  order_id: string;
  qr_data: string;
  qr_image: string;
  usdc_amount: number;
  fiat_amount: number;
  fiat_currency: string;
  exchange_rate: number;
  payment_address: string;
  expires_at: string;
  status: 'PENDING' | 'SETTLING' | 'SETTLED' | 'EXPIRED' | 'FAILED';
  chain: SupportedChain;
  chain_id: number;
  network: string;
  asset: 'USDC';
  decimals: number;
  is_sandbox: boolean;
  tx_hash?: string;
  solana_pay_url?: string;
  eip681_url?: string;
}

export interface AgentPayParams {
  merchantAddress: string;
  amountUsdc: number;
  sessionKey: string;
  chain?: SupportedChain;
  asset?: 'USDC';
  taskId?: string;
  purpose?: string;
}

export interface AgentPayResponse {
  success: boolean;
  tx_hash: string;
  intent_id?: string;
  gas_sponsored: boolean;
  settled_amount: number;
  timestamp: string;
  chain?: SupportedChain;
  network?: string;
}

export interface CreateSessionKeyParams {
  agentAddress: string;
  dailySpendLimitUsdc: number;
  allowedRecipientDomains?: string[];
  expiresInHours?: number;
}

export interface SessionKeyResponse {
  session_key: string;
  agent_address: string;
  daily_limit: number;
  expires_at: string;
  revocation_id: string;
}

export type SessionExpiryOption = '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'no_limit';

export interface CreateAgentSessionParams {
  agentId: string;
  merchantId?: string;
  durationSeconds?: number;
  expiryOption?: SessionExpiryOption;
  confirmNoExpiry?: boolean;
  maxPerTransaction?: number;
  maxSessionSpend?: number;
  allowedRecipients?: string[];
  allowedAsset?: string;
  allowedChain?: SupportedChain | string;
}

export interface AgentSessionData {
  id: string;
  agentId: string;
  merchantId: string;
  status: 'ACTIVE' | 'PENDING_HUMAN_APPROVAL' | 'EXHAUSTED' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';
  maxPerTransaction: number;
  maxSessionSpend: number;
  spentAmount: number;
  remainingAmount: number;
  allowedRecipients: string[];
  allowedAsset: string;
  allowedChain: string;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
  revokedReason?: string;
  lastUsedAt?: string;
  expiryOption?: SessionExpiryOption;
  isNonExpiring?: boolean;
  policyHash?: string;
}

export interface CreateAgentSessionResponse {
  session: AgentSessionData;
  sessionToken: string;
  warning?: string;
}

export interface AgentPolicyVersion {
  id: string;
  policyId: string;
  agentId: string;
  version: string;
  policyHash: string;
  policyData: Record<string, any>;
  createdBy?: string;
  createdAt: string;
}

export interface AgentApprovalItem {
  id: string;
  organizationId: string;
  agentId: string;
  intentId: string;
  amount: number;
  token: string;
  chain: string;
  recipient: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  approvedBy?: string;
  expiresAt: string;
  createdAt: string;
}

export interface X402ChallengeResponse {
  statusCode: 402;
  paywallId: string;
  priceUsdc: number;
  recipientAddress: string;
  chainId: number;
  authHeader: string;
}

export interface OwnPayWebhookEvent<T = any> {
  id: string;
  event:
    | 'intent.settled'
    | 'intent.failed'
    | 'payment.confirmed'
    | 'payment.failed'
    | 'payment.expired'
    | 'agent.paid'
    | 'session_key.revoked'
    | 'x402.settled'
    | 'order.created'
    | 'subscription.renewed'
    | 'subscription.cancelled'
    | 'refund.processed';
  created_at: string;
  data: T;
}

// -------------------------------------------------------------------------
// NICHE & CAPABILITY TYPES
// -------------------------------------------------------------------------

export type MerchantNiche =
  | 'DEVELOPER'
  | 'FREELANCER'
  | 'INFLUENCER'
  | 'ONLINE_BUSINESS'
  | 'SMALL_COMPANY'
  | 'ENTERPRISE'
  | 'RETAIL'
  | 'RESTAURANT'
  | 'POS_PHYSICAL';

export interface MerchantCapabilities {
  niche: MerchantNiche;
  productCatalog: boolean;
  subscriptions: boolean;
  coupons: boolean;
  posQr: boolean;
  refunds: boolean;
  requiresStorefront: boolean;
  allowedPaymentTypes: ('ONE_TIME' | 'SUBSCRIPTION')[];
}

// -------------------------------------------------------------------------
// PRODUCT COMMERCE TYPES
// -------------------------------------------------------------------------

export type ProductPaymentType = 'ONE_TIME' | 'SUBSCRIPTION';
export type ProductStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface Product {
  id: string;
  organizationId: string;
  merchantProfileId?: string;
  productCode: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  settlementToken: string;
  paymentType: ProductPaymentType;
  vatEnabled: boolean;
  vatRate: number;
  couponEligible: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductParams {
  productCode: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  settlementToken?: string;
  paymentType?: ProductPaymentType;
  vatEnabled?: boolean;
  vatRate?: number;
  couponEligible?: boolean;
  merchantId?: string;
}

export interface UpdateProductParams {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  vatEnabled?: boolean;
  vatRate?: number;
  couponEligible?: boolean;
  status?: ProductStatus;
}

// -------------------------------------------------------------------------
// COUPON TYPES
// -------------------------------------------------------------------------

export type CouponDiscountType = 'PERCENTAGE' | 'FIXED';
export type CouponStatus = 'ACTIVE' | 'EXPIRED' | 'DISABLED';

export interface Coupon {
  id: string;
  organizationId: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  startAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit: number;
  applicableProductIds: string[];
  status: CouponStatus;
  createdAt: string;
}

export interface CreateCouponParams {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  startAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  applicableProductIds?: string[];
  merchantId?: string;
}

export interface ValidateCouponParams {
  code: string;
  subtotal: number;
  productId?: string;
  customerId?: string;
  merchantId?: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  couponId?: string;
  code?: string;
  discountType?: CouponDiscountType;
  discountValue?: number;
  discountAmount: number;
  finalAmount: number;
  message?: string;
}

// -------------------------------------------------------------------------
// ORDER & CHECKOUT TYPES
// -------------------------------------------------------------------------

export interface OrderRecord {
  id: string;
  organizationId: string;
  productId: string;
  customerId?: string;
  paymentIntentId?: string;
  subtotal: number;
  discountAmount: number;
  taxableSubtotal: number;
  vatAmount: number;
  vatRate: number;
  totalAmount: number;
  currency: string;
  couponId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutOrderParams {
  productId: string;
  customerId: string;
  couponCode?: string;
  currency?: string;
  chain?: SupportedChain;
  billingInterval?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  merchantId?: string;
}

export interface CheckoutOrderResponse {
  order: OrderRecord;
  intent: IntentResponseData;
  subscription?: SubscriptionRecord;
  pricingSummary: {
    subtotal: number;
    discountAmount: number;
    taxableSubtotal: number;
    vatAmount: number;
    vatRate: number;
    totalAmount: number;
    currency: string;
    usdcAmount: number;
  };
}

// -------------------------------------------------------------------------
// SUBSCRIPTION TYPES
// -------------------------------------------------------------------------

export type SubscriptionInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED';

export interface SubscriptionRecord {
  id: string;
  organizationId: string;
  productId: string;
  customerId: string;
  billingInterval: SubscriptionInterval;
  status: SubscriptionStatus;
  renewalMode: string;
  authorizationReference?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextRenewalAt: string;
  lastRenewalAt?: string;
  renewalCount: number;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------------------
// REFUND TYPES
// -------------------------------------------------------------------------

export type RefundStatus = 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface RefundRecord {
  id: string;
  organizationId: string;
  paymentId: string;
  orderId?: string;
  originalTxHash?: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason?: string;
  createdAt: string;
  completedAt?: string;
}

export interface RequestRefundParams {
  paymentId: string;
  amount: number;
  reason?: string;
  orderId?: string;
  merchantId?: string;
}
