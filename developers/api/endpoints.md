# API Endpoints Catalog

> **Version:** `2026-09-01`  
> **Protocol:** HTTPS REST  

---

## 1. Create a PaymentIntent

Creates a new PaymentIntent object representing a customer checkout session or agent micropayment.

- **Method:** `POST`
- **Path:** `/v1/payment_intents`
- **Headers:**
  - `Authorization: Bearer <secret_key>`
  - `Idempotency-Key: <unique_key>`
  - `Content-Type: application/json`

### Request Parameters

| Parameter | Type | Required? | Description |
| :--- | :--- | :---: | :--- |
| `amount` | string | **Yes** | Amount to charge as fixed-point decimal string (e.g., `"25.00"`). |
| `currency` | string | **Yes** | Currency code (`"USD"`, `"EUR"`). |
| `settlementToken` | string | **Yes** | Token to settle in (`"USDC"`, `"USDT"`, `"EURC"`). |
| `settlementChain` | string | **Yes** | Blockchain network (`"base"`, `"ethereum"`, `"polygon"`, `"arbitrum"`, `"solana"`). |
| `recipientAddress` | string | **Yes** | Merchant settlement wallet address. |
| `metadata` | object | No | Key-value store (up to 50 key-value pairs). |

### Response Example (`201 Created`)

```json
{
  "id": "pi_test_9876543210abcdef",
  "object": "payment_intent",
  "amount": "25.00",
  "currency": "USD",
  "settlementToken": "USDC",
  "settlementChain": "base",
  "recipientAddress": "0xYourMerchantSettlementAddress...",
  "depositAddress": "0xDepositRoute789...",
  "status": "requires_payment_method",
  "clientSecret": "pi_sec_9876543210abcdef_secret_994",
  "checkoutUrl": "https://www.ownpaylab.dev/checkout/pi_test_9876543210abcdef",
  "createdAt": 1789449200,
  "expiresAt": 1789451000
}
```

---

## 2. Retrieve a PaymentIntent

Retrieves current status, confirmed transaction hash, and execution metadata for an intent.

- **Method:** `GET`
- **Path:** `/v1/payment_intents/:id`
- **Headers:**
  - `Authorization: Bearer <secret_key>`

### Response Example (`200 OK`)

```json
{
  "id": "pi_test_9876543210abcdef",
  "object": "payment_intent",
  "status": "succeeded",
  "amount": "25.00",
  "settlementDetails": {
    "network": "base",
    "txHash": "0x4e7c09f8...1234",
    "blockNumber": 18492041,
    "confirmedAt": 1789449240
  }
}
```

---

## 3. Cancel a PaymentIntent

Cancels an unpaid PaymentIntent. If the intent has already received a payment or is confirmed, cancellation is rejected.

- **Method:** `POST`
- **Path:** `/v1/payment_intents/:id/cancel`
- **Headers:**
  - `Authorization: Bearer <secret_key>`
