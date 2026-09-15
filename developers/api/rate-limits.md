# API Rate Limits & Concurrency

To ensure stability, availability, and prevent abuse, OwnPay applies token-bucket rate limits per API key and per IP address.

---

## Default Limits

| Tier | Sustained Requests / Sec | Burst Limit | Description |
| :--- | :--- | :--- | :--- |
| **Sandbox / Testnet** | 25 req/sec | 50 req/burst | Generous limit for development & automated tests |
| **Standard Production** | 100 req/sec | 250 req/burst | Production e-commerce merchants |
| **Enterprise / Institutional** | 500+ req/sec | 1,000+ req/burst | Custom high-frequency agent or marketplace routing |

---

## Rate Limit Response Headers

Each API response includes standard IETF rate-limiting headers:

```http
RateLimit-Limit: 100
RateLimit-Remaining: 94
RateLimit-Reset: 1
```

If you exceed your rate limit, the API responds with `HTTP 429 Too Many Requests`:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please throttle your client and retry.",
  "retryAfter": 1
}
```
