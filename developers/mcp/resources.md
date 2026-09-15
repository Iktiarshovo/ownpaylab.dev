# MCP Resources & Context Prompts

The OwnPay MCP Server exposes read-only dynamic resources allowing LLMs to understand their economic constraints before generating tool calls.

---

## Resources

### `ownpay://policy/current`
Returns the active spending constraints for the agent session:

```json
{
  "maxPerTransactionUsd": 0.50,
  "dailySpendingLimitUsd": 10.00,
  "spentInLast24HoursUsd": 2.15,
  "remaining24HourBudgetUsd": 7.85,
  "whitelistedDomains": ["api.weather.com", "data.analytics-provider.org"]
}
```

---

## Prompts

### `ownpay_payment_guardrail_prompt`
System prompt injected to guide LLM reasoning before triggering payments:

> *"You are an autonomous agent equipped with OwnPay micropayment capabilities. You must verify that any service you pay for is within your assigned budget ($0.50 per call, $10.00 daily limit). Never bypass invoice verification or pay unverified endpoints."*
