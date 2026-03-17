# PROCESS-LCS: Lifecycle Communication Spine

| Field | Value |
|-------|-------|
| Process ID | PROC-LCS |
| Version | 1.0.0 |
| Status | IN_PROGRESS |
| Repos | company-lifecycle-cl, barton-outreach-core, client |
| Last Verified | 2026-03-10 |

## Summary

Three-phase pipeline that converts sub-hub signals into multi-channel outreach delivery. CID Compiler gates and compiles signals into communication IDs, SID Worker constructs message content, MID Engine delivers via adapters (Mailgun, HeyReach, Sales Handoff) and tracks delivery state. 11 frames, 3 pre-delivery gates, ORBT 3-strike error protocol, bidirectional ID addressing from signal through delivery.

## IMO — Ingress / Middle / Egress

### Ingress

| Field | Value |
|-------|-------|
| Trigger | Sub-hubs emit signals to `lcs.signal_queue` (status=PENDING). Sources: DOL enrichment, People slots, Blog detection, Talent Flow, Field Monitor movement. |
| Entry Table | `lcs.signal_queue` |
| Entry Schema | sovereign_company_id, signal_set_hash, lifecycle_phase, priority, status, created_at |

### Middle

| Phase | Step | Function | File | Reads | Writes | Gate |
|-------|------|----------|------|-------|--------|------|
| CID | Fetch pending signals | `runCidCompiler()` | pipeline/cid-compiler.ts | lcs.signal_queue | — | — |
| CID | Validate signal fields | inline | pipeline/cid-compiler.ts | — | — | — |
| CID | Capacity check | `checkCapacity()` | @/sys/lcs/gates | lcs.adapter_registry | — | CAPACITY GATE |
| CID | Collect intelligence | inline query | pipeline/cid-compiler.ts | v_company_intelligence | — | — |
| CID | Freshness check | `checkFreshness()` | @/sys/lcs/gates | — | — | FRESHNESS GATE |
| CID | Match frame | inline query | pipeline/cid-compiler.ts | lcs.frame_registry | — | — |
| CID | Resolve entity | inline | pipeline/cid-compiler.ts | v_company_intelligence | — | — |
| CID | Mint communication_id | `mintCommunicationId()` | lcs/id-minter.ts | — | lcs.cid | — |
| SID | Trigger on CID insert | `startSidWorkerListener()` | pipeline/sid-worker.ts | lcs.cid | — | — |
| SID | Fetch frame + intelligence | inline queries | pipeline/sid-worker.ts | lcs.frame_registry, v_company_intelligence | — | — |
| SID | Resolve recipient + sender | inline | pipeline/sid-worker.ts | v_company_intelligence | — | — |
| SID | Construct message | inline | pipeline/sid-worker.ts | — | lcs.sid_output | — |
| MID | Fetch CID + determine channel | `runMidEngine()` | pipeline/mid-engine.ts | lcs.cid, lcs.frame_registry | — | — |
| MID | Capacity check | `checkCapacity()` | @/sys/lcs/gates | lcs.adapter_registry | — | CAPACITY GATE |
| MID | Suppression check | `checkSuppression()` | @/sys/lcs/gates | — | — | SUPPRESSION GATE |
| MID | Mint message_run_id | `mintMessageRunId()` | lcs/id-minter.ts | — | — | — |
| MID | Resolve adapter + send | `resolveAdapter()` → `adapter.send()` | adapters/adapter-resolver.ts | — | lcs.mid_sequence_state | — |
| MID | Log CET + ORBT errors | `logCetEvent()`, `logErr0()` | lcs/cet-logger.ts, lcs/err0-logger.ts | — | lcs.event, lcs.err0 | — |

### Egress

| Output | Table/View | Consumers |
|--------|-----------|-----------|
| Canonical Event Trail | lcs.event (append-only CET) | All repos — audit, analytics, lifecycle promotion |
| Delivery State | lcs.mid_sequence_state | ORBT retry logic, delivery dashboards |
| Lifecycle Status | v_company_lifecycle_status (view) | barton-outreach-core, sales, client |
| Promotable Companies | v_company_promotable (view) | sales (handoff candidates) |

