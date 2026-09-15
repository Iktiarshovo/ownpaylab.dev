# Specification: Settlement States & Reorg Invariants

> **Document Version:** `1.0.0`  
> **Status:** [STABLE]  

---

## 1. Settlement Status Definitions

```text
requires_payment_method -> processing -> succeeded -> completed
                                  |
                              (Revert)
                                  v
                                failed
```

- **`requires_payment_method`**: Initial state, deposit route provisioned, awaiting payer broadcast.
- **`processing`**: Transaction detected in mempool or block. Confirmations accumulating.
- **`succeeded`**: Network target confirmation threshold satisfied. Settlement irreversible.
- **`failed`**: On-chain execution reverted or gas exhausted.
- **`canceled`**: Payment intent expired (exceeded TTL) without payment.
- **`completed`**: Merchant webhook successfully acknowledged with HTTP `2xx`.

---

## 2. Reorg Transition Matrix

If a block reorganization occurs while a payment is in `processing`:
- If the transaction is retained in the new canonical chain, confirmation counter resumes.
- If the transaction is orphaned, the intent transitions back to `requires_payment_method`.
- Once an intent transitions to `succeeded` (having reached finality depth), it can **never** be rolled back, ensuring merchant safety.
