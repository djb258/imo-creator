# README — [REPO_NAME]

**Tier**: Sub-Hub
**Sovereign ID**: [SOVEREIGN_ID]
**Parent Repo**: [PARENT_REPO]
**Created**: [DATE]
**Status**: ACTIVE

---

## AI Agent: Start Here

You are operating in a **Sub-Hub**. It defers upward to its parent Car, which defers to the Garage.

### Authority Pyramid

```
┌─────────────────────────────────────────┐
│  1. imo-creator/CONSTITUTION.md         │  ← Supreme law — always wins
├─────────────────────────────────────────┤
│  2. imo-creator/CLAUDE.md               │  ← Garage doctrine
├─────────────────────────────────────────┤
│  3. [PARENT_REPO]/CLAUDE.md             │  ← Parent Car rules
├─────────────────────────────────────────┤
│  4. [REPO_NAME]/CLAUDE.md               │  ← This sub-hub's local rules
├─────────────────────────────────────────┤
│  5. [REPO_NAME]/docs/PRD.md             │  ← Build contract
├─────────────────────────────────────────┤
│  6. [REPO_NAME]/ADRs/                   │  ← Local decision log
└─────────────────────────────────────────┘
```

**Deference Rule:** Sub-Hub → Parent Car → Garage. Garage always wins.

---

## What This Sub-Hub Does

[One paragraph. What single domain does this sub-hub own? What does it receive?
What does it produce? Where does output go? 4–6 sentences max. One job only.]

---

## Repo Structure

```
[REPO_NAME]/
├── CLAUDE.md                    # Local doctrine + deference pointer
├── README.md                    # This file
├── docs/
│   ├── PRD.md                   # Product requirements
│   └── OSAM.md                  # Operational Semantic Access Map
├── ADRs/
│   └── ADR-001-[decision].md    # Local decision log
├── src/
│   ├── sys/                     # System infrastructure
│   ├── data/                    # Data layer (canonical + error tables)
│   └── app/                     # Application logic
└── scripts/                     # Automation only — no logic
```

---

## Sub-Hub Summary

| Field | Value |
|-------|-------|
| Sub-Hub Name | [name] |
| Domain | [exactly what this sub-hub owns — one sentence] |
| Trigger | [what fires it — parent hub event / queue / cron] |
| Input | [what arrives and from where] |
| Output | [what leaves and where it goes] |
| Canonical Table | [schema.table_name] |
| Error Table | [schema.table_name_error] |

---

## Two-Table Law

Every sub-hub owns exactly two tables. No more.

| Table | Name | Purpose |
|-------|------|---------|
| CANONICAL | [schema.table_name] | Successfully processed records |
| ERROR | [schema.table_name_error] | Failed records — fix and re-enter pipeline |

Failed records never disappear. They land in ERROR, get fixed, and re-enter.

---

## Silo Rule

This sub-hub does not know other sub-hubs exist.

- ✅ Receives data from parent hub via spoke
- ✅ Emits output to parent hub via spoke
- ❌ Never calls another sub-hub directly
- ❌ Never reads another sub-hub's tables directly

All inter-sub-hub communication routes through the parent Car hub only.

---

## What Claude Code Can Do Here

| Action | Permitted |
|--------|-----------|
| Read all files | ✅ YES |
| Create files per doctrine | ✅ YES |
| Draft local ADRs in /ADRs/ | ✅ YES |
| Run Planner→Builder→Auditor pipeline | ✅ YES |
| Call other sub-hubs directly | ❌ NO |
| Modify parent Car or Garage doctrine | ❌ NO |
| Add logic to spokes | ❌ NO |
| Create more than 2 tables (canonical + error) | ❌ NO without ADR |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | [DATE] |
| Last Modified | [DATE] |
| Status | ACTIVE |
| Authority | Human only — AI cannot modify this file |
