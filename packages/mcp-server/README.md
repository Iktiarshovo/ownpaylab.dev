# @ownpay/mcp-server

Official Model Context Protocol (MCP) server for **OwnPay** — the unified human + autonomous AI agent payment layer built natively on Base L2.

Connects directly to the live production endpoint: `https://ownpaylab.dev`.

---

## 🚀 Quickstart

### 1. Configure in Cursor or Windsurf (`mcp.json`)

Add OwnPay to your `~/.cursor/mcp.json` or `.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "ownpay": {
      "command": "node",
      "args": ["packages/mcp-server/bin/ownpay-mcp.js"],
      "env": {
        "OWNPAY_BASE_URL": "https://ownpaylab.dev",
        "OWNPAY_API_KEY": "own_live_YOUR_API_KEY"
      }
    }
  }
}
```

### 2. Available AI Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `create_payment_intent` | Generate a new non-custodial Base USDC intent | `orderId`, `amount`, `currency` (USD, EUR, BDT) |
| `check_intent_status` | Inspect live onchain settlement status on Base | `intentId` |
| `request_agent_payment` | Authorize autonomous M2M transfer using session keys | `merchantAddress`, `amountUsdc`, `sessionKey` |
| `check_wallet_balance` | Query USDC & EIP-4337 gas sponsorship eligibility | `walletAddress` |
| `request_x402_quote` | Get HTTP 402 challenge parameters for micropayments | `resourcePath` |

---

## 🛠️ Testing Locally

```bash
# Run stdio server directly
OWNPAY_BASE_URL=https://ownpaylab.dev node packages/mcp-server/bin/ownpay-mcp.js
```
