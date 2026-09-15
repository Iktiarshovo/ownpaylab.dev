# Security Audit & Verification Roadmap

OwnPay takes an uncompromising approach to software correctness, smart contract verification, and external security audits.

---

## 1. Audit Schedule & Status

| Target Scope | Audit Type | Target Date / Status | Partner / Auditor |
| :--- | :--- | :--- | :--- |
| **Payment Router & Escrow Contracts** | Smart Contract Formal Verification | Q4 2026 | Leading Web3 Audit Firm |
| **MCP Server & Agent Policy Engine** | Sandboxed Execution & Penetration Test | Q1 2027 | Tier-1 AppSec Firm |
| **API Gateway & Webhook Ingress** | Threat Assessment & Replay Auditing | Continuous CI / Active | Internal AppSec & External Pen-Testers |
| **Multi-Chain Event Listener** | Reorg Resilience & Fork Stress Tests | Q2 2027 | Specialized Infrastructure Auditor |

---

## 2. Continuous Verification

- **Automated Static Analysis:** All commits run Slither, Semgrep, and Markdown linting.
- **Dependency Vulnerability Scanning:** Automated daily Dependabot dependency checks.
- **Fuzzing & Invariant Testing:** Formal property-based fuzzing on payment state transitions and balance checks.
