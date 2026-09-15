# Python SDK Guide

> **Package:** `ownpay-python`  
> **Requirement:** Python 3.10+  

---

## Installation

```bash
pip install ownpay
# or using poetry
poetry add ownpay
```

---

## Quickstart

```python
import os
from ownpay import OwnPayClient

client = OwnPayClient(
    api_key=os.environ.get("OWNPAY_SECRET_KEY", "own_sec_test_mock_1234567890abcdef"),
    environment="sandbox"
)

# Create a PaymentIntent
intent = client.payment_intents.create(
    amount="50.00",
    currency="USD",
    settlement_token="USDC",
    settlement_chain="base",
    recipient_address="0xYourMerchantSettlementAddress...",
    idempotency_key="order_py_9942"
)

print(f"Payment Intent created: {intent.id}")
print(f"Checkout URL: {intent.checkout_url}")
```

---

## Webhook Verification (FastAPI / Flask)

```python
from ownpay.webhooks import WebhookVerifier
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()
verifier = WebhookVerifier(secret=os.environ.get("OWNPAY_WEBHOOK_SECRET", "whsec_test_mock"))

@app.post("/webhooks/ownpay")
async def handle_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("x-ownpay-signature")

    try:
        event = verifier.verify(payload, sig_header)
        if event.type == "payment_intent.succeeded":
            print(f"Payment {event.data['id']} succeeded!")
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```
