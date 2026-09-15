# OwnPay Technical Architecture Subsystem

This directory contains in-depth engineering specifications for each subsystem within the OwnPay Dual-Rail Settlement Infrastructure.

---

## Directory Index

```text
architecture/
├── README.md                 # Subsystem overview & directory index
├── overview.md               # End-to-end component topology
├── payment-intent.md         # PaymentIntent state machine & lifecycle
├── policy-engine.md          # Agent policy guardrails, spend envelopes & session limits
├── idempotency.md            # Distributed idempotency, lock deduplication & consistency
├── wallet-layer.md           # Multi-chain wallet abstraction (EVM & SVM)
├── payment-router.md         # Dynamic path-finding, liquidity routing & fee optimization
├── event-listener.md         # Multi-chain RPC polling, reorg detection & finality tracking
└── settlement-engine.md      # Atomic execution, payout routes & non-custodial custody
```

---

## Architectural Principles

1. **Deterministic Execution:** State machines and policy validators are strictly deterministic.
2. **Crash-Fault Tolerance:** Subsystems are decoupled via durable queues, ensuring zero lost events during partial network partitions.
3. **Defense-in-Depth:** Every API request is verified at ingress, validated against policy limits, deduplicated by idempotency locks, and confirmed against on-chain block receipts.
