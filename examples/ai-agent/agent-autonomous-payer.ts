/**
 * Autonomous AI Agent Payment Handler
 * Demonstrates policy-enforced payments for autonomous AI agents using OwnPay SDK.
 */

import { OwnPayClient } from '@ownpay/sdk';

// 1. Human-Configured Policy Limits
interface AgentSpendPolicy {
  maxPerTransactionUsd: number;
  dailySpendingLimitUsd: number;
  whitelistedMerchants: string[];
}

const POLICY: AgentSpendPolicy = {
  maxPerTransactionUsd: 0.50, // Max 50 cents per API/inference call
  dailySpendingLimitUsd: 5.00, // Max 5 dollars per day
  whitelistedMerchants: [
    '0xYourMerchantSettlementAddress1234567890abcdef',
    '0x71C8364793A8Bcd9f323a6f1988656c8c207e3a9',
  ],
};

// Rolling ledger tracking spend
let cumulative24HourSpendUsd = 1.25;

const ownpay = new OwnPayClient({
  apiKey: process.env.OWNPAY_SECRET_KEY || 'own_sec_test_mock_1234567890abcdef',
});

interface InvoiceChallenge {
  invoiceId: string;
  amountUsd: number;
  recipientAddress: string;
  chain: 'base' | 'polygon';
}

/**
 * Autonomous payment executor verifying safety invariants before dispatch
 */
async function payInvoiceAutonomously(invoice: InvoiceChallenge) {
  console.log(`[Agent] Evaluating invoice: ${invoice.invoiceId} for $${invoice.amountUsd}...`);

  // Guardrail 1: Per-transaction ceiling
  if (invoice.amountUsd > POLICY.maxPerTransactionUsd) {
    throw new Error(
      `[Policy Violation] Amount $${invoice.amountUsd} exceeds max per-tx limit of $${POLICY.maxPerTransactionUsd}`
    );
  }

  // Guardrail 2: 24-hour spending envelope
  if (cumulative24HourSpendUsd + invoice.amountUsd > POLICY.dailySpendingLimitUsd) {
    throw new Error(
      `[Policy Violation] Daily spend cap reached ($${cumulative24HourSpendUsd} / $${POLICY.dailySpendingLimitUsd})`
    );
  }

  // Guardrail 3: Whitelisted recipient
  if (!POLICY.whitelistedMerchants.includes(invoice.recipientAddress)) {
    throw new Error(
      `[Policy Violation] Recipient ${invoice.recipientAddress} is not in the approved merchant whitelist`
    );
  }

  console.log('[Agent] All policy invariants passed. Initiating payment intent...');

  const intent = await ownpay.paymentIntents.create({
    amount: invoice.amountUsd.toFixed(2),
    currency: 'USD',
    settlementToken: 'USDC',
    settlementChain: invoice.chain,
    recipientAddress: invoice.recipientAddress,
    idempotencyKey: `agent_pay_${invoice.invoiceId}`,
    metadata: {
      agentId: 'research_agent_v3',
      invoiceId: invoice.invoiceId,
    },
  });

  cumulative24HourSpendUsd += invoice.amountUsd;

  console.log(`[Agent] Payment successfully dispatched! Intent ID: ${intent.id}`);
  console.log(`[Agent] Updated 24h spend: $${cumulative24HourSpendUsd.toFixed(2)}`);

  return intent;
}

// Simulated execution run
async function main() {
  const mockInvoice: InvoiceChallenge = {
    invoiceId: 'inv_market_intel_9941',
    amountUsd: 0.05,
    recipientAddress: '0xYourMerchantSettlementAddress1234567890abcdef',
    chain: 'base',
  };

  try {
    await payInvoiceAutonomously(mockInvoice);
  } catch (err: any) {
    console.error(`[Agent Error] ${err.message}`);
  }
}

main();
