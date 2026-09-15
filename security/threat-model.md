# Threat Model & Attack Surface Analysis

> **Methodology:** STRIDE & Zero-Trust Threat Analysis  
> **Scope:** Public API, Checkout Widgets, Webhooks, Agent Policies  

---

## 1. Threat Analysis Matrix

| Threat Category | Potential Vector | Mitigation Strategy in OwnPay |
| :--- | :--- | :--- |
| **Spoofing (Identity)** | Attacker sends fake webhook requests to merchant server to trigger order fulfillment. | Every webhook is cryptographically signed using HMAC-SHA256 with the merchant's private secret. Timestamps are enforced within 300s to block replays. |
| **Tampering (Data)** | Attacker intercepts checkout parameters and reduces payment amount. | Amount, currency, and recipient are locked in the backend `PaymentIntent`. The client secret only authorizes paying the exact immutable amount. |
| **Repudiation** | Payer claims transaction was never sent or was sent to a different address. | All settlements are permanently anchored on public blockchains with immutable transaction hashes and event logs. |
| **Information Disclosure** | Leakage of merchant revenue or customer wallet balances. | Strict tenant isolation in databases. Public APIs return only public intent state without exposing total merchant volume or private balances. |
| **Denial of Service** | Flooding API with automated requests to exhaust server resources. | Token-bucket rate limiting, Cloudflare DDoS shielding, and distributed Redis idempotency locks. |
| **Elevation of Privilege** | Autonomous AI agent compromised via prompt injection attempts to drain funds. | Hard invariant limits enforced by Policy Engine: per-tx caps, 24h rolling budget, recipient whitelists, and short session TTLs. |

---

## 2. Blockchain Reorganization Attack Surface

- **Risk:** An attacker attempts a double-spend by reorganizing an L1 or L2 chain after goods or API outputs have been provisioned.
- **Mitigation:** Confirmation depth buffering:
  - Base / Arbitrum: 2 blocks minimum.
  - Solana: `finalized` commitment.
  - High-value transactions (> $10,000) dynamically require extended confirmation thresholds.
