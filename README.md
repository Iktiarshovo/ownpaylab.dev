# OwnPay Lab

### Public Developer & Ecosystem Hub

> **OwnPay is building programmable payment and settlement infrastructure for merchants, developers, and autonomous AI agents.**

[![Network: Base Mainnet](https://img.shields.io/badge/Network-Base%20Mainnet%20(8453)-0052FF?style=flat-square&logo=coinbase)](https://base.org)
[![Settlement: Circle USDC](https://img.shields.io/badge/Settlement-Native%20Circle%20USDC-2775CA?style=flat-square&logo=circle)](https://www.circle.com/en/usdc)
[![Architecture: Non--Custodial](https://img.shields.io/badge/Architecture-Non--Custodial%20Intent%20Layer-10B981?style=flat-square)](#architecture)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-F59E0B?style=flat-square)](LICENSE)
[![Status: Public Developer Lab](https://img.shields.io/badge/Status-Active%20Development-8B5CF6?style=flat-square)](#official-platforms)

---

## 🌐 Official Platforms & Canonical Ecosystem

OwnPay maintains strict architectural separation across four distinct ecosystem domains:

| Property | Canonical URL | Audience & Operational Mandate | Status |
| :--- | :--- | :--- | :--- |
| **Main Platform** | [**`ownpay.tech`**](https://ownpay.tech) | Company overview, institutional positioning, vision, investors, enterprise partners | Primary Brand |
| **Merchant Platform** | [**`ownpaylab.tech`**](https://ownpaylab.tech) | Merchant portal, checkout links, cashier POS terminal, double-entry ledger, settlement | Active Portal |
| **Developer Platform** | [**`www.ownpaylab.dev`**](https://www.ownpaylab.dev) | Public developer hub, API reference, TypeScript SDK, MCP server, x402 specs, public lab | Active Lab |
| **Future Consumer App** | [**`ownpay.me`**](https://ownpay.me) | Future P2P consumer payments, smart account gasless rails, consumer chat ecosystem | **Reserved (Waitlist)** |

> [!NOTE]
> **What This Repository Is:**  
> This repository (`Iktiarshovo/ownpaylab.dev`) is the **public window** into the OwnPay developer and research ecosystem. It provides open documentation, architectural specifications, SDK interfaces, MCP definitions, security threat models, and integration guides.  
> **What This Repository Is NOT:**  
> This is **not** the private production payment engine. It contains zero private keys, zero database credentials, zero production secrets, and zero internal administrative endpoints.

---

## 🧭 Core Strategic Philosophy

OwnPay is not built to eliminate banks, replace Visa/Mastercard, or destroy traditional financial systems. We believe the future of finance is forged through collaboration and unified connectivity:

> **“Preserve what works. Upgrade what is outdated. Connect what is disconnected. Secure what matters. Build for the long term.”**

* **01 PRESERVE:** Safeguard systems, users, merchants, and institutions that already work reliably.
* **02 UPGRADE:** Modernize outdated multi-day settlement cycles, manual reconciliations, and high dispute overhead.
* **03 CONNECT:** Connect isolated traditional banking networks, Web3 blockchains, stablecoin rails, and AI agents.
* **04 SECURE:** Embed non-custodial cryptographic finality, smart account isolation, and deterministic policy boundaries.
* **05 GROW TOGETHER:** Enable businesses, software engineers, financial institutions, and autonomous machines to compound value together.

> **“Build the bridge, not the wall.”**

---

## 🏛️ System Architecture

OwnPay unifies human retail commerce and autonomous machine commerce into a single, high-throughput settlement engine built natively on **Coinbase's Base L2 (Chain ID 8453)**.

```text
                             OWNPAY PROTOCOL
                                    │
                      ┌─────────────┴─────────────┐
                      ▼                           ▼
                 HUMAN RAIL                  AGENTIC RAIL
           (Retail Checkout / POS)       (API / SDK / x402 / MCP)
                      │                           │
                      └─────────────┬─────────────┘
                                    ▼
                          UNIVERSAL PAYMENT INTENT
                                    │
                          3-TIER POLICY ENGINE
                         (Caps • Whitelists • HITL)
                                    │
                          FINANCIAL IDEMPOTENCY
                                    │
                          NON-CUSTODIAL ROUTER
                                    │
                                    ▼
                         BASE MAINNET (CHAIN 8453)
                            Native Circle USDC
                                    │
                          REALTIME EVENT LISTENER
                                    │
                         DOUBLE-ENTRY SETTLEMENT
                                    │
                      ┌─────────────┴─────────────┐
                      ▼                           ▼
             HMAC-SHA256 Webhook          REST API Query
                      │                           │
                      └─────────────┬─────────────┘
                                    ▼
                       MERCHANT SELF-CUSTODIAL WALLET
                         (100% Retained Liquidity)
```

### Dual-Rail Convergence

1. **Human Retail Rail:**
   * Localized multi-currency checkout (USD, EUR, BDT, INR) settling into native Base USDC.
   * EIP-681 mobile wallet QR codes and hosted cashier terminals (`ownpaylab.tech/pos`).
   * Eliminates 3.5% interchange fees, foreign transaction surcharges, and multi-month rolling reserves.
2. **Autonomous Machine-to-Machine Rail:**
   * Scoped API credentials (`own_agent_...`) with non-custodial Smart Account execution.
   * **3-Tier Spend Policy Engine:** Micro-payments (<$50) auto-execute; rule-governed amounts evaluate recipient whitelists; high-value actions require 1-click Human-in-the-Loop approval.
   * **HTTP 402 (`x402`) Protocol:** Native pay-per-API-call micropayments replacing rigid SaaS subscriptions.
   * **Model Context Protocol (MCP):** Standardized payment tools for Cursor, Windsurf, Claude, and LangChain.

---

## 📂 Repository Navigation

Explore the dedicated modules across this repository:

* [**`docs/`**](docs/README.md) — Comprehensive technical documentation, getting started guides, and protocol overviews.
* [**`developers/`**](developers/README.md) — API references, TypeScript SDK guides, MCP configurations, and quickstarts.
* [**`architecture/`**](architecture/README.md) — In-depth architectural specifications covering the policy engine, idempotency, and settlement.
* [**`specifications/`**](specifications/README.md) — Formal RFC-style schema definitions for intents, webhooks, and state machines.
* [**`security/`**](security/README.md) — Threat models, defense-in-depth security model, responsible disclosure, and audit roadmap.
* [**`investors/`**](investors/README.md) — Institutional investment thesis, long-term vision, milestones, and master allocation.
* [**`ecosystem/`**](ecosystem/README.md) — Partnership frameworks, e-commerce integrations, community channels, and grants.
* [**`roadmap/`**](roadmap/README.md) — Verified milestone roadmap covering 2026, 2027, and long-term multi-cycle infrastructure.
* [**`examples/`**](examples/README.md) — Standalone code examples for merchants, autonomous agents, x402 monetization, and webhooks.

---

## 🔒 Security Philosophy & Trust Boundaries

> *“Security is a continuous engineering process, not a one-time checklist.”*

OwnPay approaches security through architectural defense-in-depth:
1. **Zero Private Key Retention:** Private keys are never held or processed on centralized servers; agents transact via delegated non-custodial session accounts.
2. **Deterministic Spend Boundaries:** Strict hard limits prevent LLM prompt injection attacks from draining wallets.
3. **Double-Entry Journal Verification:** Mathematical invariant `Total Debits === Total Credits` enforced on every ledger mutation.
4. **Responsible Vulnerability Disclosure:** Please report any potential vulnerabilities according to our [SECURITY.md](SECURITY.md) guidelines.

---

## 📈 Authorized Master Allocation

OwnPay is structured around durable long-term value creation rather than short-term extraction:

```text
Founder / Co-founder (Combined Leadership)        35%
Developer / Engineering / Ops Contributor Pool    25%
VC / Institutional Investors                      25%
Strategic Ecosystem + Community Grants            15%
─────────────────────────────────────────────────────
TOTAL AUTHORIZED ALLOCATION                      100%
```

* **Combined Founder Pool:** 35% represents the combined Founder + Co-founder allocation, finalized via formal legal documentation.
* **Vesting & Milestones:** Allocations are subject to multi-year vesting schedules, cliffs, lockups, and operational milestone gates.
* Read the complete [Allocation Philosophy](investors/allocation-philosophy.md).

---

## 🤝 Contributing

We welcome contributions from software engineers, Web3 researchers, AI builders, and technical writers:
* Read our [CONTRIBUTING.md](CONTRIBUTING.md) for pull request guidelines, issue reporting, and style requirements.
* Abide by our community standards outlined in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
* For support, discussions, and developer questions, visit [SUPPORT.md](SUPPORT.md).

---

## 📜 License

The documentation, public specifications, and open-source tooling in this repository are licensed under the [Apache License 2.0](LICENSE).

---

<p align="center">
  <strong>OwnPay is being built to last.</strong><br>
  Built natively on Base (Chain ID 8453) • Non-Custodial &amp; Developer-First
</p>
