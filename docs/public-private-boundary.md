# Public vs. Private Repository Security Boundary

> **Classification:** Operational Security & Architecture Guide  
> **Repository:** `Iktiarshovo/ownpaylab.dev` (Public Lab)  
> **Strict Policy:** Zero-Secret Retention & Air-Gapped Production Isolation  

---

## 1. Architectural Purpose & Separation of Concerns

OwnPay maintains a clear, deliberate separation between its **Public Developer Ecosystem & Transparency Lab** (`ownpaylab.dev`) and its **Private Core Settlement Engine & Infrastructure**:

```text
+-------------------------------------------------------------------------------+
|                       PUBLIC ECOSYSTEM (ownpaylab.dev)                        |
|                                                                               |
|  - Open-source SDKs (TypeScript, Python, Go)                                  |
|  - Protocol Specifications (x402 HTTP standard, PaymentIntent, Webhooks)       |
|  - Model Context Protocol (MCP) Server Tool Definitions                       |
|  - Public Architecture Blueprints & Threat Models                             |
|  - Investor Vision, Allocation Framework & Public Roadmaps                    |
|  - Runnable Integration Examples & Quickstarts                                |
+-------------------------------------------------------------------------------+
                                      ||
                     AIR-GAPPED SECURITY BOUNDARY
                     (Strict Zero-Secret Enforcement)
                                      ||
+-------------------------------------------------------------------------------+
|                       PRIVATE PRODUCTION INFRASTRUCTURE                       |
|                                                                               |
|  - Core Settlement Vault Orchestration & HSM Private Keys                     |
|  - Production Database Clusters, Supabase Service Secrets & Internal RPCs     |
|  - Proprietary Fraud Scoring, Sybil Defense & Risk Engine Heuristics          |
|  - Production Merchant Billing Ledgers & Real-World Customer PII              |
|  - Live Webhook Signing Relayers & Internal Observability Pipelines           |
+-------------------------------------------------------------------------------+
```

---

## 2. The Strict Zero-Secret Policy

Under no circumstances should any contributor, automated workflow, or developer commit production secrets or internal proprietary assets into this public repository.

### Strictly Forbidden in this Repository:
- **Production API Keys:** Any key matching live prefixes (e.g., `own_sec_live_...`).
- **Database & Cloud Secrets:** Supabase service-role keys, database passwords, AWS/GCP access keys, JWT signing secrets.
- **Cryptographic Keys:** Private keys, seed phrases, mnemonic phrases, or relayer signing credentials.
- **Production Customer Data:** Real transaction IDs, customer names, merchant payout bank details, or internal logs.
- **Proprietary Risk Rules:** Internal fraud models, AML velocity thresholds, and anti-abuse scoring logic.

---

## 3. Permitted & Recommended Public Artifacts

The following assets are encouraged and maintained in this public repository:
- **Test Credentials:** Safe mock tokens matching `own_sec_test_mock_...` and `whsec_test_mock_...`.
- **Public Specifications:** Standardized JSON schemas, RFC drafts, and protocol definitions.
- **Integration Libraries:** Clean, modular open-source client SDKs.
- **Sample Code:** Minimal, readable example servers and frontend checkout demos.
- **Architectural Diagrams:** System diagrams illustrating component interactions and security boundaries.

---

## 4. Verification & Secret Scanning

All public commits and pull requests must undergo automated secret detection:
1. Pre-commit local hooks scanning for regex patterns of common API keys and private keys.
2. Automated GitHub Actions link and syntax validation.
3. Continual secret scanning alerts monitored by the OwnPay Security Team.

If a credential is ever accidentally exposed in any public branch, it must be considered **instantly compromised**, immediately rotated across all production systems, and purged from Git history.
