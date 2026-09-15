# OwnPay Security Model

> **Status:** Security Specification  
> **Classification:** Public Technical Assurance  

---

## 1. Non-Custodial Core Architecture

The central pillar of the OwnPay security model is **non-custodial fund routing**. 

At no point does the OwnPay API, database, or infrastructure custody customer deposits in commingled platform accounts. Funds flow atomically from the payer's cryptographic wallet directly to the merchant's destination vault or on-chain wallet.

```text
[Payer Wallet] ──(Direct On-Chain Transfer)──► [Merchant Settlement Wallet]
       |                                                 ^
       +-----------► [OwnPay Confirmation Engine] -------+
                    (Monitors & verifies event only)
```

---

## 2. Cryptographic Primitives & Standards

OwnPay employs modern, industry-standard cryptographic algorithms:

| Domain | Algorithm / Standard | Purpose |
| :--- | :--- | :--- |
| **Transport Layer** | TLS 1.3 with Perfect Forward Secrecy | Secures all REST API and WebSocket traffic |
| **Webhook Integrity** | HMAC-SHA-256 with timing-safe comparison | Prevents tampering and spoofing of settlement notifications |
| **EVM Signatures** | EIP-712 Typed Structured Data / secp256k1 | Eliminates blind signing in human and agent wallets |
| **Solana Signatures** | Ed25519 Edwards-curve Digital Signatures | High-performance deterministic message signing |
| **At-Rest Encryption** | AES-256-GCM with hardware-backed KMS keys | Protects internal database metadata and audit logs |

---

## 3. Ephemeral Client Secrets

To allow frontend checkout widgets to communicate securely without exposing the merchant's master secret key:
- The backend generates a short-lived `clientSecret` (`pi_sec_...`).
- The `clientSecret` is strictly scoped to a single `PaymentIntent` ID.
- It grants zero permissions to view merchant balances, modify settings, or initiate refunds.
