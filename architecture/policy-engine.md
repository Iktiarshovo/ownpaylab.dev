# Policy Engine & Agent Spend Guardrails

> **Subsystem:** Ingress & Security  
> **Target:** Autonomous AI Agents, LLM Tools, M2M Session Keys  

---

## 1. Architectural Motivation

Allowing an autonomous software agent to execute economic transactions introduces distinct failure modes:
1. **Model Hallucination:** An agent misunderstands price parameters (e.g. paying $100 instead of $0.10 for an API call).
2. **Infinite Execution Loops:** An agent caught in a recursive prompt loop drains entire wallet balances in minutes.
3. **Prompt Injection:** Malicious inputs trick the agent into routing funds to an attacker's address.

The **OwnPay Policy Engine** acts as an invariant validation boundary between the agent and the blockchain, ensuring that even a completely compromised agent cannot violate human-defined spending bounds.

---

## 2. Policy Enforcement Matrix

```text
                               +-----------------------------+
                               |     AGENT PAYMENT REQUEST   |
                               | (Recipient, Amount, Token)  |
                               +--------------+--------------+
                                              |
                                              v
+-------------------------------------------------------------------------------------------+
| 1. WHITELIST VALIDATION                                                                   |
|    - Is recipient address in pre-approved merchant registry?                              |
|    - FAIL: Immediate 403 Forbidden ("Target recipient not permitted by policy")          |
+---------------------------------------------+---------------------------------------------+
                                              | PASS
                                              v
+-------------------------------------------------------------------------------------------+
| 2. PER-TRANSACTION BOUNDARY CHECK                                                         |
|    - Is tx.amount <= policy.maxPerTransactionUsd?                                         |
|    - FAIL: Immediate 400 Bad Request ("Transaction exceeds per-call cap")                 |
+---------------------------------------------+---------------------------------------------+
                                              | PASS
                                              v
+-------------------------------------------------------------------------------------------+
| 3. SLIDING 24-HOUR BUDGET VERIFICATION                                                    |
|    - Query Redis rolling window spend for agentId                                         |
|    - Current 24h Spend + tx.amount <= policy.dailySpendingLimitUsd?                       |
|    - FAIL: Immediate 429 Too Many Requests ("Daily budget envelope exhausted")            |
+---------------------------------------------+---------------------------------------------+
                                              | PASS
                                              v
+-------------------------------------------------------------------------------------------+
| 4. CALL VELOCITY LIMITER                                                                  |
|    - Enforce max calls per minute/hour to prevent prompt loop exhaustion                  |
+---------------------------------------------+---------------------------------------------+
                                              | PASS
                                              v
                               +-----------------------------+
                               |    FORWARD TO SETTLEMENT    |
                               +-----------------------------+
```

---

## 3. Sliding Window Spend Calculation

The Policy Engine maintains rolling 24-hour spend ledgers using Redis sorted sets (`ZSET`):

1. **Member:** Transaction ID + Amount.
2. **Score:** Epoch timestamp in milliseconds (`currentTime`).
3. **Prune:** `ZREMRANGEBYSCORE agent_spend:<id> 0 (currentTime - 86,400,000)`.
4. **Sum:** Calculate sum of all remaining entries.
5. **Evaluate:** If `sum + new_tx > daily_cap`, reject transaction atomically.
