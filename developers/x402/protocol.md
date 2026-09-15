# x402 Protocol Handshake

> **Protocol:** `RFC-x402-2026`  
> **Classification:** Machine-to-Machine HTTP Monetization  

---

## 1. Handshake Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client / AI Agent
    participant Server as Monetized API Server
    participant Relayer as OwnPay Relayer

    Client->>Server: GET /v1/market-data
    Server-->>Client: HTTP 402 Payment Required<br/>X-OwnPay-Invoice-Id: inv_987<br/>X-OwnPay-Amount: 0.005<br/>X-OwnPay-Pay-To: 0xMerchant...

    Client->>Relayer: Authorize payment voucher (inv_987)
    Relayer-->>Client: Emits payment token (pproof_4a3b2c)

    Client->>Server: GET /v1/market-data<br/>X-OwnPay-Payment-Proof: pproof_4a3b2c
    Server->>Server: Statistically verify signature (< 2ms)
    Server-->>Client: HTTP 200 OK + JSON Payload
```

---

## 2. Server Implementation Example

```typescript
import { ownpayX402Middleware } from '@ownpay/sdk/x402';
import express from 'express';

const app = express();

app.get(
  '/api/search',
  ownpayX402Middleware({
    amount: '0.01',
    currency: 'USDC',
    chain: 'base',
    recipientAddress: '0xYourMerchantSettlementAddress...',
  }),
  (req, res) => {
    res.json({ results: ['Result 1', 'Result 2'] });
  }
);
```
