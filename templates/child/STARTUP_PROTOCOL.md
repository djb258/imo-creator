# CC Startup Protocol

Every session, before any work. No exceptions.

---

## Sequence (MANDATORY — execute in order)

### 1. Doctrine Version Check

- Read `DOCTRINE.md` → get declared `Doctrine Version`
- Check if imo-creator is accessible (local path: `../imo-creator`, `../../imo-creator`, or `~/Desktop/Cursor Builds/imo-creator`)
- **If accessible**: compare child version vs parent `TEMPLATES_MANIFEST.yaml` version
  - If stale: run `./scripts/update_from_imo_creator.sh` automatically
  - If current: proceed
- **If not accessible**: WARN but proceed (do not block work over network/path issues)

```
DOCTRINE.md version == parent manifest version → proceed
DOCTRINE.md version != parent manifest version → sync first
Parent not found → warn, proceed with local doctrine
```

### 2. Load Tier 1 (3 files only)

| File | Purpose |
|------|---------|
| `IMO_CONTROL.json` | Hub identity, governance contract |
| `CC_OPERATIONAL_DIGEST.md` | ALL operational rules (~500 lines) |
| `CLAUDE.md` | AI permissions, repo-specific rules |

**Do NOT pre-load anything else.** Tier 2 files load on-demand when work requires them.

### 3. Verify Checkpoint

- Read `DOCTRINE_CHECKPOINT.yaml`
- If file is missing: create it from template
- If `last_verified` is stale (>24 hours) or has bracket placeholders:
  - Ask: "Doctrine checkpoint is stale. What are you working on?"
  - Fill checkpoint fields based on the answer
  - Save, then proceed to coding
- If checkpoint is current and complete: proceed

### 4. Ready

CC is now:
- **Doctrine-current** — version matches parent (or warned if offline)
- **Context-loaded** — Tier 1 files read
- **Checkpoint-verified** — plan declared before build

Load Tier 2 files on-demand as work requires them. Never pre-load all.

---

## Timing Budget

| Step | Target |
|------|--------|
| Version check | < 2 seconds (local file read) |
| Tier 1 load | < 3 seconds (3 files) |
| Checkpoint verify | < 5 seconds (read + prompt if stale) |
| **Total** | **< 10 seconds** |

This is startup, not a ceremony. Do not expand it.

---

## Failure Modes

| Failure | Response |
|---------|----------|
| imo-creator not found | WARN, proceed with local doctrine |
| DOCTRINE.md missing | WARN, proceed (bootstrap incomplete) |
| CC_OPERATIONAL_DIGEST.md missing | HALT — cannot operate without operational rules |
| DOCTRINE_CHECKPOINT.yaml missing | Create from template, fill, then proceed |
| Network error | Ignore — this is local-first |

---

## What This Protocol Prevents

- CC starting work with stale doctrine (rules changed but child didn't sync)
- CC skipping doctrine entirely and jumping straight to code
- CC loading 15+ files into context window when 3 suffice
- CC coding without declaring what it's building (checkpoint)

---

## Document Control

| Field | Value |
|-------|-------|
| Created | [YYYY-MM-DD] |
| Last Modified | [YYYY-MM-DD] |
| Status | ACTIVE |
| Authority | imo-creator (Constitutional) |
