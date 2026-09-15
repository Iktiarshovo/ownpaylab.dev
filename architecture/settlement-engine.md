# Settlement Engine & Non-Custodial Payouts

> **Subsystem:** Settlement & Ledger Orchestration  
> **Custody Model:** Non-Custodial Direct-to-Merchant Routing  

---

## 1. Overview

The **OwnPay Settlement Engine** executes the final transfer of funds to merchants upon on-chain transaction confirmation.

Unlike legacy custodial aggregators that hold merchant revenues in omnibus bank accounts for days or weeks, OwnPay enforces **non-custodial merchant sovereignty**:
- Payer funds flow directly to merchant-controlled addresses.
- Alternatively, funds settle into segregated, merchant-controlled smart vaults with automated sweep rules.

---

## 2. Settlement Modalities

### Mode 1: Direct Real-Time Payout (Default)
Each transaction routes directly to the merchant's target wallet:
- Zero counterparty risk.
- Immediate availability of funds on-chain.
- Optimal for merchants with high-volume, continuous operational expenses.

### Mode 2: Segregated Smart Vault with Scheduled Sweeps
For merchants seeking to minimize the number of incoming wallet UTXOs or ERC-20 transfers:
- Transactions deposit into an audited, non-custodial smart vault deployed specifically for the merchant.
- The merchant configures automated rules (e.g., "Sweep balance to cold storage every 24 hours or when balance exceeds $10,000 USDC").
- Only the merchant holds the withdrawal authority keys.

---

## 3. Financial Reconciliation & Ledger Integrity

Every settlement emits an immutable ledger record:
- `intentId`: Unique payment intent identifier.
- `payerAddress`: Source wallet address.
- `merchantAddress`: Destination payout address.
- `grossAmount`: Total paid by customer.
- `netAmount`: Net received by merchant after transparent protocol fee.
- `txHash` & `blockNumber`: On-chain proof of settlement.
