# CLAUDE.md — [REPO_NAME]

## 01 REPO IDENTITY

| Field | Value |
|-------|-------|
| Repo Name | [REPO_NAME] |
| Version | v0.1.0 |
| Tier | Car |
| Sovereign ID | [SOVEREIGN_ID] |
| Owner | Dave / SVG Agency |
| Created | [DATE] |

---

## 02 DOCTRINE POINTER

This repo is a Car. It defers to the Garage for all constitutional law.

| Document | Location | Rule |
|----------|----------|------|
| Constitutional Law | imo-creator/CLAUDE.md | Garage wins on all conflicts |
| Doctrine Index | imo-creator/DOCTRINE_INDEX.md | Master registry |
| Constitution | imo-creator/CONSTITUTION.md | Transformation Law — supreme |

**Deference Rule:** If anything in this file conflicts with imo-creator doctrine — Garage wins. Always.

---

## 03 ARCHITECTURE MAP

| Layer | Component | Description |
|-------|-----------|-------------|
| Hub | [hub name] | [what processes here] |
| Rim | [rim component] | [I/O interface — what touches outside world] |
| Spokes | [list] | [named data pipes — no logic] |

**Hub-Spoke Law:** Hub owns all logic. Spokes carry data only. Rim is the only layer touching the outside world.

---

## 04 TRIGGER MAP

| Trigger | Source | How It Arrives |
|---------|--------|---------------|
| [what fires this repo] | [origin system] | [webhook / cron / CLI / packet / manual] |

---

## 05 FORBIDDEN ZONE

| Category | Forbidden |
|----------|-----------|
| Files | [list files Claude Code must never touch] |
| Patterns | [list patterns Claude Code must never use] |
| Silos | [list silos Claude Code must never cross] |
| Actions | Never modify imo-creator templates or doctrine |

---

## 06 PIPELINE ORDER

```
Step 1 → [first step]
Step 2 → [second step]
Step 3 → [third step]
Step N → [final step]
```

**Pipeline Law:** Full Planner→Builder→Auditor pipeline runs on every change. No short-circuiting to Auditor-only.

---

## 07 ADR REFERENCES

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | [first decision] | PROPOSED |

All ADRs live in `/ADRs/`. Fleet-wide ADR index at `imo-creator/ADR_INDEX.md`.

---

## 08 HOUSEKEEPING RULES

- Slash commands: `/lockup`, `/housekeeping`, `/sync-check`, `/status`
- Housekeeping doc: `imo-creator/templates/checklists/REPO_HOUSEKEEPING.md`
- Audit on every PR before merge
- Dead files → archive, never delete

---

## 09 OBSERVABILITY

| Signal | Location | Notes |
|--------|----------|-------|
| Logs | [log path or service] | [what gets logged] |
| Metrics | [metrics path or service] | [what gets measured] |
| Error Table | [DB table or file path] | [one ERROR table per sub-hub] |

---

## WHAT CLAUDE CODE CAN DO IN THIS REPO

| Action | Permitted |
|--------|-----------|
| Read all files | ✅ YES |
| Create new files per doctrine | ✅ YES |
| Create ADR drafts | ✅ YES |
| Modify locked Garage files | ❌ NO |
| Skip Planner→Builder→Auditor pipeline | ❌ NO |
| Add logic to spokes | ❌ NO |
| Modify imo-creator templates | ❌ NO |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | [DATE] |
| Last Modified | [DATE] |
| Status | ACTIVE |
| Authority | Human only |
