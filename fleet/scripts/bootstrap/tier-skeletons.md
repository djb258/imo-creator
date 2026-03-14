# Tier Skeletons — Bootstrap Reference

Load during Phase 2 (Inventory) to build the required file list.

---

## GARAGE Skeleton

| Required File | Source Template | Placeholder |
|--------------|----------------|-------------|
| CLAUDE.md | fleet/prompts/CLAUDE_GARAGE.md | [REPO_NAME], [DATE] |
| CONSTITUTION.md | law/doctrine/CONSTITUTION.md | — (copy as-is) |
| README.md | fleet/docs/README_GARAGE.md | [REPO_NAME], [DATE] |
| FLEET_REGISTRY.yaml | fleet/config/FLEET_REGISTRY.yaml | [REPO_NAME] |
| ADR_INDEX.md | fleet/adr-templates/ADR_INDEX.md | [REPO_NAME], [DATE] |
| REPO_HOUSEKEEPING.md | fleet/checklists/REPO_HOUSEKEEPING.md | [REPO_NAME] |
| /ADRs/ADR-000-template.md | fleet/adr-templates/ADR.md | — (copy as-is) |

**Garage note:** imo-creator IS the Garage. Running bootstrap on imo-creator
itself is a doctrine violation unless explicitly authorized by human.

---

## CAR REPO Skeleton

| Required File | Source Template | Placeholders |
|--------------|----------------|-------------|
| CLAUDE.md | fleet/prompts/CLAUDE_CAR.md | [REPO_NAME], [TIER], [DATE], [SOVEREIGN_ID] |
| README.md | fleet/docs/README_CAR.md | [REPO_NAME], [DATE] |
| SYSTEM_MAP.md | fleet/docs/SYSTEM_MAP.md | [REPO_NAME], [DATE] |
| /docs/OSAM.md | law/semantic/OSAM.md | [REPO_NAME], [DATE] |
| /docs/PRD.md | fleet/car-template/docs/PRD_HUB.md | [REPO_NAME], [DATE] |
| /ADRs/ADR-000-template.md | fleet/adr-templates/ADR.md | — (copy as-is) |

---

## SUB-HUB Skeleton

| Required File | Source Template | Placeholders |
|--------------|----------------|-------------|
| CLAUDE.md | fleet/prompts/CLAUDE_SUBHUB.md | [REPO_NAME], [TIER], [DATE], [SOVEREIGN_ID], [PARENT_REPO] |
| README.md | fleet/docs/README_SUBHUB.md | [REPO_NAME], [DATE], [PARENT_REPO] |
| /docs/PRD.md | fleet/car-template/docs/PRD_HUB.md | [REPO_NAME], [DATE] |
| /docs/OSAM.md | law/semantic/OSAM.md | [REPO_NAME], [DATE] |
| /ADRs/ADR-000-template.md | fleet/adr-templates/ADR.md | — (copy as-is) |

**Sub-hub note:** Verify parent Car repo is bootstrapped before stamping sub-hub.
Parent Car path must be resolvable. If not, halt and ask developer.
