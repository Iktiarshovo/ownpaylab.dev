# Specification: PaymentIntent

> **Document Version:** `1.0.0`  
> **Status:** [STABLE]  
> **JSON Schema Standard:** Draft 2020-12  

---

## 1. Formal JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://www.ownpaylab.dev/schemas/v1/payment-intent.json",
  "title": "PaymentIntent",
  "type": "object",
  "required": [
    "id",
    "object",
    "amount",
    "currency",
    "settlementToken",
    "settlementChain",
    "recipientAddress",
    "status",
    "clientSecret",
    "createdAt",
    "expiresAt"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^pi_(test|live)_[a-zA-Z0-9]{16,32}$"
    },
    "object": {
      "type": "string",
      "const": "payment_intent"
    },
    "amount": {
      "type": "string",
      "pattern": "^[0-9]+(\\.[0-9]{1,6})?$"
    },
    "currency": {
      "type": "string",
      "enum": ["USD", "EUR", "USDC", "USDT", "EURC"]
    },
    "settlementToken": {
      "type": "string",
      "enum": ["USDC", "USDT", "EURC"]
    },
    "settlementChain": {
      "type": "string",
      "enum": ["base", "ethereum", "polygon", "arbitrum", "solana"]
    },
    "recipientAddress": {
      "type": "string",
      "description": "Destination address (EVM 0x... or Solana base58)"
    },
    "depositAddress": {
      "type": "string",
      "description": "Assigned non-custodial deposit route"
    },
    "status": {
      "type": "string",
      "enum": [
        "requires_payment_method",
        "processing",
        "succeeded",
        "canceled",
        "failed"
      ]
    },
    "clientSecret": {
      "type": "string",
      "pattern": "^pi_sec_[a-zA-Z0-9_]{24,64}$"
    },
    "idempotencyKey": {
      "type": "string",
      "maxLength": 255
    },
    "metadata": {
      "type": "object",
      "maxProperties": 50,
      "additionalProperties": { "type": "string", "maxLength": 500 }
    },
    "createdAt": { "type": "integer" },
    "expiresAt": { "type": "integer" }
  }
}
```
