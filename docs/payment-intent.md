# PaymentIntent Specification & State Machine

> **Status:** Specification  
> **API Version:** `2026-09-01`  
> **Object Type:** `payment_intent`  

---

## 1. Overview

The `PaymentIntent` is the fundamental entity representing a payment lifecycle in OwnPay. It captures the customer's payment intent, target amount, destination blockchain, settlement token, and progression through authorization, blockchain confirmation, and merchant fulfillment.

---

## 2. PaymentIntent Object Schema

```json
{
  "id": "pi_live_9a8b7c6d5e4f3a2b",
  "object": "payment_intent",
  "amount": "29.99",
  "currency": "USD",
  "settlementToken": "USDC",
  "settlementChain": "base",
  "recipientAddress": "0x71C...3a9",
  "depositAddress": "0x98A...5b2",
  "status": "succeeded",
  "clientSecret": "pi_sec_9a8b7c6d5e4f3a2b_secret_123456",
  "idempotencyKey": "order_checkout_78942",
  "metadata": {
    "orderId": "ORD-78942",
    "customerEmail": "user@example.com"
  },
  "settlementDetails": {
    "network": "base",
    "txHash": "0x4e7c...819d",
    "blockNumber": 18492041,
    "confirmedAt": 1789449200
  },
  "createdAt": 1789449180,
  "expiresAt": 1789450980
}
```

### Field Definitions

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique identifier with prefix `pi_` (e.g., `pi_test_...` or `pi_live_...`). |
| `object` | String | String value representing the object type (`"payment_intent"`). |
| `amount` | String | Fixed-point string representation of the amount to be paid. |
| `currency` | String | Three-letter ISO fiat code or reference asset (`"USD"`, `"EUR"`). |
| `settlementToken` | String | Settlement currency (`"USDC"`, `"USDT"`, `"EURC"`). |
| `settlementChain` | String | Target network (`"base"`, `"ethereum"`, `"polygon"`, `"arbitrum"`, `"solana"`). |
| `recipientAddress` | String | Merchant's final payout address where settled funds arrive. |
| `depositAddress` | String | Ephemeral non-custodial deposit route or smart-contract route for the payment. |
| `status` | String | Current state (see State Reference below). |
| `clientSecret` | String | Ephemeral secret used by client SDKs to render checkout widgets safely. |
| `idempotencyKey` | String | Caller-supplied deduplication key. |
| `metadata` | Object | Key-value store (up to 50 keys) for merchant tracking data. |
| `settlementDetails`| Object | On-chain execution data once verified (hash, block, confirmations). |
| `createdAt` | Integer | Unix timestamp (seconds) when the intent was created. |
| `expiresAt` | Integer | Unix timestamp (seconds) when unpaid intent expires (default: 30 min). |

---

## 3. State Reference

```text
  [requires_payment_method]  ──(Payment initiated)──►  [processing]
             │                                              │
      (TTL Expired)                            (Confirmed on-chain)
             │                                              │
             ▼                                              ▼
        [canceled]                                     [succeeded]
```

| State | Description | Next Permitted States |
| :--- | :--- | :--- |
| `requires_payment_method` | Initial state. Awaiting wallet connection or transaction submission. | `processing`, `canceled` |
| `processing` | Transaction detected in mempool/block; awaiting target confirmation depth. | `succeeded`, `requires_payment_method` (on reorg) |
| `succeeded` | Blockchain finality achieved; funds settled to merchant destination. | *Terminal state* |
| `canceled` | Intent timed out or was explicitly canceled by merchant before broadcast. | *Terminal state* |
| `failed` | Payment failed due to gas exhaustion, transaction revert, or network error. | `requires_payment_method`, `canceled` |

---

## 4. Idempotency Behavior

All `POST /v1/payment_intents` requests require an `Idempotency-Key` header or `idempotencyKey` body parameter.

- If a request is received with an identical key within a **24-hour window**, the server returns the previously created object without re-executing business logic.
- Concurrent requests with the same key are serialized using atomic Redis/distributed locks to prevent race conditions.
