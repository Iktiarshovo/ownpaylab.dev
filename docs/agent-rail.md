# Rail 2: Autonomous AI Agent Commerce Architecture

> **Status:** Active Development & Specification  
> **Target:** LLMs, Autonomous Agents, Model Context Protocol (MCP), M2M APIs  

---

## 1. The Machine Commerce Problem

The next decade will see billions of autonomous software agents purchasing APIs, training datasets, cloud compute, specialized research, and physical goods on behalf of humans and organizations.

However, existing payment rails fail completely for autonomous software:
- **Legacy Credit Cards:** Require SMS 2FA, biometric facial scans, CAPTCHAs, and high minimum fees ($0.30 fixed fee per swipe makes $0.001 micropayments impossible).
- **Unbounded Crypto Wallets:** Giving an AI agent full access to an unconstrained private key exposes the user to catastrophic loss from hallucinations, prompt injection attacks, or compromised model weights.

---

## 2. The OwnPay Agent Rail Solution

**The OwnPay Agent Rail** provides a hardened, programmatic payment substrate that combines **sub-cent micropayments** with **cryptographic policy guardrails**.

```text
               +--------------------------------------------------+
               |                 HUMAN OPERATOR                   |
               |  - Provisions Agent Session Key                  |
               |  - Configures Policy: Max $5/day, Max $0.10/tx   |
               |  - Whitelists Approved API / Merchant Domains    |
               +------------------------+-------------------------+
                                        |
                                        v
               +--------------------------------------------------+
               |             AUTONOMOUS AI AGENT                  |
               |  - Runs LLM reasoning loop                       |
               |  - Encounters Paywalled Resource / HTTP 402      |
               |  - Queries OwnPay Policy Engine via MCP Tool     |
               +------------------------+-------------------------+
                                        |
                         +--------------+--------------+
                         |                             |
                         v                             v
            [ PROTOCOL A: MCP TOOL ]       [ PROTOCOL B: HTTP 402 ]
            `ownpay_pay_invoice`           Header `X-OwnPay-Payment-Token`
                         |                             |
                         +--------------+--------------+
                                        |
                                        v
               +--------------------------------------------------+
               |               OWNPAY POLICY ENGINE               |
               |  - Validates session key & signature             |
               |  - Checks: Tx Amount <= $0.10? (PASS)            |
               |  - Checks: 24h Spend <= $5.00? (PASS)            |
               |  - Checks: Target Address Whitelisted? (PASS)    |
               +------------------------+-------------------------+
                                        |
                                        v
               +--------------------------------------------------+
               |        ATOMIC MULTI-CHAIN SETTLEMENT             |
               |  Instant sub-second stablecoin transfer          |
               |  Resource unlocked; Agent receives data payload  |
               +--------------------------------------------------+
```

---

## 3. Cryptographic Policy Guardrails

Every agent-controlled payment intent must satisfy four deterministic constraints enforced by the OwnPay Policy Engine:

```typescript
interface AgentPolicyRules {
  /** Hard cap on any single transaction (e.g., $0.50) */
  maxPerTransactionUsd: number;

  /** Sliding 24-hour cumulative expenditure ceiling (e.g., $15.00) */
  dailySpendingLimitUsd: number;

  /** Pre-approved merchant/contract addresses. Wildcards require elevated human multi-sig */
  allowedRecipientWhitelist: string[];

  /** Session expiration timestamp after which the session key is invalidated */
  sessionExpiresAt: number;

  /** Maximum transactions permitted per hour (rate limiting against prompt loops) */
  maxTransactionsPerHour: number;
}
```

### Safety Guarantee:
Even if an agent suffers a catastrophic prompt injection or infinite loop bug, **it cannot spend more than the bounded envelope configured by the human operator.**

---

## 4. Integration Protocols

### 4.1. Model Context Protocol (MCP)
OwnPay provides an official MCP Server (`@ownpay/mcp-server`) that exposes structured tools to LLMs (Claude, OpenAI Agents, LangChain, CrewAI):

- `ownpay_get_balance`: Inspects current spend envelope and remaining budget.
- `ownpay_verify_invoice`: Validates invoice amount against policy constraints before committing.
- `ownpay_pay_invoice`: Executes payment atomically and returns proof of payment.

### 4.2. HTTP 402 Payment Required Protocol
For headless microservices and agent-to-agent REST APIs:
1. Agent sends `GET /api/v1/research-brief`.
2. API responds with `HTTP 402 Payment Required` with payment headers (`X-OwnPay-Invoice-Id`, `X-OwnPay-Amount`).
3. Agent invokes OwnPay SDK, authorizes payment within policy, and retries request with `X-OwnPay-Payment-Proof`.
4. API verifies proof in `< 5ms` and streams the response.

---

## 5. Settlement Performance

| Metric | Traditional Card Rail | Standard L1 Crypto | OwnPay Agent Rail (L2/SVM) |
| :--- | :--- | :--- | :--- |
| **Minimum Feasible Tx** | $1.00 (Due to $0.30 fixed fee) | $5.00 (Due to gas) | **$0.0001 (Micropayment)** |
| **Execution Latency** | 2,000 – 5,000 ms | 12,000 – 60,000 ms | **350 – 800 ms** |
| **Human Interruption** | Required (2FA / 3DS) | Manual Signing Prompt | **Zero (Autonomous within policy)** |
| **Blast Radius Risk** | Full Card Limit | Entire Wallet Balance | **Strictly Bounded by Session Policy** |
