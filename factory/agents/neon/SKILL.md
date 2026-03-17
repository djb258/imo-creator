---
name: neon
metadata:
  version: 1.1.0
  tier: master
description: >
  Platform capabilities, hard limits, pricing, and integration patterns for Neon
  Serverless PostgreSQL — connection pooling, branching, autoscaling, scale-to-zero,
  serverless driver, and edge function connectivity. Use this skill whenever building,
  querying, migrating, or making architecture decisions involving Neon or any PostgreSQL
  database in the stack. Trigger on: Neon, PostgreSQL, Postgres, database branch,
  connection pooling, PgBouncer, serverless driver, scale-to-zero, CU-hours, neonctl,
  or any reference to the relational data layer. Also trigger when discussing message
  queue tables, edge function database access, or source-of-truth data storage. If the
  task involves relational data that lives beyond D1's 10GB cap or needs full Postgres
  capabilities, this skill applies — even if the user doesn't mention Neon by name.
---

# Neon — Platform Skill

Neon is the **vault / cold archive** — the system of record and restore source. Full
PostgreSQL with serverless economics — compute separates from storage, scales to zero
when idle, branches like Git. Acquired by Databricks (May 2025).

**BAR-100 Architecture Shift**: Neon is NO LONGER the working database. The working
layer is Cloudflare D1/KV/Queues (see cloudflare skill). Neon serves as:
- Vault (cold archive, system of record)
- Restore source (disaster recovery)
- Schema governance (CTB enforcement, migrations)
- Nightly sync target via Hyperdrive (BAR-102)

The constraints here dictate vault connection architecture, migration patterns, and
governance enforcement. Working-layer reads/writes go to CF D1/KV.

## Tier 0 Doctrine

This skill is governed by the Five Elements (OPERATOR_PROFILE.md, Tier 0). Every block
below declares which element governs it. The gate mechanism, two-question intake, and
fractal IMO apply at every decision point when consulting this skill.

| Element | Application in This Skill |
|---------|--------------------------|
| C&V | Platform limits are constants. Vendor name is a variable. Pricing tiers change. |
| IMO | Query enters (I), platform processes (M), result returns (O). Nests at every layer. |
| CTB | Trunk = PostgreSQL vault. Branches = pooling, branching, driver, pricing. Leaves = specific limits. |
| Hub-and-Spoke | Connections ARE spokes. Pooled endpoint = rim. Neon compute = hub. Direct connections = admin spoke. |
| Circle | Cold-start feedback, cost monitoring, sync verification — output feeds back to input. |

---

### BLOCK 1: Platform Decision Matrix and Architecture
**Governed by: C&V**

**Constants:**
- Neon separates compute (stateless Postgres on K8s) from storage (custom multi-tenant engine)
- A Compute Unit (CU) = 4GB RAM + proportional CPU + local SSD
- Scale-to-zero: no connections for configurable period -> compute suspends -> $0. Cold start on resume takes a few seconds. PgBouncer masks most of this from apps
- Branching: copy-on-write database clones. Zero initial storage. Writable
- Autoscaling: CPU/memory scales between min and max CU based on load. Max CU = cost ceiling
- Post BAR-100: Neon = vault only. Working data lives in CF D1/KV

**Variables:**

| Variable | Determines |
|----------|------------|
| Serverless or long-running? | HTTP driver (neon()) vs WebSocket Pool vs TCP driver |
| Going through Cloudflare Hyperdrive? | Vault-sync only (BAR-102). Use pg/Postgres.js, NOT Neon serverless driver |
| Need session features (SET, temp tables, advisory locks)? | Must use direct connection, not pooler |
| Running pg_dump or migrations? | Direct connection required |
| Data > 0.5GB? | Free plan won't hold it — need Launch or Scale |
| Need 24/7 uptime with no cold starts? | Set min compute > 0, or accept PgBouncer-masked cold starts |
| Write-heavy workload? | Working writes go to CF D1/KV. Neon vault receives nightly sync only (BAR-102) |

**IMO:**
- Input: A build decision involving relational data, PostgreSQL, or the vault layer.
- Middle: Walk the decision matrix above. Each question locks a constant (driver choice, connection type, plan tier). If the answer is unknown, ASK — do not guess.
- Output: A locked architecture decision: which driver, which connection mode, which plan.

