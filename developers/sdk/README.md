# Official OwnPay SDKs & Libraries

OwnPay maintains first-party, strongly typed client SDKs across major modern programming languages:

---

## SDK Catalog

| Language | Package Name | Installation | Status |
| :--- | :--- | :--- | :--- |
| **TypeScript / Node.js** | `@ownpay/sdk` | `npm install @ownpay/sdk` | **[STABLE]** |
| **Python 3.10+** | `ownpay-python` | `pip install ownpay` | **[STABLE]** |
| **Model Context Protocol** | `@ownpay/mcp-server` | `npx @ownpay/mcp-server` | **[STABLE]** |
| **Go (Golang)** | `github.com/ownpay/ownpay-go` | `go get github.com/ownpay/ownpay-go` | **[DEVELOPMENT]** |

---

## Feature Matrix Across SDKs

- Automatic Idempotency Key injection.
- Cryptographic Webhook signature verification helper (`constructEvent`).
- Built-in exponential backoff retry interceptor for network faults.
- Native TypeScript type definitions and Python Pydantic models.
