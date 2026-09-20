# OwnPay Quickstart Guide

This example demonstrates how to integrate the official `@ownpay/sdk` into a Node.js / TypeScript project.

## Installation

```bash
npm install @ownpay/sdk
# or
pnpm add @ownpay/sdk
```

## Running the Quickstart

```bash
export OWNPAY_API_KEY="own_sec_test_your_api_key_here"
npx ts-node index.ts
```

## Key Highlights

- **Multi-Chain Intent Generation:** Supports Base L2, Solana, BNB Smart Chain, and opBNB with zero friction.
- **Strict Webhook Verification:** Verifies HMAC-SHA256 signatures with built-in timestamp tolerance and anti-replay defense.
- **Zero Custody Risk:** Funds settle directly to merchant on-chain addresses.