**CTB:**
- Trunk: Compute/storage separation — the architectural invariant.
- Branches: Scale-to-zero, branching, autoscaling — the three capabilities that flow from separation.
- Leaves: Specific CU sizes, cold-start durations, plan caps — implementation details.

**Hub-and-Spoke:**
- Hub: Neon compute (stateless Postgres processing).
- Spokes: Connection strings — pooled (application traffic) and direct (admin/migration).
- Rim: PgBouncer endpoint — the interface between application and compute.

**Circle:**
- Validation: Did the decision matrix produce a single clear answer? If two paths remain, a constant is missing — re-run the matrix.
- Feedback: If a cold start, cost spike, or connection failure occurs in production, trace back to which matrix question was answered incorrectly.

**Go/No-Go:** Decision matrix completed. Driver, connection mode, and plan tier locked. No ambiguity remains. Proceed.

---

### BLOCK 2: Connection Pooling
**Governed by: Hub-and-Spoke**

Connections ARE the spokes. Getting this wrong breaks everything silently.

**Constants:**
- Neon uses PgBouncer in **transaction mode** on all plans
- Up to 10,000 concurrent connections via the pooled endpoint
- Direct connections are limited by compute size (0.25 CU = 97 available, 9+ CU caps at 4,000)
- Transaction mode returns the connection to the pool after each transaction — session state is lost

**What breaks in transaction mode:**
- `SET` statements — including `SET search_path`. Changes lost between transactions
- SQL-level `PREPARE` / `EXECUTE` (use protocol-level prepared statements via your driver)
- `pg_dump` (relies on SET) — always use direct connection
- Advisory locks, temp tables, `LISTEN/NOTIFY` — anything session-dependent

