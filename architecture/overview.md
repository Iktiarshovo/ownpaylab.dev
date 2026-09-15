# Core Subsystem Architecture Overview

> **Status:** Technical Blueprint  
> **System Classification:** High-Throughput Settlement Router  

---

## 1. Subsystem Interaction Model

The OwnPay engine is structured into seven modular, decoupled subsystems communicating across bounded event channels:

```text
                               +-----------------------------+
                               |     CLIENTS & CALLERS       |
                               | (Browsers, Mobile, Agents)  |
                               +--------------+--------------+
                                              | HTTPS / WSS
                                              v
+-------------------------------------------------------------------------------------------+
| 1. INGRESS & GATEWAY SUBSYSTEM                                                            |
|    - Rate limiting (Token Bucket)         - TLS 1.3 & mTLS Termination                    |
|    - Dual API Key & Client Secret Auth     - Signature verification for AI agents          |
+---------------------------------------------+---------------------------------------------+
                                              |
                                              v
+-------------------------------------------------------------------------------------------+
| 2. POLICY & GUARDRAIL SUBSYSTEM                                                           |
|    - Per-Tx Limit Check                   - Sliding 24h Spend Ceiling Calculation         |
|    - Merchant Whitelist Verification       - Session Key Expiration Enforcer               |
+---------------------------------------------+---------------------------------------------+
                                              |
                                              v
+-------------------------------------------------------------------------------------------+
| 3. DISTRIBUTED IDEMPOTENCY SUBSYSTEM                                                      |
|    - Distributed Mutex Lock (10s TTL)     - Cache Lookup (Key -> Cached Payload)          |
|    - Request Fingerprint Verification      - Atomic Result Writeback (24h TTL)             |
+---------------------------------------------+---------------------------------------------+
                                              |
                                              v
+-------------------------------------------------------------------------------------------+
| 4. PAYMENT INTENT LIFECYCLE SUBSYSTEM                                                     |
|    - State Machine Driver                 - Ephemeral Deposit Address Allocation          |
|    - Pricing & Exchange Rate Lock         - Expiration Timer (Default: 30m)               |
+----------------------+--------------------------------------+-----------------------------+
                       |                                      ^
                       v                                      |
+---------------------------------------------+  +------------------------------------------+
| 5. MULTI-CHAIN SETTLEMENT ROUTER            |  | 6. MULTI-CHAIN RPC EVENT LISTENER        |
| - Route Selection (Base / Poly / Sol / Eth) |  | - Polling & WebSocket Log Subscriptions  |
| - Gas Optimization & Permit2 Relaying       |  | - Block Depth Confirmation Thresholds    |
| - Bridge & Swapper Contract Invocation      |  | - Reorganization & Fork Detection Engine |
+----------------------+----------------------+  +--------------------+---------------------+
                       |                                      ^
                       +------------------+-------------------+
                                          |
                                          v
+-------------------------------------------------------------------------------------------+
| 7. CRYPTOGRAPHIC EVENT DISPATCHER                                                         |
|    - HMAC SHA-256 Signature Generator      - Jittered Exponential Backoff Retry Queue      |
|    - Circuit Breaker for Down Endpoints    - Audit Logging & Delivery Metrics              |
+-------------------------------------------------------------------------------------------+
```

---

## 2. Latency Budgets & Performance Targets

| Operation | Target Latency | P99 SLA | Mechanism |
| :--- | :--- | :--- | :--- |
| **PaymentIntent Creation** | `< 25ms` | `< 75ms` | In-memory policy check + distributed lock cache |
| **Idempotent Cache Hit** | `< 5ms` | `< 15ms` | High-speed in-memory KV retrieval |
| **x402 Header Verification** | `< 2ms` | `< 5ms` | Local stateless signature verification |
| **Mempool Detection (L2)** | `< 800ms` | `< 2,000ms` | Direct WebSocket block headers from validator RPCs |
| **Webhook Delivery (Attempt 1)** | `< 500ms` | `< 2,000ms` | Async worker pool triggered immediately upon finality |
