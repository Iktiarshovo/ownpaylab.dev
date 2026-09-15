# Multi-Chain Settlement & Finality Engine

> **Status:** Architecture Reference  
> **Supported Networks:** Base, Ethereum, Polygon PoS, Arbitrum One, Solana  

---

## 1. Settlement Overview

OwnPay operates as a **non-custodial settlement router**. When a transaction occurs, funds flow directly between the payer and the merchant's target vault or address without OwnPay commingling or seizing funds.

Merchants can configure two primary settlement modes:
1. **Direct Non-Custodial Payout:** Funds are transferred directly to the merchant's on-chain address in the payer's asset.
2. **Automated Liquidity Route:** Cross-chain bridge and stablecoin swaps route disparate tokens (e.g., USDT on Polygon) to the merchant's preferred asset and network (e.g., USDC on Base).

---

## 2. Multi-Chain Finality Thresholds

To prevent double-spending and chain reorganization exploits, the OwnPay Settlement Engine enforces network-specific confirmation thresholds before emitting terminal success states:

| Blockchain | Settlement Asset | Avg Block Time | Required Confirmations | Time to Finality |
| :--- | :--- | :--- | :--- | :--- |
| **Base (L2)** | USDC, EURC | ~2.0 sec | 2 blocks | ~4.0 seconds |
| **Arbitrum One (L2)** | USDC, USDT | ~0.25 sec | 8 blocks | ~2.0 seconds |
| **Polygon PoS** | USDC, USDT | ~2.1 sec | 32 blocks (Milestone) | ~67.0 seconds |
| **Solana (SVM)** | USDC, EURC | ~0.4 sec | `finalized` (32 slots) | ~12.8 seconds |
| **Ethereum Mainnet** | USDC, USDT | ~12.0 sec | 12 blocks (Safe block) | ~144.0 seconds |

---

## 3. Reorg & Fork Protection

A blockchain reorganization occurs when a node receives a valid chain that is longer or has more accumulated weight than the currently accepted chain.

OwnPay safeguards against reorgs via three layers:
1. **Depth Buffering:** High-value transactions (e.g., > $10,000 USD) automatically require higher confirmation depths before marking `succeeded`.
2. **State Sync Verification:** On-chain listeners verify that transaction receipts are included in finalized checkpoints, not just ephemeral mempool blocks.
3. **Rollback Resilience:** If an unfinalized block is orphaned during a shallow fork, the Settlement Engine immediately transitions the PaymentIntent back to `processing` and continues tracking until canonical inclusion.

---

## 4. Fee Mechanics & Gas Abstraction

- **Zero Hidden Spread:** OwnPay executes settlement routing at pure on-chain liquidity pool rates without inflated spreads.
- **Gas Abstraction (EIP-2612 / Permit2):** Consumers can sign off-chain approval messages, allowing the merchant or OwnPay relayers to sponsor or deduct gas in stablecoins, removing the need for end-users to hold native gas tokens like ETH or MATIC.
