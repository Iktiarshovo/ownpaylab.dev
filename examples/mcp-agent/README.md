# OwnPay Model Context Protocol (MCP) Agent Integration

This example demonstrates how to configure autonomous AI agents (such as Claude Desktop, Cursor, and LangChain) to invoke payments via OwnPay's Model Context Protocol server.

## Overview

The OwnPay MCP server exposes deterministic tools for:
- `create_payment_intent`: Generates multi-chain payment requests.
- `check_intent_status`: Verifies on-chain settlement status.
- `verify_wallet`: Validates EVM and Solana wallet formatting.
- `request_x402_quote`: Formats HTTP 402 paywall challenges for machine services.
- `get_agent_policy`: Audits spending policies and gas envelopes.

## Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ownpay": {
      "command": "npx",
      "args": ["-y", "@ownpay/mcp-server"],
      "env": {
        "OWNPAY_API_KEY": "your_api_key_here",
        "OWNPAY_API_URL": "https://ownpaylab.tech"
      }
    }
  }
}
```
