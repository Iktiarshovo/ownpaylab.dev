# Frequently Asked Questions (FAQ)

> **Status:** Reference Documentation  
> **Updated:** September 2026  

---

## 1. General Questions

### What is OwnPay?
OwnPay is an institutional-grade, multi-chain payment routing and settlement network. It provides a unified infrastructure layer for both human-driven e-commerce (via reactive checkout modals, QR codes, and Web3 wallets) and autonomous AI agent transactions (via policy-governed session keys, MCP tools, and HTTP 402 protocols).

### How does OwnPay differ from legacy processors (like Stripe)?
- **Settlement Speed:** Traditional processors settle funds in T+2 to T+5 days. OwnPay settles on-chain in seconds (e.g., ~2-4 seconds on Base and Arbitrum).
- **Fees:** Traditional credit card interchange fees average 2.9% + $0.30 per swipe. OwnPay charges low transparent protocol routing fees without predatory interchange spreads.
- **Chargeback Risk:** Web3 settlements are cryptographically final. Merchants face zero risk of fraudulent credit card chargeback clawbacks.
- **Agent Native:** Legacy gateways cannot serve autonomous AI agents. OwnPay provides native programmatic tools and sub-cent micropayments.

### Does OwnPay hold merchant funds (Custodial vs. Non-Custodial)?
**No.** OwnPay is non-custodial. Funds flow directly from the payer's wallet to the merchant's specified settlement destination or smart vault. OwnPay never commingles, locks, or rehypothecates customer capital.

---

## 2. Blockchains & Currencies

### What blockchains are supported?
OwnPay supports high-throughput, low-latency settlement networks:
- **Base (Ethereum L2)**
- **Arbitrum One (Ethereum L2)**
- **Polygon PoS**
- **Solana (SVM)**
- **Ethereum Mainnet (L1)**

### What currencies can customers pay with?
Customers can pay using major liquid stablecoins, including **USDC**, **USDT**, and **EURC**. Cross-chain liquidity routing enables customers to pay with one asset (e.g., USDT on Polygon) while merchants settle in another (e.g., USDC on Base).

---

## 3. Gas Fees & Abstraction

### Do shoppers need ETH or SOL to pay?
No. Through account abstraction (ERC-4337) and EIP-3009/Permit2 gas abstraction, shoppers can approve transactions using only stablecoins. Merchants or OwnPay relayers can sponsor gas fees, completely removing the barrier of needing native gas tokens.

---

## 4. AI Agent Payments & Security

### How do you prevent an AI agent from draining a wallet?
OwnPay implements a strict **Cryptographic Policy Engine**:
- **Hard Per-Transaction Caps:** Limits individual API or tool call spend (e.g., max $0.25).
- **Daily Rolling Budgets:** The agent cannot spend more than the human-assigned 24-hour ceiling (e.g., max $5.00/day).
- **Domain Whitelisting:** Agents can only transact with pre-approved merchant addresses.
- **Session Key Isolation:** The LLM interacts via high-level MCP tools and never accesses raw master private keys.

---

## 5. Chargebacks & Disputes

### Can a customer reverse a payment?
On-chain transactions are cryptographically final and irreversible once target confirmation depths are reached. However, merchants can programmatically issue refunds via the `POST /v1/refunds` API or merchant dashboard, returning stablecoins directly to the payer's address.

---

## 6. Where can I get help?
- **Developer Documentation:** [https://www.ownpaylab.dev](https://www.ownpaylab.dev)
- **Merchant Portal:** [https://ownpaylab.tech](https://ownpaylab.tech)
- **Support Inquiries:** Email `support@ownpaylab.tech`
- **Security Disclosures:** Email `security@ownpaylab.tech`
