# OwnPay REST API Reference

The OwnPay API is organized around RESTful principles. Our API accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes and verbs.

---

## Base URLs

- **Sandbox:** `https://api-sandbox.ownpaylab.tech/v1`
- **Production:** `https://api.ownpaylab.tech/v1`

---

## Quick Reference

| Resource | Method | Path | Description |
| :--- | :--- | :--- | :--- |
| **PaymentIntents** | `POST` | `/v1/payment_intents` | Create a new payment intent |
| **PaymentIntents** | `GET` | `/v1/payment_intents/:id` | Retrieve intent status |
| **PaymentIntents** | `POST` | `/v1/payment_intents/:id/cancel` | Cancel an unpaid intent |
| **Refunds** | `POST` | `/v1/refunds` | Issue a refund to payer |
| **Balance** | `GET` | `/v1/balance` | Retrieve merchant settlement balances |
| **Webhooks** | `GET` | `/v1/webhook_endpoints` | List registered endpoints |
