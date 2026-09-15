# OwnPay System Overview

> **Status:** Production & Active Development  
> **Target Audience:** Architects, Developers, FinTech Integrators, Protocol Engineers  

---

## 1. The Broken Paradigm of Modern Payments

The modern digital economy operates on two fractured rails:

1. **Legacy Traditional Rails (Cards & ACH):**
   - **High Friction & Costs:** 2.5% to 3.9% + interchange fees erode merchant margins.
   - **Delayed Settlement:** T+2 to T+5 settlement cycles trap working capital.
   - **Chargeback Vulnerability:** Merchants carry 100% of chargeback fraud risk.
   - **Human-Only Assumptions:** Legacy rails require manual card entry, 3DS challenges, or SMS OTPs—completely incompatible with automated machine-to-machine transactions.

2. **Early Web3 Crypto Checkout:**
   - **Severe UX Friction:** Gas calculation errors, chain-switching modal confusion, and unverified raw hexadecimal contract approvals alienate mainstream consumers.
   - **Zero Enterprise Guardrails:** Lack of webhook idempotency, missing unified settlement reporting, and chaotic multi-chain reconciliation.
   - **No Native Machine Protocols:** AI agents cannot autonomously operate on existing checkout pages without exposing raw private keys or risking wallet draining.

---

## 2. The OwnPay Solution: Dual-Rail Settlement Infrastructure

**OwnPay** re-engineers modern payments by delivering an institutional-grade, multi-chain settlement engine optimized simultaneously for two distinct economic actors:

```text
                               +-----------------------------+
                               |     OwnPay Global Router    |
                               +--------------+--------------+
                                              |
                   +--------------------------+--------------------------+
                   |                                                     |
                   v                                                     v
        [ RAIL 1: HUMAN COMMERCE ]                           [ RAIL 2: AGENTIC COMMERCE ]
    - Embedded 1-Click Checkout Modal                     - Programmatic PaymentIntents via SDK/API
    - Multi-Chain Web3 Wallets (EVM & SVM)                - Policy Guardrails (Spend limits, TTL)
    - Dynamic QR Codes for Mobile Pay                     - Model Context Protocol (MCP) Tools
    - Zero-Gas Abstracted Experience                      - HTTP 402 Payment Required Protocol
                   |                                                     |
                   +--------------------------+--------------------------+
                                              |
                                              v
                              +-------------------------------+
                              |    Universal Settlement Layer |
                              | - Real-time on-chain finality |
                              | - Multi-stablecoin routing    |
                              | - Non-custodial payout routes |
                              | - Cryptographic webhook proofs|
                              +-------------------------------+
```

---

## 3. Core Architectural Pillars

### Non-Custodial Security & Merchant Sovereignty
OwnPay acts as a settlement orchestration router. Merchants maintain direct custody and control of their settlement destinations. Funds settle directly to merchant-controlled on-chain addresses or segregated smart vaults without intermediaries locking funds.

### Dual-Rail Universality
OwnPay does not force artificial separation between human buyers and autonomous software agents:
- **For Humans:** A sleek, reactive checkout modal with QR code support, biometric passkey authorization, and zero gas friction.
- **For AI Agents:** A deterministic REST/JSON-RPC API, Model Context Protocol (MCP) server, and native HTTP 402 protocol integration enabling sub-second micropayments within defined policy constraints.

### Multi-Chain Interoperability
Settlement occurs across premier EVM chains (Ethereum, Base, Polygon, Arbitrum) and high-throughput networks (Solana), natively supporting major liquid stablecoins (USDC, USDT, EURC).

### Institutional Resilience
Built with bank-grade idempotency keys, SHA-256 HMAC webhook signatures, automated exponential retry engines, and atomic on-chain state verification.

---

## 4. Platform Ecosystem Map

OwnPay maintains four dedicated domain environments designed for clear separation of concerns:

- **Main Brand & Protocol:** [`https://ownpay.tech`](https://ownpay.tech) — Public presence, protocol mission, and institutional vision.
- **Merchant Platform:** [`https://ownpaylab.tech`](https://ownpaylab.tech) — Merchant dashboard, API key generation, settlement analytics, and billing administration.
- **Developer Platform & Lab:** [`https://www.ownpaylab.dev`](https://www.ownpaylab.dev) — Public open-source repository, protocol specs, SDK documentation, and community resources.
- **Consumer Portal:** [`https://ownpay.me`](https://ownpay.me) — Future consumer-facing wallet and cross-merchant payment profile (*Reserved / Waitlist*).

---

## 5. Next Steps

- Explore the [Complete System Architecture](./architecture.md).
- Learn about the [Human Rail](./human-rail.md) and [Agent Rail](./agent-rail.md).
- Follow the [Developer Getting Started Guide](./getting-started.md).