## ID Addressing Chain

### Forward (Signal → Delivery)

| Phase | ID Created | Format | Join Key To Next |
|-------|-----------|--------|-----------------|
| Ingress | signal_queue.id | Auto-increment | signal_queue_id → lcs.cid |
| CID | communication_id | `LCS-{PHASE}-{YYYYMMDD}-{ULID}` | communication_id → lcs.sid_output |
| SID | sid_id | Auto-increment | communication_id → lcs.mid_sequence_state |
| MID | message_run_id | `RUN-{COMM_ID}-{CHANNEL}-{ATTEMPT_3}` | message_run_id → lcs.event |

Phase codes: ACP, ACT, NUR, ENR, CAD, OPP, WIN, LOS, CHR, CAN, REV, OTH.
Channel codes: MG (Mailgun), HR (HeyReach), SH (Sales Handoff).
Attempt: zero-padded to 3 digits (001, 002, etc.).

Example forward trace:
```
signal_queue.id = 47
  → lcs.cid WHERE signal_queue_id = 47
    → communication_id = LCS-NUR-20260310-01ARZ3NDEKTSV4RRFFQ69G5FAV
      → lcs.sid_output WHERE communication_id = LCS-NUR-20260310-01ARZ3...
        → lcs.mid_sequence_state WHERE communication_id = LCS-NUR-20260310-01ARZ3...
          → message_run_id = RUN-LCS-NUR-20260310-01ARZ3...-MG-001
            → lcs.event WHERE message_run_id = RUN-LCS-NUR-20260310-01ARZ3...-MG-001
```

### Reverse (Delivery → Signal)

1. Find `lcs.event` or `lcs.mid_sequence_state` by `message_run_id`
2. Extract `communication_id` from the record
3. Query `lcs.cid` WHERE `communication_id` = value
4. Extract `signal_queue_id` from CID record
5. Query `lcs.signal_queue` WHERE `id` = signal_queue_id
6. Original trigger signal recovered — full audit trail

### Cross-Hub ID Resolution

```
FORWARD:
  Sovereign_ID (cl.company_identity)
    → Outreach_ID (outreach.outreach) via cl.company_identity_bridge
      → SubHub_IDs (company_target, dol, people, blog) via outreach_id FK

Sub-hubs detect movement → emit to lcs.signal_queue
LCS Compiler reads signal_queue → gates → creates CID

INSIDE LCS:
  CID (communication_id) → SID (sid_id) → MID (message_run_id) → delivery

REVERSE:
  message_run_id → communication_id → signal_queue_id → sovereign_company_id
    → cl.company_identity_bridge → outreach_id → sub-hub records
```

## Phase Breakdown

### Phase 1: CID Compiler

**Entry**: `lcs.signal_queue` rows with status=PENDING
**Code**: `src/app/lcs/pipeline/cid-compiler.ts` → `runCidCompiler(batchSize=50)`

**Steps**:
1. Fetch PENDING signals from signal_queue, ordered by priority then created_at
2. Validate required fields: sovereign_company_id, signal_set_hash, lifecycle_phase
3. **CAPACITY GATE**: `checkCapacity()` — checks adapter_daily_cap, agent_daily_cap, adapter_health. Returns PASS or BLOCK.
4. Collect intelligence from `v_company_intelligence` — determines intelligence_tier (1-5, default 5)
5. **FRESHNESS GATE**: `checkFreshness()` — validates data recency for people/dol/blog. Returns PASS, DOWNGRADE (reduces tier), or BLOCK.
6. Match frame from `lcs.frame_registry` WHERE lifecycle_phase matches AND is_active=true AND tier <= intelligence_tier. Ordered by tier ASC (highest-data frame first).
7. Resolve entity_id from intelligence snapshot (CEO→CFO→HR priority). STRICT compilation_rule requires entity_id; LITE allows fallback UUID.
8. Mint communication_id via `mintCommunicationId(phase)` — ULID-based, immutable after creation.

