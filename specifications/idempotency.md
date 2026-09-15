# Specification: Idempotency Semantics

> **Document Version:** `1.0.0`  
> **Status:** [STABLE]  
> **Standard:** RFC 9457 & IETF Idempotency-Key Draft  

---

## 1. Protocol Headers

- **Client Header:** `Idempotency-Key: <opaque-string>` (Max 255 ASCII characters).
- **Server Response Header:** `Idempotent-Replay: true` (Returned when serving a cached response).

---

## 2. Invariants & Error Conditions

| Condition | HTTP Status | Response Payload |
| :--- | :--- | :--- |
| **First execution** | `200` / `201` | Processes normally, caches response for 24h. |
| **Identical replay within 24h** | `200` / `201` | Returns cached response, header `Idempotent-Replay: true`. |
| **Same key, different payload** | `409 Conflict` | `{"error": "idempotency_mismatch", "message": "Key used with different payload"}` |
| **Same key, currently in-flight** | `409 Conflict` | `{"error": "request_in_flight", "message": "Concurrent request processing"}` |
| **Key older than 24h** | `200` / `201` | Key has expired from cache; treated as fresh new request. |
