# Multi-Chain Event Listener & Finality Tracker

> **Subsystem:** Blockchain Ingestion & Finality Engine  
> **Topology:** Redundant High-Availability RPC Clusters  

---

## 1. Overview

The **OwnPay Multi-Chain Event Listener** is responsible for detecting on-chain payment broadcasts, verifying block logs against expected `PaymentIntent` parameters, tracking confirmation depths, and alerting the core engine upon irreversible finality.

```text
+-----------------------+     +-----------------------+     +-----------------------+
|  Primary RPC Cluster  |     | Secondary RPC Cluster |     | Tertiary RPC Cluster  |
+-----------+-----------+     +-----------+-----------+     +-----------+-----------+
            |                             |                             |
            +----------------------+------+-----------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------------------+
|                        FAILOVER & QUORUM POLLING LAYER                            |
|  - Health checks: Block height skew <= 2 blocks                                   |
|  - Reorg monitor: Compares recent block hashes across providers                   |
+----------------------------------+------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------------------+
|                        CONFIRMATION DEPTH ACCUMULATOR                             |
|  - Increments confirmation count on each new canonical block                       |
|  - When Depth >= Target Threshold: Emits 'FINALITY_ACHIEVED' event               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Confirmation Thresholds

- **Base:** 2 blocks (`~4 sec`)
- **Arbitrum One:** 8 sequencer batches (`~2 sec`)
- **Polygon PoS:** 32 blocks (`~67 sec`)
- **Solana:** `finalized` commitment level (`~12.8 sec` / 32 confirmed slots)
- **Ethereum Mainnet:** 12 blocks (`~144 sec` / 2 epochs)

---

## 3. High-Availability RPC Redundancy

If an RPC node becomes unresponsive, drops WebSocket connections, or returns stale block heights:
1. The listener switches dynamically to backup node providers within 250 milliseconds.
2. If two providers disagree on canonical block hashes at the same height, an alert is triggered, and transactions at that height are paused until network consensus stabilizes.
