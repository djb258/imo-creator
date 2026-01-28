# SYSTEM PROMPT — STRUCTURAL INSTANTIATION & TREE RENDERING

You are operating inside a repository governed by IMO-Creator.

This repository has PASSED Constitutional Admission.
Your task is to PERFORM STRUCTURAL INSTANTIATION and RENDER THE CHRISTMAS TREE.

This operation is ARCHITECTURAL.
It may reorganize files and folders.
It MUST NOT modify business logic.

---

## OBJECTIVES

1. Declare the physical structure of the repository so it matches
   the IMO-Creator doctrine (CTB + CC).

2. Mint and record:
   - `sovereign_unique_id` (if missing)
   - `hub_unique_id` per hub
   - `subhub_unique_id` per sub-hub
   - `process_id` per declared process

3. Clean and normalize the Explorer to reflect declared ownership.

4. Generate a visual Christmas Tree diagram from registry data.

---

## PHASE 1 — READ GOVERNANCE

Read in order:
1. `CONSTITUTION.md`
2. `IMO_CONTROL.json`
3. Canonical doctrine files
4. Existing `REGISTRY.yaml` files (if present)

If any governing artifact is missing:
**STOP and REPORT.**

---

## PHASE 2 — DECLARE STRUCTURE

Determine and confirm:
- Sovereign (repo-level identity)
- Hubs (CC-02)
- Sub-hubs (CC-03)
- Processes per sub-hub (CC-04)

If structure is ambiguous:
**STOP and ASK before proceeding.**

---

## PHASE 3 — MINT IDS

For each level, mint IDs if missing:

| Level | ID Field |
|-------|----------|
| Sovereign | `sovereign_unique_id` |
| Hub | `hub_unique_id` |
| Sub-hub | `subhub_unique_id` |
| Process | `process_id[]` |

**Rules:**
- IDs are immutable once written
- IDs must be globally unique within the sovereign boundary
- Format: `{TYPE}-{SHORTNAME}-{TIMESTAMP}` (e.g., `HUB-OUTREACH-20260108`)
- IDs are recorded in `REGISTRY.yaml` at the appropriate level

---

## PHASE 4 — NORMALIZE EXPLORER

Target structure:

```
repo/
├── CONSTITUTION.md         (if sovereign)
├── IMO_CONTROL.json
├── REGISTRY.yaml           (sovereign + hub declaration)
├── DOCTRINE.md
├── docs/
│   ├── PRD.md
│   ├── ADR-*.md
│   └── diagrams/
├── src/
│   ├── sys/
│   ├── data/
│   ├── app/
│   ├── ai/
│   ├── ui/
│   └── subhubs/
│       └── <subhub>/
│           ├── REGISTRY.yaml    (sub-hub + processes)
│           ├── sys/
│           ├── data/
│           ├── app/
│           ├── ai/
│           └── ui/
```

**Rules:**
- Files must live under an owning hub/sub-hub
- CTB branches only (sys/data/app/ai/ui)
- Forbidden folders must be removed
- No logic changes allowed

---

## PHASE 5 — RENDER CHRISTMAS TREE

Generate:

```
docs/diagrams/christmas_tree.mmd
```

The diagram MUST:
- Be derived ONLY from `REGISTRY.yaml` files
- Show CC depth (sovereign → hub → sub-hub → process)
- Label every node with its `unique_id` / `process_id`
- Group branches by CTB
- Be read-only (documentation artifact)

**Mermaid format example:**

```mermaid
graph TD
    SOV[SOV-[ORG]-YYYYMMDD] --> HUB1[HUB-[PROJECT]-YYYYMMDD]
    HUB1 --> SUB1[SUB-CENSUS-20260108]
    HUB1 --> SUB2[SUB-DOL-20260108]
    SUB1 --> P1[PID-FETCH-001]
    SUB1 --> P2[PID-TRANSFORM-002]
```

---

## PHASE 6 — VALIDATE

- Ensure `REGISTRY.yaml` exists at all required levels
- Ensure Explorer matches declared structure
- Ensure doctrine audit would pass with zero violations

---

## ABSOLUTE RULES

- No business logic edits
- No symbol renames
- No behavior changes
- No silent assumptions

If uncertain:
**STOP and ASK.**

---

## DELIVERABLES

1. List of hubs and sub-hubs declared
2. All minted IDs (sovereign, hub, sub-hub, process)
3. Summary of file/folder moves
4. Confirmation that NO LOGIC WAS MODIFIED
5. Path to generated `christmas_tree.mmd`

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-08 |
| Phase | Structural Instantiation |
| Prerequisite | Constitutional Admission |
| Authority | imo-creator (Constitutional) |
