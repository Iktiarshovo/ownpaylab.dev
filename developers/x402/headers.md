# x402 HTTP Headers Reference

---

## Response Headers (Emitted with HTTP 402)

| Header Name | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `X-OwnPay-Version` | String | `2026-09-01` | Protocol version |
| `X-OwnPay-Invoice-Id` | String | `inv_99f8e7d6` | Unique invoice identifier |
| `X-OwnPay-Amount` | String | `0.005` | Amount required |
| `X-OwnPay-Currency` | String | `USDC` | Currency asset |
| `X-OwnPay-Chain` | String | `base` | Blockchain network |
| `X-OwnPay-Pay-To` | String | `0x71C...3a9` | Destination address |
| `X-OwnPay-TTL` | Integer | `60` | Challenge validity in seconds |

---

## Request Headers (Sent by Client)

| Header Name | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `X-OwnPay-Payment-Proof` | String | `pproof_live_4a...` | Cryptographic proof of authorization |
| `X-OwnPay-Client-Id` | String | `agent_78942` | Calling agent identifier |
