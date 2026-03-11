---
name: neon
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

## Quick Decision Matrix

| Question | Answer determines |
|----------|------------------|
| Serverless or long-running? | HTTP driver (neon()) vs WebSocket Pool vs TCP driver |
| Going through Cloudflare Hyperdrive? | Vault-sync only (BAR-102). Use pg/Postgres.js, NOT Neon serverless driver |
| Need session features (SET, temp tables, advisory locks)? | Must use direct connection, not pooler |
| Running pg_dump or migrations? | Direct connection required |
| Data > 0.5GB? | Free plan won't hold it — need Launch or Scale |
| Need 24/7 uptime with no cold starts? | Set min compute > 0, or accept PgBouncer-masked cold starts |
| Write-heavy workload? | Working writes go to CF D1/KV. Neon vault receives nightly sync only (BAR-102) |

## Architecture Fundamentals

Neon splits compute (stateless Postgres on K8s) from storage (custom multi-tenant engine).
This enables three things that matter for build decisions:

1. **Scale-to-zero**: No connections for configurable period → compute suspends → $0.
   Cold start on resume takes a few seconds. PgBouncer masks most of this from apps
2. **Branching**: Copy-on-write database clones. Zero initial storage. Writable. Use for
   dev, CI preview environments, safe migration testing on production data
3. **Autoscaling**: CPU/memory scales between min and max CU based on load. Set max CU
   as your cost ceiling

A Compute Unit (CU) ≈ 4GB RAM + proportional CPU + local SSD.

## Connection Pooling — The Make-or-Break Config

Neon uses PgBouncer in **transaction mode** on all plans. Up to 10,000 concurrent
connections via the pooled endpoint. This is the most important thing to get right.

**What breaks in transaction mode** (connection returns to pool after each transaction):
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

Direct connections are limited by compute size (0.25 CU = 97 available, 9+ CU caps at 4,000).
Pooled connections can handle up to 10,000 regardless of compute size.

For full connection config details, read `references/connections.md`.

## Branching

Neon's killer feature. Copy-on-write clones of your database — instant, zero initial storage.

**Use for:**
- Feature branch development (isolated from production data)
- CI/CD preview environments (GitHub Actions integration: `neondatabase/create-branch-action@v5`)
- Safe migration testing against real production data
- Analytics/ML workloads isolated from production

**Branch from:** HEAD (current state), specific timestamp, or specific LSN.

**Storage billing:** Branches start at zero. You're billed for the minimum of accumulated
changes or logical data size. Set TTL on dev/preview branches to auto-delete.

**Limits:** Free plan has unlimited branches within compute allocation. Launch: 10 included
per project, extra at $0.002/branch-hour. Set `neonctl branches create --name X --parent main`.

## Serverless Driver

`@neondatabase/serverless` — purpose-built for edge/serverless environments.

**Two query modes:**
- **HTTP** (`neon()` function): One-shot queries, no persistent connection. Best for serverless functions. Add cold-start timeout: `fetchOptions: { signal: AbortSignal.timeout(10000) }`
- **WebSocket** (`Pool`/`Client`): Persistent connection over WebSocket. For longer sessions

**Critical rule:** When using Cloudflare Hyperdrive, do NOT use the Neon serverless driver.
Use `node-postgres` (pg) or Postgres.js instead. Hyperdrive handles pooling — doubling up
with Neon's driver creates conflicts.

## What Neon Cannot Do

- No superuser access (you get `neon_superuser` role)
- No host OS access
- No tablespaces (`CREATE TABLESPACE` will error)
- Cannot install arbitrary extensions — only Neon-supported ones
- Cannot configure instance-level Postgres parameters yourself (Scale plan: contact support)
- Unlogged tables: available but behave differently due to storage architecture

**Supported extensions include:** pg_vector, PostGIS, TimescaleDB, and many more.
Full list in Neon docs.

## Neon CLI Quick Reference

```bash
npm install -g neonctl
neonctl auth
neonctl branches list
neonctl branches create --name feature-x --parent main
neonctl connection-string feature-x
neonctl branches delete feature-x
```

## Pricing Summary

Post-Databricks acquisition pricing (Aug 2025):

| | Free | Launch | Scale |
|---|---|---|---|
| Compute | 100 CU-hr/project/mo | $0.106/CU-hr | $0.222/CU-hr |
| Storage | 0.5GB/project | $0.30/GB-mo (first 50-100GB) | Same |
| Max CU | 0.25 CU | 16 CU | 56 CU |
| Branches | Unlimited | 10 included | Plan-dependent |
| SLA | None | None | 99.95% |

For full pricing breakdown and cost examples, read `references/pricing.md`.

## Fleet Reference — Ultimate Tool (UT)

The **Ultimate Tool** (`templates/snap-on/ultimate-tool/`) uses **Cloudflare D1/KV as the
working data layer** (BAR-100). Neon serves as the vault (cold archive / system of record).

**Three-layer architecture (BAR-100):**
- **CF (D1/KV/Queues/R2/Workers)** = working layer (hot-path reads/writes)
- **Composio** = external action bridge
- **Hyperdrive** = vault sync pipe (nightly, BAR-102)
- **Neon** = vault (cold archive, restore source, schema governance)

**How UT and Neon interact (post BAR-100):**
- Child repos store working data in D1 hot mirrors (edge SQLite) and KV (hot reads)
- Neon retains CTB-governed schema, migration history, and cold archive
- Hyperdrive syncs D1 working data → Neon vault on nightly schedule (BAR-102)
- UT's movement detection pipeline (SH-16 through SH-19) writes change events to CF Queues,
  NOT Neon message queue tables
- UT does NOT own any Neon database — vault access is read-only for restore/audit

**Connection pattern for UT → Neon vault:**
- Vault-sync only: Hyperdrive with `node-postgres` (pg) on nightly schedule
- Admin/migration: Direct connection for schema governance
- Each child repo provides a dedicated Neon role for vault access (non-superuser, scoped)

UT's full spec: `templates/snap-on/ultimate-tool/README.md`

## Dave's Operational Notes
<!-- Feed raw notes here: message queue table design, query cost patterns,
     branching workflow for deployments, cold-start incidents -->

## Known Failure Modes
<!-- Document: connection exhaustion events, pooler gotchas, cold-start problems -->
