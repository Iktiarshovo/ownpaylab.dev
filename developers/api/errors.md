# Standard API Error Codes

OwnPay adheres to the **RFC 9457 Problem Details for HTTP APIs** specification. Errors return standard HTTP status codes accompanied by a structured JSON error body.

---

## Error Schema

```json
{
  "type": "https://www.ownpaylab.dev/errors/invalid_request",
  "title": "Invalid Request Parameters",
  "status": 400,
  "detail": "The 'amount' parameter must be a positive fixed-point decimal string.",
  "code": "parameter_invalid_amount",
  "requestId": "req_8f7e6d5c4b3a"
}
```

---

## HTTP Status Codes Reference

| HTTP Status | Error Category | Description |
| :--- | :--- | :--- |
| `200` / `201` | Success | The request succeeded. |
| `400` | Bad Request | Missing required parameters or malformed JSON body. |
| `401` | Unauthorized | Missing or invalid `Authorization: Bearer <secret_key>`. |
| `402` | Payment Required | Resource requires payment proof (used in `x402` protocol). |
| `403` | Forbidden | Insufficient key permissions or violation of agent policy rules. |
| `404` | Not Found | Target resource ID does not exist. |
| `409` | Conflict | Idempotency key conflict (request currently in flight or payload mismatch). |
| `429` | Rate Limited | Exceeded per-second request quota or daily agent spend budget. |
| `500` / `502` | Server Error | Internal server or upstream blockchain node error. |