**Writes**: `lcs.cid` (compilation_status: COMPILED|FAILED|BLOCKED), updates `signal_queue` status (COMPLETED|SKIPPED|FAILED)

**Exit**: CID row exists with COMPILED status, ready for SID Worker.

### Phase 2: SID Worker

**Entry**: pg_notify on COMPILED CID insert (real-time) OR cron batch via `runSidWorker(batchSize=50)`
**Code**: `src/app/lcs/pipeline/sid-worker.ts` → `runSidWorker()` or `startSidWorkerListener()`

**Steps**:
1. Fetch COMPILED CIDs that have no matching sid_output record (idempotency check)
2. Fetch frame template from `lcs.frame_registry` (sid_template_id)
3. Collect intelligence again for recipient resolution
4. Resolve recipient: CEO email → CFO email → HR email priority. Fail if no email available.
5. Resolve sender: generate sender_identity from lifecycle phase
6. Construct message: subject_line, body_plain, body_html (currently static template, future: full template engine)

**Writes**: `lcs.sid_output` (construction_status: CONSTRUCTED|FAILED|BLOCKED)

**Exit**: SID row exists with CONSTRUCTED status, message content ready for delivery.

### Phase 3: MID Engine

**Entry**: `lcs.sid_output` rows with CONSTRUCTED status
**Code**: `src/app/lcs/pipeline/mid-engine.ts` → `runMidEngine(batchSize=50, defaultChannel='MG')`

**Steps**:
1. Fetch CID context (agent_number, frame_id, entity_id, lifecycle_phase, sovereign_company_id)
2. Determine channel from frame_registry. Check mid_sequence_type: IMMEDIATE (send now) or DELAYED (schedule mid_delay_hours ahead, return QUEUED).
3. **CAPACITY GATE**: `checkCapacity()` — same gate as CID phase, re-checked at delivery time.
4. **SUPPRESSION GATE**: `checkSuppression()` — blocks if entity has never_contact, unsubscribed, hard_bounced, or complained flags.
5. Mint message_run_id via `mintMessageRunId(communicationId, channel, attemptNumber)`.
6. Resolve adapter via `resolveAdapter(channel)` → currently all channels route through `LovableDeliveryAdapter` (NEEDS MIGRATION).
7. Build AdapterPayload with all context fields. Call `adapter.send(payload)`.
8. Map response to delivery status (DELIVERED|SENT|FAILED|BOUNCED).
9. Write `lcs.mid_sequence_state`. Log CET event via `logCetEvent()`.
10. On failure: ORBT error handling via `logErr0()` + `getNextStrikeNumber()`.

**ORBT 3-Strike Protocol**:
- Strike 1 → AUTO_RETRY (same channel, immediate)
- Strike 2 → ALT_CHANNEL (MG↔HR if eligible; SH has no alternate)
- Strike 3+ → HUMAN_ESCALATION (manual review)

**Writes**: `lcs.mid_sequence_state`, `lcs.event` (CET), `lcs.err0` (on failure)

**Exit**: Delivery attempted, status recorded, CET event logged. Circle closed — next signal_queue scan picks up new signals.

## ERD — Entity Relationship

### LCS Core Tables (CL Database)

