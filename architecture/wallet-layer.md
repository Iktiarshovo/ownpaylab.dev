# Multi-Chain Wallet Layer & Abstraction

> **Subsystem:** Client & Relayer Infrastructure  
> **Supported Environments:** EVM (Ethereum, Base, Polygon, Arbitrum) & SVM (Solana)  

---

## 1. Architectural Strategy

OwnPay abstracts the deep fragmentation across blockchain wallet architectures, providing merchants and consumers with a unified connection interface:

```text
+-------------------------------------------------------------------------------+
|                       OWNPAY UNIFIED WALLET ABSTRACTION                       |
+---------------------------------------+---------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+---------------------------------+           +---------------------------------+
|      EVM COMPATIBILITY LAYER    |           |      SVM (SOLANA) LAYER         |
| - EIP-6963 (Provider Discovery) |           | - Solana Wallet Standard        |
| - EIP-1193 Injected Wallets     |           | - Phantom / Solflare Native API |
| - WalletConnect v2 Protocol     |           | - Solana Pay Specification      |
| - ERC-4337 Smart Accounts       |           | - SPL Token 2022 Transfer Hooks |
+---------------------------------+           +---------------------------------+
```

---

## 2. EIP-6963 Multi-Injected Provider Discovery

Legacy web3 checkouts rely on `window.ethereum`, causing race conditions and UI conflicts when a user has multiple wallet extensions installed (e.g. MetaMask, Coinbase Wallet, Rabby).

OwnPay uses **EIP-6963**, listening for `eip6963:announceProvider` events to enumerate all installed wallets deterministically with their authentic brand icons and UUIDs.

---

## 3. Gasless Payments & Token Sponsorship (EIP-3009 / Permit2)

To eliminate the friction of needing native gas tokens (ETH or MATIC):
1. **USDC EIP-3009 `transferWithAuthorization`:** The customer signs an off-chain authorization message containing `validAfter`, `validBefore`, and `nonce`.
2. **Permit2 Protocol:** Used on Arbitrum and Polygon for token approvals in a single signature.
3. **OwnPay Relayer:** Submits the signed payload to the blockchain, paying the gas fee, which is settled out of the stablecoin transfer balance or merchant gas sponsorship pool.
