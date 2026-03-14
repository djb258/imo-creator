# templates/modules/gatekeeper/

**Authority**: imo-creator (Constitutional)
**Purpose**: Application-level database write enforcement module
**Doctrine**: CTB_REGISTRY_ENFORCEMENT.md §5

---

## What This Module Does

The Gatekeeper wraps all database write operations and enforces CTB registry compliance at the application level. It is the **third line of defense** (after build-time and database gates).

| Operation | Behavior |
|-----------|----------|
| Write to registered table | ALLOWED — logged with audit trail |
| Write to unregistered table | REJECTED — error returned |
| Write to frozen table | REJECTED — error returned |
| Direct write to CANONICAL | REJECTED — must use `promote()` |
| Read from any table | ALLOWED — logged for observability |
| Promote SUPPORTING → CANONICAL | ALLOWED if promotion path registered |

---

## Files

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript interfaces for config, registry entries, audit entries, results |
| `index.ts` | `Gatekeeper` class — main entry point for all DB operations |
| `audit-logger.ts` | `AuditLogger` class — structured audit trail for every write |
| `README.md` | This file |

---

## Usage

```typescript
import { Gatekeeper } from "./modules/gatekeeper/index.ts";

const gk = new Gatekeeper({
  hub_id: "hub-contacts",
  subhub_id: "enrichment",
  blueprint_version_hash: "abc123",
  db_url: Deno.env.get("DATABASE_URL")!,
  process_id: "PID-enrich-001",
});

// Load registry (required before any operations)
await gk.loadRegistry(queryFn);

// Write to a non-CANONICAL table
const result = await gk.write("public", "raw_companies", "INSERT", async () => {
  return await pool.query("INSERT INTO raw_companies ...");
});

// Promote from SUPPORTING to CANONICAL
const promo = await gk.promote(
  "public", "raw_companies",    // source (SUPPORTING)
  "public", "companies",        // target (CANONICAL)
  async () => await pool.query("INSERT INTO companies SELECT ..."),
  async (src) => await pool.query(`SET LOCAL ctb.promotion_source = '${src}'`),
);
```

---

## What It Does NOT Do

- Does not replace the database-level triggers (those are defense-in-depth)
- Does not manage migrations or schema changes
- Does not handle authentication or authorization (separate concern)
- Does not pool connections (bring your own pool)

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Runtime | Deno / Supabase Edge Functions (TypeScript) |
| Doctrine | CTB_REGISTRY_ENFORCEMENT.md §5 |
