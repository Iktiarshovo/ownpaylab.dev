# OwnPay Developer Platform

Welcome to the developer documentation for the **OwnPay Dual-Rail Settlement Infrastructure**.

---

## Developer Guides & Documentation Map

```text
developers/
├── README.md               # Developer platform overview
├── api/                    # REST API reference
│   ├── README.md           # API overview & base URLs
│   ├── authentication.md   # API key schemes & headers
│   ├── endpoints.md        # Detailed endpoint catalog
│   ├── errors.md           # Standard error codes & RFC 9457
│   └── rate-limits.md      # Rate limits & burst policies
├── sdk/                    # Official SDK documentation
│   ├── README.md           # SDK catalog & package links
│   ├── typescript.md       # TypeScript / Node.js SDK guide
│   └── python.md           # Python 3 SDK guide
├── mcp/                    # Model Context Protocol for AI agents
│   ├── README.md           # MCP overview
│   ├── tools.md            # MCP tool definitions
│   └── resources.md        # MCP resources & prompts
├── x402/                   # HTTP 402 Payment Required standard
│   ├── README.md           # x402 guide
│   ├── protocol.md         # Protocol handshake & vouchers
│   └── headers.md          # Header reference
├── webhooks/               # Webhooks & event streaming
│   ├── README.md           # Webhook guide
│   ├── signatures.md       # HMAC SHA-256 signature verification
│   └── retries.md          # Retry schedule & backoff
├── integrations/           # Framework integration guides
│   ├── README.md           # Integration catalog
│   ├── react.md            # React & Vite component integration
│   ├── node.md             # Express / Fastify Node.js server
│   └── nextjs.md           # Next.js App Router (Server Actions & Route Handlers)
└── quickstarts/            # Step-by-step 15-minute quickstarts
    ├── node-quickstart.md  # Node.js quickstart
    └── python-quickstart.md# Python quickstart
```

---

## Canonical Base URLs

| Environment | Base URL | Usage |
| :--- | :--- | :--- |
| **Sandbox / Testnet** | `https://api-sandbox.ownpaylab.tech` | Testing with Sepolia & Base Sepolia |
| **Production / Mainnet** | `https://api.ownpaylab.tech` | Live settlements |
