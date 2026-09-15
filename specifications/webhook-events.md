# Specification: Webhook Events

> **Document Version:** `1.0.0`  
> **Status:** [STABLE]  

---

## 1. Webhook Envelope Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://www.ownpaylab.dev/schemas/v1/webhook-event.json",
  "title": "WebhookEvent",
  "type": "object",
  "required": ["id", "object", "type", "created", "livemode", "data"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^evt_[a-zA-Z0-9]{16,32}$"
    },
    "object": {
      "type": "string",
      "const": "event"
    },
    "type": {
      "type": "string",
      "enum": [
        "payment_intent.created",
        "payment_intent.processing",
        "payment_intent.succeeded",
        "payment_intent.failed",
        "payment_intent.canceled"
      ]
    },
    "created": {
      "type": "integer",
      "description": "Timestamp event occurred"
    },
    "livemode": {
      "type": "boolean"
    },
    "data": {
      "type": "object",
      "description": "Contains the serialized entity (e.g. PaymentIntent)"
    }
  }
}
```

---

## 2. Cryptographic Signature Standard

- **Header Name:** `X-OwnPay-Signature`
- **Format:** `t=<timestamp>,v1=<signature_hex>`
- **Payload Input:** `<timestamp>.<raw_body_utf8>`
- **Hash Function:** `HMAC-SHA-256(secret_bytes, payload_bytes)`
- **Comparison:** Must use timing-safe comparison to prevent side-channel timing attacks.
