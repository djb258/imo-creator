# README — [REPO_NAME]

**Tier**: Car
**Sovereign ID**: [SOVEREIGN_ID]
**Parent Garage**: imo-creator
**Created**: [DATE]
**Status**: ACTIVE

---

## AI Agent: Start Here

You are operating in a **Car repo**. This is a child of the Garage (imo-creator).

### Authority Pyramid

When rules conflict, higher levels win. No exceptions.

```
┌─────────────────────────────────────┐
│  1. imo-creator/CONSTITUTION.md     │  ← Supreme law — always wins
├─────────────────────────────────────┤
│  2. imo-creator/CLAUDE.md           │  ← Garage doctrine
├─────────────────────────────────────┤
│  3. [REPO_NAME]/CLAUDE.md           │  ← This repo's local rules
├─────────────────────────────────────┤
│  4. [REPO_NAME]/docs/SYSTEM_MAP.md  │  ← Architecture map
├─────────────────────────────────────┤
│  5. [REPO_NAME]/docs/PRD.md         │  ← Build contract
├─────────────────────────────────────┤
│  6. [REPO_NAME]/ADRs/               │  ← Decision log
└─────────────────────────────────────┘
```

**Deference Rule:** This repo defers to the Garage on all conflicts. If anything here contradicts imo-creator doctrine — Garage wins.

---

## What This Repo Is

[One paragraph. What problem does this Car solve? What domain does it own?
Who triggers it? What does it produce? Keep it to 4–6 sentences.]

---

## Repo Structure

```
[REPO_NAME]/
├── CLAUDE.md                    # Local doctrine + deference pointer
├── README.md                    # This file
├── docs/
│   ├── SYSTEM_MAP.md            # Hub-spoke architecture map
│   ├── PRD.md                   # Product requirements
│   └── OSAM.md                  # Operational Semantic Access Map
├── ADRs/
│   └── ADR-001-[decision].md    # Architecture decision log
├── src/
│   ├── sys/                     # System infrastructure
│   ├── data/                    # Data layer
│   ├── app/                     # Application logic
│   ├── ai/                      # AI components
│   └── ui/                      # User interface (if applicable)
└── scripts/                     # Automation only — no logic
```

---

## Hub Summary

| Field | Value |
|-------|-------|
| Hub Name | [name] |
| Domain | [what this hub owns] |
| Trigger | [what fires it] |
| Input | [what comes in] |
| Output | [what goes out] |
| Sub-Hubs | [list sub-hub names] |

Full architecture: `docs/SYSTEM_MAP.md`

---

## Sub-Hub Registry

| Sub-Hub | Sovereign ID | Domain | Status |
|---------|-------------|--------|--------|
| [name] | [SOVEREIGN_ID] | [one-line purpose] | ACTIVE / STUB / PLANNED |

---

## What Claude Code Can Do Here

| Action | Permitted |
|--------|-----------|
| Read all files | ✅ YES |
| Create files per doctrine | ✅ YES |
| Draft ADRs in /ADRs/ | ✅ YES |
| Run Planner→Builder→Auditor pipeline | ✅ YES |
| Modify imo-creator templates or doctrine | ❌ NO |
| Skip Auditor sign-off | ❌ NO |
| Call sub-hubs directly from another sub-hub | ❌ NO |
| Add logic to spokes | ❌ NO |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | [DATE] |
| Last Modified | [DATE] |
| Status | ACTIVE |
| Authority | Human only — AI cannot modify this file |