| Table | Schema | Columns | Access | Phase | Key Columns |
|-------|--------|---------|--------|-------|-------------|
| signal_queue | lcs | sovereign_company_id, signal_set_hash, lifecycle_phase, priority, status | R/W | CID ingress | PK: id, FK: sovereign_company_id |
| cid | lcs | communication_id, sovereign_company_id, entity_type, entity_id, signal_set_hash, signal_queue_id, frame_id, lifecycle_phase, lane, agent_number, intelligence_tier, compilation_status, compilation_reason | W | CID output | PK: communication_id, FK: signal_queue_id, frame_id |
| sid_output | lcs | sid_id, communication_id, frame_id, template_id, subject_line, body_plain, body_html, sender_identity, sender_email, recipient_email, recipient_name, construction_status | W | SID output | PK: sid_id, FK: communication_id, frame_id |
| mid_sequence_state | lcs | mid_id, message_run_id, communication_id, adapter_type, channel, sequence_position, attempt_number, gate_verdict, gate_reason, throttle_status, delivery_status, scheduled_at, attempted_at | W | MID output | PK: mid_id, FK: communication_id |
| frame_registry | lcs | frame_id, frame_name, lifecycle_phase, frame_type, tier, required_fields, fallback_frame, channel, step_in_sequence, cid_compilation_rule, sid_template_id, mid_sequence_type, mid_delay_hours, mid_max_attempts, is_active | R | CID+SID+MID | PK: frame_id |
| adapter_registry | lcs | (capacity, health, daily caps per adapter) | R | CID+MID gates | — |
| signal_registry | lcs | (signal type definitions) | R | CID | — |
| event | lcs | communication_id, message_run_id, sovereign_company_id, entity_type, entity_id, event_type, delivery_status, adapter_type, channel, lifecycle_phase, payload | W | MID egress | FK: communication_id, message_run_id |
| err0 | lcs | message_run_id, communication_id, sovereign_company_id, failure_type, failure_message, orbt_strike_number, orbt_action_taken, orbt_alt_channel_eligible | W | MID failure | FK: communication_id, message_run_id |

### Cross-Hub Tables Read by LCS

| Table | Schema | Database | Access | Used In |
|-------|--------|----------|--------|---------|
| company_identity | cl | CL | R | Intelligence assembly |
| company_identity_bridge | cl | CL | R | Sovereign→Outreach ID resolution |
| v_company_intelligence | cl | CL | R | CID + SID intelligence collection |
| v_company_lifecycle_status | cl | CL | R | Lifecycle promotion |
| outreach | outreach | CL | R | Outreach_ID lookup |
| company_target | outreach | Outreach | R | Company enrichment data |
| company_slot | people | CL | R | Recipient resolution |
| people_master | people | CL | R | Contact details |

### Cross-Repo Joins

| Source Table | Target Table | Join Key | Direction |
|-------------|-------------|----------|-----------|
| lcs.cid | cl.company_identity | sovereign_company_id | → |
| cl.company_identity_bridge | outreach.outreach | outreach_id | → |
| lcs.cid | lcs.frame_registry | frame_id | → |
| lcs.signal_queue | lcs.cid | signal_queue_id | → |
| lcs.cid | lcs.sid_output | communication_id | → |
| lcs.sid_output | lcs.mid_sequence_state | communication_id | → |
| lcs.mid_sequence_state | lcs.event | message_run_id | → |
| lcs.mid_sequence_state | lcs.err0 | message_run_id | → |

### Event Partitioning

`lcs.event` is partitioned by month:
- `lcs.event_2026_02` (February 2026)
- `lcs.event_2026_03` (March 2026)
- `lcs.event_2026_04` (April 2026)

## Services and Infrastructure

| Service | Purpose | Binding/Config | Status |
|---------|---------|---------------|--------|
| CF Workers + Hyperdrive | UT Rim API + DB connection pooling | HD_CL binding on svgagency-api Worker | WIRED |
| Neon PostgreSQL | CL database (37 tables in CL DB) | Doppler: CL_DATABASE_URL | WIRED |
| Neon PostgreSQL | Outreach database | Doppler: OUTREACH_DATABASE_URL | WIRED |
| Doppler | Secrets management | imo-creator project, dev config | WIRED |
| Mailgun | Email delivery (MG channel) | Doppler: MAILGUN_API_KEY, MAILGUN_DOMAIN | PARTIAL — adapter code exists, not routed through CF Worker yet |
| HeyReach | LinkedIn delivery (HR channel) | Doppler: HEYREACH_API_KEY | PARTIAL — adapter code exists, not routed through CF Worker yet |
| Calendly | Meeting scheduling (Sales Handoff channel) | N/A | PLANNED |
| Supabase Edge Functions | Legacy delivery runner | supabase/functions/lcs-delivery-runner/ | DEPRECATED — needs migration to CF Worker |

