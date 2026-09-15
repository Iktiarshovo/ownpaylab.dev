# 15-Minute Python Quickstart

Learn how to integrate OwnPay in Python using FastAPI.

---

## Step 1: Install Dependencies

```bash
pip install fastapi uvicorn ownpay python-dotenv
```

---

## Step 2: Create Application (`main.py`)

```python
import os
from fastapi import FastAPI, Request, HTTPException
from ownpay import OwnPayClient
from ownpay.webhooks import WebhookVerifier
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
client = OwnPayClient(api_key=os.getenv("OWNPAY_SECRET_KEY", "own_sec_test_mock"))
verifier = WebhookVerifier(secret=os.getenv("OWNPAY_WEBHOOK_SECRET", "whsec_test_mock"))

@app.post("/create-payment")
async def create_payment():
    intent = client.payment_intents.create(
        amount="25.00",
        currency="USD",
        settlement_token="USDC",
        settlement_chain="base",
        recipient_address="0xYourMerchantSettlementAddress...",
        idempotency_key=f"py_{os.urandom(8).hex()}"
    )
    return {"checkout_url": intent.checkout_url}

@app.post("/webhooks")
async def webhooks(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("x-ownpay-signature")

    try:
        event = verifier.verify(payload, sig_header)
        if event.type == "payment_intent.succeeded":
            print(f"Payment succeeded: {event.data['id']}")
        return {"received": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## Step 3: Run

```bash
python main.py
```
