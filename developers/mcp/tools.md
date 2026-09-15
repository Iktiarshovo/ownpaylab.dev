# MCP Tool Definitions

> **Protocol Version:** MCP 2024-11-05  
> **Server:** `@ownpay/mcp-server`  

---

## 1. `ownpay_get_balance`

Inspects the agent's available budget, remaining 24-hour spend envelope, and verified on-chain stablecoin balances.

### Tool Definition
```json
{
  "name": "ownpay_get_balance",
  "description": "Inspects the remaining agent policy spending envelope, daily cap, and stablecoin balances across supported networks.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chain": {
        "type": "string",
        "enum": ["base", "ethereum", "polygon", "arbitrum", "solana"],
        "description": "Optional chain filter"
      }
    }
  }
}
```

---

## 2. `ownpay_pay_invoice`

Authorizes and settles an HTTP 402 invoice or payment request within the agent's policy limits.

### Tool Definition
```json
{
  "name": "ownpay_pay_invoice",
  "description": "Settles a merchant invoice or x402 payment challenge if the amount is within the configured agent policy guardrails.",
  "inputSchema": {
    "type": "object",
    "required": ["invoiceId", "maxAmountUsd"],
    "properties": {
      "invoiceId": {
        "type": "string",
        "description": "The unique invoice or payment intent ID"
      },
      "maxAmountUsd": {
        "type": "number",
        "description": "Maximum USD amount the agent authorizes to pay"
      }
    }
  }
}
```
