# API Authentication & Key Security

The OwnPay API uses API keys to authenticate requests. You can manage your API keys in the [OwnPay Merchant Portal](https://ownpaylab.tech).

---

## Key Types

1. **Secret Keys (`own_sec_test_...` / `own_sec_live_...`):**
   - Must be kept strictly confidential on your backend server.
   - Grants full access to create charges, initiate refunds, and manage webhooks.
   - **Never** expose secret keys in client-side code, mobile apps, or public repositories.

2. **Publishable Keys (`own_pub_test_...` / `own_pub_live_...`):**
   - Safe to embed in frontend checkout modals and mobile applications.
   - Only permits initiating checkout flows authorized by a `clientSecret`.

---

## Authentication Header

Authenticate your API requests by including your secret key in the `Authorization` header:

```http
Authorization: Bearer own_sec_test_mock_1234567890abcdef
```

Example request using curl:

```bash
curl https://api-sandbox.ownpaylab.tech/v1/payment_intents \
  -H "Authorization: Bearer own_sec_test_mock_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "19.99",
    "currency": "USD",
    "settlementToken": "USDC",
    "settlementChain": "base",
    "recipientAddress": "0xYourMerchantSettlementAddress..."
  }'
```
