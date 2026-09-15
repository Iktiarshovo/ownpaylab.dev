# Distributed Idempotency Architecture

> **Subsystem:** Ingress & State Protection  
> **Key Retention Window:** 24 Hours  
> **Standard:** RFC 9457 / Stripe Idempotency Standard  

---

## 1. Overview & Problem

In distributed payments, network timeouts and retries frequently cause duplicate requests. Without strict idempotency, an automated client or user refreshing during network latency could create multiple duplicate charges for a single shopping cart or API invoice.

OwnPay guarantees **exactly-once execution semantics** for all mutating API requests (`POST /v1/payment_intents`, `POST /v1/refunds`) using a distributed idempotency layer.

---

## 2. Idempotency Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Merchant or AI Agent
    participant Gateway as API Gateway
    participant Lock as Redis Distributed Lock
    participant DB as Idempotency Store
    participant Engine as Payment Engine

    Client->>Gateway: POST /v1/payment_intents<br/>Header: Idempotency-Key: ord_9942
    Gateway->>DB: Check if 'ord_9942' exists
    
    alt Key already exists & cached
        DB-->>Gateway: Return cached response & status code
        Gateway-->>Client: 200/201 (Cached Response, Idempotent-Replay: true)
    else Key exists but request in-flight
        Lock-->>Gateway: Lock contention (409 Conflict / Retry after 1s)
        Gateway-->>Client: 409 Conflict ("Request currently in-flight")
    else Key does not exist
        Gateway->>Lock: Acquire distributed lock for 'ord_9942' (TTL: 10s)
        Gateway->>Engine: Process payment creation
        Engine-->>Gateway: PaymentIntent created successfully
        Gateway->>DB: Save result payload with 24h TTL
        Gateway->>Lock: Release lock
        Gateway-->>Client: 201 Created
    end
```

---

## 3. Payload Fingerprinting & Conflict Detection

An idempotency key is cryptographically tied to the exact payload of the initial request:

```text
Fingerprint = SHA256(HTTP_METHOD + ":" + PATH + ":" + RAW_REQUEST_BODY)
```

- **Exact Match:** If a subsequent request arrives with the same `Idempotency-Key` and matching fingerprint within 24 hours, the cached response is returned immediately.
- **Payload Mismatch:** If a subsequent request arrives with the same `Idempotency-Key` but a **different** request body (e.g., amount changed from $10 to $20), the gateway rejects the request immediately with:
  ```json
  {
    "error": "idempotency_error",
    "message": "Idempotency-Key 'ord_9942' was already used for a different request payload."
  }
  ```
