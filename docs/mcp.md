# Model Context Protocol (MCP) Integration

> **Status:** Active Specification & Tooling  
> **Package:** `@ownpay/mcp-server`  
> **Protocol Standard:** Model Context Protocol (MCP) by Anthropic  

---

## 1. Overview

The **Model Context Protocol (MCP)** is an open protocol that standardizes how AI applications connect with external tools and data sources.

The **OwnPay MCP Server** provides autonomous AI agents (in Claude Desktop, Cursor, OpenAI Swarms, CrewAI, LangChain) with safe, policy-governed tools to inspect budgets, create invoices, verify payment status, and execute micropayments autonomously.

---

## 2. Architecture & Security Isolation

```text
+------------------------+
|      AI ASSISTANT      |
| (Claude / GPT-4 / LLM) |
+-----------+------------+
            |
            | JSON-RPC over stdio / SSE
            v
+------------------------+
|   OWNPAY MCP SERVER    | <--- Runs locally or in isolated container
|  (@ownpay/mcp-server)  |
+-----------+------------+
            |
            | Enforces Local Policy Rules (Max $0.50/tx, Max $10/day)
            v
+------------------------+
|      OWNPAY API        | <--- Settles on-chain (Base / Solana / Polygon)
+------------------------+
```

### Key Security Isolation Tenet:
**The LLM never possesses the private key.** The LLM only requests execution via the MCP tool interface. The local OwnPay MCP daemon validates the request against human-configured policy rules before any signature or fund movement can occur.

---

## 3. Exposed MCP Tools

### `ownpay_get_balance`
Returns the agent's current spend envelope, daily cap, and remaining balance.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "network": {
      "type": "string",
      "enum": ["base", "ethereum", "polygon", "arbitrum", "solana"],
      "description": "Optional chain network to inspect"
    }
  }
}
```

### `ownpay_create_payment_intent`
Creates a new payment intent for merchant services or peer agents.

**Input Schema:**
```json
{
  "type": "object",
  "required": ["amount", "currency", "recipientAddress"],
  "properties": {
    "amount": { "type": "string", "description": "Payment amount (e.g. '0.15')" },
    "currency": { "type": "string", "enum": ["USD", "EUR", "USDC"] },
    "recipientAddress": { "type": "string", "description": "Merchant destination address" },
    "chain": { "type": "string", "default": "base" }
  }
}
```

### `ownpay_pay_invoice`
Validates an invoice or x402 challenge, checks policy limits, signs the transaction, and returns proof of payment.

**Input Schema:**
```json
{
  "type": "object",
  "required": ["invoiceId", "maxAmountUsd"],
  "properties": {
    "invoiceId": { "type": "string", "description": "The invoice ID to settle" },
    "maxAmountUsd": { "type": "number", "description": "Upper bound amount the agent is willing to authorize" }
  }
}
```

### `ownpay_check_payment_status`
Checks the real-time on-chain confirmation status of any PaymentIntent.

---

## 4. Configuration Examples

### Claude Desktop (`claude_desktop_config.json`)

To enable OwnPay tools in Claude Desktop, add the following to your configuration:

```json
{
  "mcpServers": {
    "ownpay": {
      "command": "npx",
      "args": ["-y", "@ownpay/mcp-server"],
      "env": {
        "OWNPAY_API_KEY": "own_sec_test_mock_agent_key",
        "OWNPAY_ENVIRONMENT": "sandbox",
        "OWNPAY_MAX_PER_TX_USD": "1.00",
        "OWNPAY_DAILY_LIMIT_USD": "10.00"
      }
    }
  }
}
```

### Cursor IDE (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "ownpay": {
      "command": "npx",
      "args": ["-y", "@ownpay/mcp-server"],
      "env": {
        "OWNPAY_API_KEY": "own_sec_test_mock_key"
      }
    }
  }
}
```
