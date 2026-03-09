# CLAUDE.md — [REPO_NAME]

## 01 REPO IDENTITY

| Field | Value |
|-------|-------|
| Sub-Hub Name | [REPO_NAME] |
| Version | v0.1.0 |
| Tier | Sub-Hub |
| Sovereign ID | [SOVEREIGN_ID] |
| Parent Repo | [PARENT_REPO] |
| Owner | Dave / SVG Agency |
| Created | [DATE] |

---

## 02 DOCTRINE POINTER

This is a Sub-Hub. It defers to its parent Car repo and ultimately to the Garage.

| Document | Location | Rule |
|----------|----------|------|
| Parent Doctrine | [PARENT_REPO]/CLAUDE.md | Parent Car wins on repo-local conflicts |
| Constitutional Law | imo-creator/CLAUDE.md | Garage wins on all constitutional conflicts |
| Constitution | imo-creator/CONSTITUTION.md | Transformation Law — supreme |

**Deference Rule:** Sub-Hub → Car → Garage. Each level defers upward. Garage always wins.

---

## 03 ARCHITECTURE MAP

| Layer | Component | Description |
|-------|-----------|-------------|
| Hub | [sub-hub name] | [what this sub-hub processes — its single domain] |
| Rim | [rim component] | [I/O interface for this sub-hub only] |
| Input Spoke | [spoke name] | [what data arrives and from where] |
| Output Spoke | [spoke name] | [what data leaves and goes where] |

**Sub-Hub Law:** This sub-hub does ONE job. It does not know other sub-hubs exist.
All inter-sub-hub communication routes through the parent Car hub only.

---

## 04 TRIGGER MAP

| Trigger | Source | How It Arrives |
|---------|--------|---------------|
| [what fires this sub-hub] | [parent hub / orchestrator / cron] | [event / queue message / direct call] |

---

## 05 FORBIDDEN ZONE

| Category | Forbidden |
|----------|-----------|
| Files | [files Claude Code must never touch] |
| Patterns | Never call other sub-hubs directly — route through parent hub |
| Silos | Never bleed logic into adjacent sub-hubs |
| Actions | Never modify parent repo or Garage templates |

---

## 06 PIPELINE ORDER

```
Step 1 → [ingress — receive and validate input]
Step 2 → [middle — process, transform, decide]
Step 3 → [egress — emit output to parent hub]
Step 4 → [error — write failures to ERROR table]
```

---

## 07 ADR REFERENCES

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | [first sub-hub-local decision] | PROPOSED |

Sub-hub ADRs are local only. Fleet-wide decisions go to imo-creator/ADR_INDEX.md.

---

## 08 HOUSEKEEPING RULES

- Slash commands: `/lockup`, `/housekeeping`, `/sync-check`, `/status`
- Housekeeping doc: `imo-creator/templates/checklists/REPO_HOUSEKEEPING.md`
- Sub-hub owns exactly: 1 CANONICAL table + 1 ERROR table (ADR-001)

---

## 09 OBSERVABILITY

| Signal | Location | Notes |
|--------|----------|-------|
| Logs | [log path] | [what gets logged at this sub-hub] |
| Error Table | [schema.table_name_error] | One ERROR table — failures land here |
| Canonical Table | [schema.table_name_canonical] | One CANONICAL table — successes land here |

**Two-Table Law:** Every sub-hub has exactly one CANONICAL and one ERROR table. No exceptions.

---

## WHAT CLAUDE CODE CAN DO IN THIS SUB-HUB

| Action | Permitted |
|--------|-----------|
| Read all files | ✅ YES |
| Create files per doctrine | ✅ YES |
| Create local ADR drafts | ✅ YES |
| Call other sub-hubs directly | ❌ NO |
| Modify parent Car repo doctrine | ❌ NO |
| Modify imo-creator templates | ❌ NO |
| Add logic to spokes | ❌ NO |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | [DATE] |
| Last Modified | [DATE] |
| Status | ACTIVE |
| Authority | Human only |
