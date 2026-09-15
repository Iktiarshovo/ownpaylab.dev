# Trust Boundaries & Data Isolation

---

## 1. Trust Domains

OwnPay segregates execution into distinct trust boundaries:

```text
+-------------------------------------------------------------------------------+
| TRUST DOMAIN 1: UNTRUSTED CLIENT RUNTIMES                                     |
| - End-user web browsers & mobile wallet apps                                  |
| - Public internet & DNS resolution                                           |
| - Autonomous AI agent LLM execution loops                                     |
+---------------------------------------+---------------------------------------+
                                        | TLS 1.3 + Signed Headers
                                        v
+-------------------------------------------------------------------------------+
| TRUST DOMAIN 2: OWNPAY INGRESS & VALIDATION                                   |
| - Reverse proxy & rate limiting                                               |
| - Policy Engine & Spend Envelopes                                             |
| - Distributed Idempotency Locks                                               |
+---------------------------------------+---------------------------------------+
                                        | VPC Peering / mTLS
                                        v
+-------------------------------------------------------------------------------+
| TRUST DOMAIN 3: SETTLEMENT & PRIVATE VAULT CORE                               |
| - HSM relayer signing keys                                                    |
| - Production database clusters & Redis clusters                               |
| - Cryptographic event dispatcher                                              |
+-------------------------------------------------------------------------------+
```

---

## 2. Ingress & Egress Invariants

- **No Secrets Flow Outward:** Internal database passwords, cloud tokens, and signing keys are physically inaccessible from public ingress nodes.
- **Strict Parameter Validation:** All incoming JSON payloads are validated against strict JSON schemas before being passed to business logic.
- **Zero Raw Key Ingestion:** The API gateway rejects any request payload attempting to transmit seed phrases, private keys, or wallet credentials.
