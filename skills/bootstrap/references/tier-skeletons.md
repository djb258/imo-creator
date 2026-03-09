# Tier Skeletons — Bootstrap Reference

Load during Phase 2 (Inventory) to build the required file list.

---

## GARAGE Skeleton

| Required File | Source Template | Placeholder |
|--------------|----------------|-------------|
| CLAUDE.md | templates/claude/CLAUDE_GARAGE.md | [REPO_NAME], [DATE] |
| CONSTITUTION.md | templates/doctrine/CONSTITUTION.md | — (copy as-is) |
| README.md | templates/docs/README_GARAGE.md | [REPO_NAME], [DATE] |
| FLEET_REGISTRY.yaml | templates/config/FLEET_REGISTRY.yaml | [REPO_NAME] |
| ADR_INDEX.md | templates/adr/ADR_INDEX.md | [REPO_NAME], [DATE] |
| REPO_HOUSEKEEPING.md | templates/checklists/REPO_HOUSEKEEPING.md | [REPO_NAME] |
| /ADRs/ADR-000-template.md | templates/adr/ADR.md | — (copy as-is) |

**Garage note:** imo-creator IS the Garage. Running bootstrap on imo-creator
itself is a doctrine violation unless explicitly authorized by human.

---

## CAR REPO Skeleton

| Required File | Source Template | Placeholders |
|--------------|----------------|-------------|
| CLAUDE.md | templates/claude/CLAUDE_CAR.md | [REPO_NAME], [TIER], [DATE], [SOVEREIGN_ID] |
| README.md | templates/docs/README_CAR.md | [REPO_NAME], [DATE] |
| SYSTEM_MAP.md | templates/docs/SYSTEM_MAP.md | [REPO_NAME], [DATE] |
| /docs/OSAM.md | templates/semantic/OSAM.md | [REPO_NAME], [DATE] |
| /docs/PRD.md | templates/prd/PRD_HUB.md | [REPO_NAME], [DATE] |
| /ADRs/ADR-000-template.md | templates/adr/ADR.md | — (copy as-is) |

---

## SUB-HUB Skeleton

| Required File | Source Template | Placeholders |
|--------------|----------------|-------------|
| CLAUDE.md | templates/claude/CLAUDE_SUBHUB.md | [REPO_NAME], [TIER], [DATE], [SOVEREIGN_ID], [PARENT_REPO] |
| README.md | templates/docs/README_SUBHUB.md | [REPO_NAME], [DATE], [PARENT_REPO] |
| /docs/PRD.md | templates/prd/PRD_HUB.md | [REPO_NAME], [DATE] |
| /docs/OSAM.md | templates/semantic/OSAM.md | [REPO_NAME], [DATE] |
| /ADRs/ADR-000-template.md | templates/adr/ADR.md | — (copy as-is) |

**Sub-hub note:** Verify parent Car repo is bootstrapped before stamping sub-hub.
Parent Car path must be resolvable. If not, halt and ask developer.
