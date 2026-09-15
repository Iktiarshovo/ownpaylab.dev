# OwnPay Protocol Specifications

This directory contains formal normative specifications and JSON schemas for OwnPay's core interfaces, protocols, and data models.

---

## Specifications Directory

```text
specifications/
├── README.md                 # Specifications overview & standards
├── payment-intent.md         # JSON schema & validation rules for PaymentIntent
├── webhook-events.md         # Event schemas, HMAC signature standards & delivery rules
├── idempotency.md            # HTTP idempotency headers, deduplication & key lifecycles
└── settlement-states.md      # State machine definitions, transition invariants & reorg handling
```

---

## Versioning & Stability

- **Specification Version:** `2026-09-01`
- **Stability Tier:**
  - `PaymentIntent`: **[STABLE]**
  - `WebhookEvents`: **[STABLE]**
  - `Idempotency`: **[STABLE]**
  - `SettlementStates`: **[STABLE]**
  - `x402 Protocol`: **[DEVELOPMENT]**
