# /bootstrap — Repo Doctrine Stamper

**Skill**: `imo-creator/skills/bootstrap/SKILL.md`
**Tier**: Garage command — available fleet-wide
**Pipeline**: Detect → Inventory → Resolve → Stamp → Sovereign → Report

---

## Usage

```
/bootstrap
/bootstrap --tier Car
/bootstrap --tier Sub-Hub
/bootstrap --tier Garage
```

## What It Does

Stamps a repo with doctrine scaffolding based on its tier.
Non-destructive — fills missing files only, never overwrites existing ones.
Produces a BOOTSTRAP REPORT every run.

## Arguments

| Flag | Values | Required | Behavior |
|------|--------|----------|---------|
| `--tier` | `Garage` / `Car` / `Sub-Hub` | Optional | If omitted, Claude Code detects tier from existing files — must confirm with you before proceeding |

## Execution Rules

1. **Read the skill first**: Load `imo-creator/skills/bootstrap/SKILL.md` before doing anything
2. **Tier must be declared**: Never infer silently — if ambiguous, ask
3. **Sovereign ID**: Always ask the developer — never generate one
4. **Templates source**: All files sourced from `imo-creator/templates/` only
5. **Halt condition**: If `imo-creator/` path is unresolvable, stop and report — do not improvise
6. **Running on imo-creator itself**: Doctrine violation — halt immediately

## Files Stamped Per Tier

### Garage (imo-creator itself — FORBIDDEN to re-stamp)
Bootstrap halts. Running bootstrap on the Garage is a doctrine violation.

### Car Repo
| File | Source Template |
|------|----------------|
| `CLAUDE.md` | `imo-creator/templates/claude/CLAUDE_CAR.md` |
| `README.md` | `imo-creator/templates/docs/README_CAR.md` |
| `docs/SYSTEM_MAP.md` | `imo-creator/templates/docs/SYSTEM_MAP.md` |
| `docs/PRD.md` | `imo-creator/templates/prd/PRD_HUB.md` |
| `docs/OSAM.md` | `imo-creator/templates/semantic/OSAM.md` |
| `ADRs/ADR-001-initial-architecture.md` | `imo-creator/templates/adr/ADR.md` |

### Sub-Hub
| File | Source Template |
|------|----------------|
| `CLAUDE.md` | `imo-creator/templates/claude/CLAUDE_SUBHUB.md` |
| `README.md` | `imo-creator/templates/docs/README_SUBHUB.md` |
| `docs/PRD.md` | `imo-creator/templates/prd/PRD_HUB.md` |
| `docs/OSAM.md` | `imo-creator/templates/semantic/OSAM.md` |
| `ADRs/ADR-001-initial-architecture.md` | `imo-creator/templates/adr/ADR.md` |

## Placeholder Replacement

Replace all placeholders in stamped files:

| Placeholder | Value Source |
|-------------|-------------|
| `[REPO_NAME]` | Current directory name |
| `[TIER]` | Declared or confirmed tier |
| `[DATE]` | Today's date (YYYY-MM-DD) |
| `[SOVEREIGN_ID]` | Developer-declared — always ask |
| `[PARENT_REPO]` | Parent repo name — ask if Sub-Hub |

**Hard rules:**
- Never invent a placeholder value
- Never leave a placeholder as `[PLACEHOLDER]` in a stamped file
- Never use "TBD" — halt and ask instead

## Bootstrap Report (Required Every Run)

```
═══════════════════════════════════════
BOOTSTRAP REPORT — [REPO_NAME]
═══════════════════════════════════════
Tier:           [declared tier]
Sovereign ID:   [SOVEREIGN_ID]
Run Date:       [DATE]

STAMPED (new files created):
  ✅ CLAUDE.md
  ✅ README.md
  ✅ docs/SYSTEM_MAP.md
  ...

SKIPPED (already existed — not overwritten):
  ⏭ docs/PRD.md
  ...

STATUS: BOOTSTRAP COMPLETE
═══════════════════════════════════════
```

## Full Skill Reference

→ `imo-creator/skills/bootstrap/SKILL.md`
→ `imo-creator/skills/bootstrap/references/tier-skeletons.md`
→ `imo-creator/skills/bootstrap/references/placeholder-map.md`
