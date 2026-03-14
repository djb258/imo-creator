# Rosetta Stone — Domain 7: Data Flow/Integration

## Tier 0 Reference: law/doctrine/TIER0_DOCTRINE.md

---

## Gate 1 (50,000 ft) — What IS data flow?

**Candidate Constant:** Moving data from where it is to where it needs to be, transforming it along the way.

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Regardless of what data flows, the system extracts, transforms, and delivers. |
| CTB | PASS | From Silk Road trade goods to Kafka streams — the definition holds at every scale. |
| Circle | PASS | Data arrives stale → adjust pipeline → fresher data → monitor quality. The loop closes. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 2 (45,000 ft) — Universal Components

**11 Root Concepts extracted and validated:**

| # | Constant | Definition | IMO | CTB | Circle | Verdict |
|---|----------|-----------|-----|-----|--------|---------|
| 1 | Extract | Pulling data from a source system | PASS | PASS | PASS | LOCKED |
| 2 | Transform | Converting data from source format to target format | PASS | PASS | PASS | LOCKED |
| 3 | Load | Writing transformed data to a destination system | PASS | PASS | PASS | LOCKED |
| 4 | Pipeline | A sequence of connected processing stages | PASS | PASS | PASS | LOCKED |
| 5 | Queue | A buffer that holds messages between producer and consumer | PASS | PASS | PASS | LOCKED |
| 6 | Webhook | A push notification triggered by an event in the source system | PASS | PASS | PASS | LOCKED |
| 7 | Polling | Repeatedly checking a source for new data at intervals | PASS | PASS | PASS | LOCKED |
| 8 | Batch vs Real-time | Processing data in collected groups versus processing each item immediately | PASS | PASS | PASS | LOCKED |
| 9 | Idempotency | Processing the same input multiple times produces the same result | PASS | PASS | PASS | LOCKED |
| 10 | Pub/Sub | Publishers emit events; subscribers receive only events they declared interest in | PASS | PASS | PASS | LOCKED |
| 11 | Error Recovery | Detecting failed data movements and re-processing without data loss | PASS | PASS | PASS | LOCKED |

**Back-propagation check:** Clean.

---

## Gate 3 (40,000 ft) — Process Constant (IMO)

Every data flow follows IMO:
- **Input:** Data arrives from source (extracted or pushed)
- **Middle:** Pipeline transforms, validates, enriches, routes
- **Output:** Data delivered to destination (loaded or consumed)

**Verdict:** CONSTANT_LOCKED

---

## Gate 4 (35,000 ft) — Organization Constant (CTB)

Every data flow system organizes as CTB:
- **Trunk:** The pipeline (the integration system)
- **Branches:** Source connectors, transformation stages, destination connectors
- **Leaves:** Individual extraction jobs, transform rules, load operations

**Verdict:** CONSTANT_LOCKED

---

## Gate 5 — Rosetta Stone Matrix

| Root Concept | CF Queues/Workflows | n8n | Kafka | Silk Road (Historical) | Banking Wire (Historical) | Supply Chain (Historical) |
|-------------|--------------------|----|-------|----------------------|--------------------------|--------------------------|
| Extract | Fetch from source API / D1 query | Trigger node / HTTP Request | Consumer reads from topic | Merchant purchases goods at origin | Originating bank captures wire | Supplier ships raw materials |
| Transform | Worker function logic | Function / Set / Code nodes | Kafka Streams / ksqlDB | Repackaging goods for transport | Currency conversion / compliance check | Manufacturing / assembly |
| Load | Write to D1 / KV / R2 | Output node (HTTP, DB, file) | Producer writes to topic | Deliver goods to market stall | Receiving bank credits account | Retailer receives finished goods |
| Pipeline | CF Workflow (multi-step) | Workflow (node chain) | Topic → Stream → Topic chain | Trade route (origin → waypoints → destination) | Wire transfer chain (bank → correspondent → bank) | Supply chain (raw → factory → warehouse → store) |
| Queue | CF Queue (producer → consumer) | Wait / Delay nodes | Kafka topic (partitioned log) | Caravanserai (rest stop / staging) | Clearing house queue | Warehouse / distribution center |
| Webhook | Worker receives HTTP event | Webhook trigger node | N/A (Kafka is pull-based) | Messenger sent ahead to announce arrival | SWIFT notification message | Advance shipping notice (ASN) |
| Polling | Cron trigger / scheduled Worker | Schedule trigger / Interval node | Consumer poll loop | Regular caravan schedule | Settlement cycle (daily batch) | Reorder point check |
| Batch vs Real-time | Queue batch (configurable) vs single Worker | SplitInBatches vs Execute per item | Batch consumer vs stream processing | Seasonal caravan (batch) vs express courier (real-time) | End-of-day settlement (batch) vs instant transfer (real-time) | Bulk shipment (batch) vs JIT delivery (real-time) |
| Idempotency | Message deduplication by ID | Deduplicate node / idempotency key | Exactly-once semantics (EOS) | Seal ensures goods not substituted | Unique wire reference prevents double-credit | PO number prevents duplicate shipment |
| Pub/Sub | CF Queue with multiple consumers | N/A (direct flow) | Topic with consumer groups | Town crier (one announcement, many listeners) | Broadcast wire message | Catalog distribution (one publish, many order) |
| Error Recovery | Dead letter queue / retry policy | Error workflow / retry node | Dead letter topic / manual replay | Lost caravan → send replacement + claim | Failed wire → trace + resubmit | Lost shipment → insurance claim + reship |

---

## Gate 6 — Circle Validation (Feedback Patterns)

| Circle Pattern | Description | Universal? |
|---------------|-------------|------------|
| Quality Circle | Bad data arrives at destination → add validation at transform → cleaner data | YES — from data validation to trade goods inspection |
| Throughput Circle | Pipeline bottleneck → scale worker/partition → throughput restored | YES — from adding Kafka partitions to widening trade routes |
| Freshness Circle | Stale data → reduce polling interval or switch to webhook → fresher data | YES — from real-time streaming to express courier |
| Recovery Circle | Message lost → dead letter queue → investigate → replay → data recovered | YES — from DLQ replay to replacement caravan |

**Verdict:** All four CONSTANT_LOCKED.

---

## Gate 7 — True Variables Isolated

| Variable | Why It's a Variable |
|----------|-------------------|
| Message format | JSON vs Avro vs Protobuf vs physical goods |
| Transport mechanism | HTTP vs TCP socket vs physical transport |
| Scaling unit | Worker instance vs n8n execution vs Kafka partition |
| Retry policy | Exponential backoff vs fixed interval vs manual |
| Ordering guarantee | FIFO vs best-effort vs partition-ordered |

**Variable count:** 5 — within tolerance.

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates | 7 |
| Constants locked | 11 root concepts + 3 structural + 4 circles = 18 |
| Variables isolated | 5 |
| Back-propagation events | 0 |
| Domain-agnostic check | PASS — constants hold from Silk Road to Cloudflare Queues |