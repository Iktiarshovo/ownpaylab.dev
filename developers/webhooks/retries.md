# Webhook Retries & Dead-Letter Handling

---

## Delivery Guarantees

- **At-Least-Once Delivery:** Events are delivered at least once. Your endpoint must be idempotent.
- **Delivery Timeout:** OwnPay waits **10 seconds** for your endpoint to respond with an HTTP `2xx` status code.
- **Failures:** Any response code outside `200–299` (or a connection timeout) triggers an automatic retry.

---

## Retry Schedule (Exponential Backoff with Jitter)

```text
Attempt 1: Immediate
Attempt 2: 5 minutes later
Attempt 3: 15 minutes later
Attempt 4: 1 hour later
Attempt 5: 6 hours later
Attempt 6: 12 hours later
Attempt 7: 24 hours later
Attempt 8: 72 hours later (Final attempt)
```

---

## Best Practices for Idempotency

1. Extract `event.id` (e.g. `evt_987654...`).
2. Check your database if `evt_987654...` has already been processed.
3. If already processed, return `200 OK` immediately without re-executing fulfillment logic.
4. Process fulfilling operations asynchronously if they take longer than 2 seconds to prevent webhook timeouts.