**Connection string patterns:**
```
# Pooled (application traffic) — note the -pooler suffix
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require

# Direct (migrations, pg_dump, admin) — no -pooler
postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

For full connection config details, read `references/connections.md`.

**Variables:**

| Variable | Range |
|----------|-------|
| Connection endpoint | Pooled (-pooler suffix) vs Direct (no suffix) |
| Compute size | 0.25 CU to 56 CU — determines direct connection cap |
| Connection count | 97 (0.25 CU) to 4,000 (9+ CU) direct; 10,000 pooled regardless |

**IMO:**
- Input: Application or tool needs a database connection.
- Middle: Classify the connection need. Application traffic = pooled. Migration/dump/admin = direct. Session-dependent features = direct. If unsure, default to pooled and test.
- Output: Correct connection string with appropriate endpoint suffix.

**CTB:**
- Trunk: PgBouncer transaction mode — the pooling invariant.
- Branches: Pooled connections (application spoke), direct connections (admin spoke).
- Leaves: Specific session features that break, connection count limits per CU.

**Hub-and-Spoke:**
- Hub: PgBouncer — the connection coordinator.
- Spokes: Individual connections — dumb pipes carrying queries inward and results outward.
- Rim: The `-pooler` endpoint — the interface applications connect to.

**Circle:**
- Validation: Does the application use SET, PREPARE, temp tables, or advisory locks? If yes and it is on the pooled connection, the Circle failed — silent data corruption or lost state.
- Feedback: Connection exhaustion events, pooler gotchas, or silent SET failures feed back to connection classification. Fix the spoke assignment, not the hub.

**Go/No-Go:** Connection type classified. Pooled vs direct decision locked. No session-dependent features on pooled connections. Proceed.

---

### BLOCK 3: Branching and Serverless Driver
**Governed by: IMO**

**Constants (Branching):**
- Copy-on-write clones of the database — instant, zero initial storage
- Branch from: HEAD (current state), specific timestamp, or specific LSN
- Storage billing: branches start at zero, billed for minimum of accumulated changes or logical data size
- Set TTL on dev/preview branches to auto-delete

**Branching use cases:**
- Feature branch development (isolated from production data)
- CI/CD preview environments (GitHub Actions: `neondatabase/create-branch-action@v5`)
- Safe migration testing against real production data
- Analytics/ML workloads isolated from production

**Branch limits:** Free plan has unlimited branches within compute allocation. Launch: 10 included per project, extra at $0.002/branch-hour.

**Constants (Serverless Driver):**
- `@neondatabase/serverless` — purpose-built for edge/serverless environments
- Two query modes, each with its own IMO

**Two query modes:**
- **HTTP** (`neon()` function): One-shot queries, no persistent connection. Best for serverless functions. Add cold-start timeout: `fetchOptions: { signal: AbortSignal.timeout(10000) }`
- **WebSocket** (`Pool`/`Client`): Persistent connection over WebSocket. For longer sessions

**Critical rule:** When using Cloudflare Hyperdrive, do NOT use the Neon serverless driver. Use `node-postgres` (pg) or Postgres.js instead. Hyperdrive handles pooling — doubling up with Neon's driver creates conflicts.

**Variables:**

| Variable | Range |
|----------|-------|
| Branch parent | HEAD, timestamp, or LSN |
| Branch TTL | Manual delete or auto-expire |
| Driver mode | HTTP (neon()) vs WebSocket (Pool/Client) vs TCP (pg/Postgres.js via Hyperdrive) |
| Cold-start timeout | Configurable via AbortSignal (recommend 10000ms) |

**IMO:**
- Input: Need for an isolated database environment (branching) or a query from edge/serverless (driver).
- Middle: For branching — determine parent, TTL, and purpose. For driver — classify: one-shot (HTTP), session (WebSocket), or Hyperdrive-routed (TCP with pg). Never mix Hyperdrive with serverless driver.
- Output: A branch created with correct parent and lifecycle, or a query executed through the correct driver mode.

**CTB:**
- Trunk: Copy-on-write isolation (branching) and edge-native connectivity (driver).
- Branches: Branch lifecycle (create/TTL/delete), HTTP mode, WebSocket mode, Hyperdrive rule.
- Leaves: Specific action syntax (`neonctl branches create --name X --parent main`), timeout values, driver imports.

**Circle:**
- Validation: Did the branch isolate correctly from production? Did the driver mode match the execution environment? If Hyperdrive was used with the serverless driver, the Circle failed — connection conflicts.
- Feedback: Branch storage cost surprises feed back to TTL policy. Driver connection failures feed back to mode classification.

**Go/No-Go:** Branch purpose and lifecycle locked. Driver mode matches execution environment. Hyperdrive rule respected. Proceed.

---

### BLOCK 4: Constraints and Pricing
**Governed by: CTB**

**Constants (What Neon Cannot Do):**
- No superuser access (you get `neon_superuser` role)
- No host OS access
- No tablespaces (`CREATE TABLESPACE` will error)
- Cannot install arbitrary extensions — only Neon-supported ones
- Cannot configure instance-level Postgres parameters yourself (Scale plan: contact support)
- Unlogged tables: available but behave differently due to storage architecture

**Supported extensions include:** pg_vector, PostGIS, TimescaleDB, and many more. Full list in Neon docs.

**Neon CLI Quick Reference:**
```bash
npm install -g neonctl
neonctl auth
neonctl branches list
neonctl branches create --name feature-x --parent main
neonctl connection-string feature-x
neonctl branches delete feature-x
```

**Constants (Pricing — post-Databricks acquisition, Aug 2025):**

| | Free | Launch | Scale |
|---|---|---|---|
| Compute | 100 CU-hr/project/mo | $0.106/CU-hr | $0.222/CU-hr |
| Storage | 0.5GB/project | $0.30/GB-mo (first 50-100GB) | Same |
| Max CU | 0.25 CU | 16 CU | 56 CU |
| Branches | Unlimited | 10 included | Plan-dependent |
| SLA | None | None | 99.95% |

For full pricing breakdown and cost examples, read `references/pricing.md`.

**Variables:**

| Variable | Range |
|----------|-------|
| Plan tier | Free / Launch / Scale |
| CU allocation | 0.25 to 56 CU |
| Storage consumed | 0 to plan cap |
| Branch count | Unlimited (Free) to plan-dependent (Scale) |
| Extension availability | Neon-supported list (changes over time) |

**IMO:**
- Input: A build decision that involves cost, capability limits, or extension requirements.
- Middle: Check the constraint list first — if Neon cannot do it, stop. Check the pricing table — if the plan does not support the required CU or storage, escalate. CLI reference for operational tasks.
- Output: A plan recommendation with cost ceiling, or a constraint flag that redirects the approach.

**CTB:**
- Trunk: Platform constraints — what Neon cannot do is as important as what it can.
- Branches: Capability constraints (no superuser, no tablespaces), pricing tiers, CLI operations.
- Leaves: Specific prices, CU limits, extension names, CLI commands.

**Circle:**
- Validation: Did the build decision hit a constraint that was not checked beforehand? If a `CREATE TABLESPACE` error appears in production, this block was not consulted.
- Feedback: Cost overruns feed back to CU max settings and plan tier selection. Extension gaps feed back to build decisions (find alternative or request support).

**Go/No-Go:** All constraints checked. Plan tier supports required CU and storage. No forbidden operations in the build plan. Proceed.

---

### BLOCK 5: Fleet Reference and Vault Pattern
**Governed by: Circle**

The feedback loop between the working layer and the vault.

**Constants:**
- The **Ultimate Tool** (`fleet/snap-on/ultimate-tool/`) uses **Cloudflare D1/KV as the working data layer** (BAR-100)
- Neon serves as the vault (cold archive / system of record)
- Child repos never write directly to Neon during hot-path operations
- UT does NOT own any Neon database — vault access is read-only for restore/audit

**Three-layer architecture (BAR-100):**

| Layer | Service | Role |
|-------|---------|------|
| Working | CF (D1/KV/Queues/R2/Workers) | Hot-path reads/writes |
| Bridge | Composio | External action bridge |
| Sync | Hyperdrive | Vault sync pipe (nightly, BAR-102) |
| Vault | Neon | Cold archive, restore source, schema governance |

**How UT and Neon interact (post BAR-100):**
- Child repos store working data in D1 hot mirrors (edge SQLite) and KV (hot reads)
- Neon retains CTB-governed schema, migration history, and cold archive
- Hyperdrive syncs D1 working data -> Neon vault on nightly schedule (BAR-102)
- UT's movement detection pipeline (SH-16 through SH-19) writes change events to CF Queues, NOT Neon message queue tables
- UT does NOT own any Neon database — vault access is read-only for restore/audit

**Connection pattern for UT -> Neon vault:**
- Vault-sync only: Hyperdrive with `node-postgres` (pg) on nightly schedule
- Admin/migration: Direct connection for schema governance
- Each child repo provides a dedicated Neon role for vault access (non-superuser, scoped)

UT's full spec: `fleet/snap-on/ultimate-tool/README.md`

**Variables:**

| Variable | Range |
|----------|-------|
| Sync schedule | Nightly (BAR-102), adjustable |
| Child repo vault roles | Per-repo, non-superuser, scoped |
| Working layer database | D1 instance per child repo |
| Vault connection method | Hyperdrive (sync) vs Direct (admin) |

**IMO:**
- Input: A child repo needs vault access, a restore, or a schema governance operation.
- Middle: Classify the operation. Nightly sync = Hyperdrive with pg. Admin/migration = direct connection. Hot-path read/write = WRONG LAYER — redirect to CF D1/KV. Restore = pull from vault to D1.
- Output: Correct connection pattern executed, or redirect to the working layer.

**CTB:**
- Trunk: The vault pattern — Neon as cold archive and system of record.
- Branches: Working layer (CF), sync pipe (Hyperdrive), vault (Neon), bridge (Composio).
- Leaves: Specific sub-hub mappings (SH-16 through SH-19), connection strings, role names.

**Hub-and-Spoke:**
- Hub: Neon vault — the authoritative data store.
- Spokes: Hyperdrive sync pipe (inbound data), direct connection (admin), child repo roles (scoped access).
- Rim: The vault boundary — nothing writes to Neon during hot-path. All writes flow through the sync schedule.

**Circle:**
- Validation: Is working data going to D1/KV (correct) or directly to Neon (wrong)? Is the nightly sync completing successfully? Are vault restores producing consistent state?
- Feedback: Sync failures feed back to Hyperdrive configuration. Data inconsistencies between D1 and Neon feed back to sync schedule and conflict resolution. Schema drift feeds back to CTB governance.

**Go/No-Go:** Vault pattern understood. Working data goes to CF. Vault receives synced data only. Connection patterns correct. No hot-path writes to Neon. Proceed.

---

## Dave's Operational Notes
<!-- Feed raw notes here: message queue table design, query cost patterns,
     branching workflow for deployments, cold-start incidents -->

## Known Failure Modes
<!-- Document: connection exhaustion events, pooler gotchas, cold-start problems -->

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.1.0 |
| Created | 2026-03-09 |
| Reformatted | v4 Block Format, 2026-03-14 |
| Authority | imo-creator (Sovereign) |
| BAR | BAR-130 |
