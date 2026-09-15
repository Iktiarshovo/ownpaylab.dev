# OwnPay Documentation Hub

Welcome to the central documentation for **OwnPay** and **OwnPay Lab**. This directory provides technical specifications, architectural designs, protocol standards, and integration guides for the OwnPay Dual-Rail Settlement Infrastructure.

---

## Documentation Structure

```text
docs/
├── README.md                    # This directory index
├── overview.md                  # High-level system & value proposition
├── vision.md                    # Master vision, long-term philosophy & allocation
├── getting-started.md           # Developer quickstart onboarding
├── architecture.md              # Complete dual-rail system architecture
├── payment-flow.md              # End-to-end payment intent lifecycle
├── human-rail.md                # Human checkout & web3 wallet UX
├── agent-rail.md                # AI agent autonomous payments & policy limits
├── payment-intent.md            # PaymentIntent specification & state machine
├── settlement.md                # Multi-chain settlement, finality & routing
├── webhooks.md                  # Webhook events, HMAC signatures & retries
├── x402.md                      # HTTP 402 Payment Required protocol spec
├── mcp.md                       # Model Context Protocol (MCP) tool integration
├── faq.md                       # Frequently asked questions
└── public-private-boundary.md   # Security boundary between public lab & private engine
```

---

## Canonical Domains

| Domain | Role & Purpose | Status |
| :--- | :--- | :--- |
| **`https://ownpay.tech`** | Main Brand & Protocol Identity | Live Platform |
| **`https://ownpaylab.tech`** | Merchant Portal & Merchant Onboarding | Active Engine |
| **`https://www.ownpaylab.dev`** | Developer Platform, Documentation & Public Lab | Open Lab |
| **`https://ownpay.me`** | Future Consumer Platform & Consumer Portal | *Reserved / Waitlist* |

---

## Suggested Reading Paths

- **If you are a Merchant Developer:**  
  Start with [Getting Started](./getting-started.md) &rarr; [Human Rail](./human-rail.md) &rarr; [Webhooks](./webhooks.md).
- **If you are an AI Engineer / Agent Builder:**  
  Start with [Agent Rail](./agent-rail.md) &rarr; [MCP Tooling](./mcp.md) &rarr; [x402 Protocol](./x402.md).
- **If you are an Infrastructure Architect or Security Auditor:**  
  Start with [Architecture Overview](./architecture.md) &rarr; [Settlement Engine](./settlement.md) &rarr; [Public-Private Boundary](./public-private-boundary.md).
- **If you are an Investor or Ecosystem Partner:**  
  Start with [Vision & Philosophy](./vision.md) and [Investors Documentation](../investors/README.md).
