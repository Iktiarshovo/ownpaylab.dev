# OwnPay Python SDK

Official Python client for **OwnPay** — Developer & AI Agent Payment Rails on Base L2.

## Installation

```bash
pip install ownpay
```

## Quickstart

```python
from ownpay import OwnPayClient

# Initialize client (uses Base Sepolia testnet if using own_test_ key)
client = OwnPayClient(
    api_key="own_test_your_api_key_here",
    base_url="https://api.ownpay.dev"
)

# 1. Create a localized payment intent
intent = client.intents.create(
    order_id="order_1001",
    amount=25.0,
    currency="USD",
    title="Premium API Subscription"
)
print(f"Payment Address: {intent['payment_address']}")
print(f"USDC Amount: {intent['usdc_amount']} USDC")

# 2. Check intent status
status = client.intents.get_status(intent["intent_id"])
print(f"Status: {status['status']}")

# 3. Autonomous AI Agent Payment
payment = client.agents.pay(
    agent_id="agent_alpha",
    amount=5.0,
    recipient="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    purpose="Dataset micro-procurement"
)
print(f"Payment Status: {payment.get('status')}")
```

## Webhook Verification

```python
from ownpay import OwnPayWebhook

# In your Flask / FastAPI / Django handler:
is_valid = OwnPayWebhook.verify_signature(
    raw_body=request.get_data(),
    signature=request.headers.get("X-OwnPay-Signature"),
    timestamp=request.headers.get("X-OwnPay-Timestamp"),
    secret="whsec_your_secret_here"
)
```
