# PaymentIntent State Machine Architecture

> **Subsystem:** Core Engine  
> **Component:** State Machine & Intent Allocator  

---

## 1. Formal State Machine Specification

The `PaymentIntent` lifecycle is modeled as a strictly ordered, finite state machine:

```text
               +-----------------------------+
               |  requires_payment_method    |
               +--------------+--------------+
                              |
               Payment submitted / detected
                              |
                              v
               +-----------------------------+
               |         processing          | <----------+
               +--------------+--------------+            |
                              |                           | Shallow reorg
              +---------------+---------------+           | (Rollback)
              |                               |           |
     Finality confirmed           Revert / Insufficient   |
              |                               |           |
              v                               v           |
+-----------------------------+ +-----------------------------+
|          succeeded          | |           failed            |
+-----------------------------+ +-----------------------------+
              |                               ^
     Merchant fulfillment                     | TTL expired
              |                               | before payment
              v                               |
+-----------------------------+ +-----------------------------+
|          completed          | |          canceled           |
+-----------------------------+ +-----------------------------+
```

---

## 2. Transition Guard Conditions

| Current State | Event / Trigger | Target State | Guard Conditions |
| :--- | :--- | :--- | :--- |
| `requires_payment_method` | `TX_BROADCAST_DETECTED` | `processing` | Mempool transaction hash or block log matches target deposit route and token. |
| `requires_payment_method` | `TTL_EXPIRED` | `canceled` | `currentTime > expiresAt` AND no valid on-chain transfer detected. |
| `processing` | `FINALITY_CONFIRMED` | `succeeded` | Confirmations >= threshold (e.g. 2 blocks for Base, 32 slots for Solana) AND `amountPaid >= amountDue`. |
| `processing` | `TX_REVERTED` | `failed` | On-chain status is `0` (revert) or out-of-gas. |
| `processing` | `BLOCKCHAIN_REORG` | `requires_payment_method` | Block containing transaction was orphaned and has not reappeared in canonical fork. |
| `succeeded` | `WEBHOOK_ACK_RECEIVED` | `completed` | Merchant server returns HTTP `2xx` to webhook delivery. |

---

## 3. Price Freezing & Exchange Rate Guarantees

When a `PaymentIntent` is created with a fiat currency (`USD`, `EUR`) and settled in a token (`USDC`, `EURC`):
1. The conversion rate is locked for the duration of the intent's TTL (default: 1,800 seconds / 30 minutes).
2. If the user initiates payment after the TTL, the transaction is rejected or flagged as expired, preventing slippage losses for the merchant.
