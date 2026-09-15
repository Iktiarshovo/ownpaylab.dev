# OwnPay Code Examples & Reference Implementations

This directory contains standalone, production-quality code examples demonstrating various integration patterns across the OwnPay ecosystem.

---

## Examples Catalog

```text
examples/
├── README.md                           # This index
├── merchant/
│   └── checkout-demo.html              # Interactive client-side checkout demo
├── ai-agent/
│   └── agent-autonomous-payer.ts       # Autonomous AI agent with spending policy guardrails
├── x402/
│   └── express-x402-sample.ts          # Express API server monetized with HTTP 402
└── webhook/
    └── express-webhook-listener.ts     # Express server with HMAC SHA-256 signature verification
```

---

## Security Notice

All examples use obvious mock keys (`own_sec_test_mock_...`, `whsec_test_mock_...`) and dummy addresses. Replace them with your actual sandbox credentials from [https://ownpaylab.tech](https://ownpaylab.tech).