## ORBT Status

| Field | Value |
|-------|-------|
| Mode | BUILD |
| Health | YELLOW |
| Notes | CID→SID→MID pipeline code complete in company-lifecycle-cl. 11 frames in frame_registry (7 OUTREACH hammer/drip, 2 ENRICHMENT, 1 NURTURE, 1 catch-all). 2 CIDs compiled, 1 SID constructed, 1 MID delivered. Adapter routing still points to LovableDeliveryAdapter — needs migration to direct CF Worker → Mailgun/HeyReach. Smoke test 2026-03-10: UT Rim endpoints live on svgagency-api.svg-outreach.workers.dev, Hyperdrive HD_CL verified, write-back circle closed. |

## Migration Status

| Component | Current State | Target State | Status | Notes |
|-----------|-------------|-------------|--------|-------|
| CID Compiler | Code in company-lifecycle-cl | Same | WIRED | 8-gate process, 2 CIDs compiled |
| SID Worker | Code in company-lifecycle-cl | Same | WIRED | pg_notify + batch modes, 1 SID constructed |
| MID Engine | Code in company-lifecycle-cl | Same | WIRED | Delivery logic complete, 1 MID delivered |
| Frame Registry | 11 frames in lcs.frame_registry | Same | WIRED | All frames active with CID/SID/MID fields |
| Gate System | 3 gates in @/sys/lcs/gates | Same | WIRED | Capacity, Freshness, Suppression |
| ORBT Error Protocol | err0-logger.ts with 3-strike | Same | WIRED | Strike→action mapping implemented |
| CET Event Logging | cet-logger.ts writes to lcs.event | Same | WIRED | Partitioned by month |
| ID Minter | id-minter.ts (ULID-based) | Same | WIRED | communication_id + message_run_id formats |
| Adapter: Mailgun | @deprecated mailgun-adapter.ts | CF Worker → Mailgun API direct | PARTIAL | Code exists, routed through Lovable instead |
| Adapter: HeyReach | @deprecated heyreach-adapter.ts | CF Worker → HeyReach API direct | PARTIAL | Code exists, routed through Lovable instead |
| Adapter: Sales Handoff | @deprecated sales-handoff-adapter.ts | CF Worker → Slack/CRM | PARTIAL | Returns DELIVERED immediately, no real integration |
| Adapter Resolver | Routes all → LovableDeliveryAdapter | Route to direct adapters via CF Worker | PARTIAL | Lovable is retired. Need to update resolver to call MG/HR/SH directly. |
| UT Rim (POST /query) | svgagency-api Worker | Same | WIRED | Smoke tested 2026-03-10 |
| Hyperdrive HD_CL | 7 bindings, caching disabled | Same | WIRED | All 7 DBs verified |
| Outreach Send Stub | POST /outreach/send (200 stub) | Full pipeline: DB→Claude API→MG/HR→writeback | PLANNED | Endpoint exists, pipeline not wired |
| Supabase Edge Functions | lcs-delivery-runner exists | Remove — replace with CF Worker | DEPRECATED | Legacy path, not called by CID→SID→MID pipeline |
| SID Template Engine | Static text construction | Full HTML template engine | PLANNED | body_html is null, body_plain is static |
| Real-Time SID Listener | pg_notify channel wired | Deploy listener process | PARTIAL | Code exists, needs hosting (CF Worker or long-running process) |

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Created | 2026-03-10 |
| Last Modified | 2026-03-10 |
| Authority | imo-creator (Sovereign) |
| Source Process | processes.ts → PROC-LCS |
| Verified By | LCS Smoke Test (BAR-33 through BAR-36) |
| Pipeline Code | company-lifecycle-cl/src/app/lcs/ |
