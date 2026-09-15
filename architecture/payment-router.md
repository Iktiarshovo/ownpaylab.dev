# Multi-Chain Payment Router & Path-Finding

> **Subsystem:** Settlement & Routing  
> **Cross-Chain Protocol:** Circle CCTP (Cross-Chain Transfer Protocol) & Native DEX Routing  

---

## 1. Overview

The **OwnPay Payment Router** is responsible for finding the most cost-effective and lowest-latency path between the payer's asset/chain and the merchant's target settlement vault.

```text
  [PAYER ASSET]                                                [MERCHANT ASSET]
  USDT on Polygon ──► Swap to USDC ──► Circle CCTP Bridge ──► USDC on Base
       ^                                                            |
       |                   LOWEST SLIPPAGE & GAS                    |
       +------------------------------------------------------------+
```

---

## 2. Route Optimization Matrix

The router computes execution routes based on a real-time weight function:

```text
Score = W1 * (Estimated Gas Fee) + W2 * (Expected Finality Seconds) + W3 * (Slippage %)
```

### Route Types:
1. **Direct Same-Chain (Zero Slippage):** Payer and merchant use the same token and chain (e.g., Base USDC &rarr; Base USDC). Execution is direct peer-to-peer non-custodial transfer.
2. **Same-Chain Cross-Token:** Payer pays in USDT on Arbitrum; merchant settles in USDC on Arbitrum. The router executes via localized low-slippage AMM pools.
3. **Cross-Chain Stablecoin Route:** Payer pays USDC on Ethereum; merchant requires USDC on Base. The router utilizes native **Circle CCTP**, burning on Ethereum and minting on Base with zero synthetic bridge risk.
