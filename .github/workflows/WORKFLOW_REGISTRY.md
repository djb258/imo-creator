# Workflow Registry

**Authority**: imo-creator (Constitutional)
**Last Updated**: 2026-02-20

---

## Active Workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CodeQL | `codeql.yml` | push/PR to master + weekly | Security vulnerability scanning |
| Doctrine Enforcement | `doctrine-enforcement.yml` | push/PR to master/main | Doctrine compliance CI gate |
| Release | `release.yml` | tag push `v*.*.*` | GitHub release creation |
| Reusable CTB Enforcement | `reusable-ctb-enforcement.yml` | workflow_call | Reusable CTB enforcement (called by other workflows) |
| Reusable Fail-Closed Gate | `reusable-fail-closed-gate.yml` | workflow_call | Fail-closed governance gate (4 gates: side-door, executable, DDL, fail-open detection) |
| Reusable CTB Drift Audit | `reusable-ctb-drift-audit.yml` | workflow_call | Live DB vs registry drift detection (6 drift classes, requires DATABASE_URL) |

---

## Archived Workflows

Located in `.github/workflows/archive/`. These were archived on 2026-02-15 during housekeeping audit.

| Workflow | Reason |
|----------|--------|
| `ci.yml` | BROKEN: Duplicate `name:` blocks, references non-existent `scripts/doctor.sh` and `scripts/gen_visuals.cjs` |
| `audit.yml` | DEAD: References non-existent `global-config/ctb.branchmap.yaml`, redundant with `heir-checks.yml` |
| `ctb_drift_check.yml` | DEAD: References non-existent `ctb-template/` directory |
| `ctb_enforcement.yml` | DEAD: Targets wrong branches (`main`/`develop`), checks external repos |
| `ctb_health.yml` | DEAD: References non-existent `global-config/` paths |
| `ctb_version_check.yml` | DEAD: References non-existent `global-config/scripts/ctb_check_version.sh` |
| `chartdb_automation.yml` | DEAD: References non-existent `chartdb/` directory |
| `composio-orchestration.yml` | External dependency: Sends to localhost:3001 Composio MCP |
| `deepwiki_automation.yml` | DEAD: References non-existent `deepwiki/` directory |
| `deploy.yml` | DEAD: References non-existent `services/router.js`, `branches/composio/`, `docs/blueprints/` |
| `doctrine-validate.yml` | External dependency: Sends to localhost:3001 Composio for branch validation |
| `doctrine_sync.yml` | Aggressive: Auto-creates branches, targets wrong branch (`main`) |
| `drawio-ingest.yml` | External dependency: Requires gitingest, draw.io generation |
| `figma-sync.yml` | External dependency: Sends Figma sync to localhost:3001 Composio |
| `firebase-promote.yml` | DEAD: Firebase not in SNAP_ON_TOOLBOX.yaml infrastructure |
| `heir-checks.yml` | DEAD: References non-existent `packages/heir/checks.py`, `docs/blueprints/imo/manifest.yaml` |
| `nightly_drift_check.yml` | DEAD: References non-existent `scripts/doctor.sh` |
| `project_automation.yml` | Unconfigured: Placeholder `[OWNER]` and `[PROJECT_ID]` values |
| `security_lockdown.yml` | DEAD: References non-existent `config/mcp_registry.json`, `config/mcp_endpoints.json` |
| `sync-updates.yml` | DEAD: References non-existent `imo-sync.config.json` |
| `test_coverage.yml` | DEAD: References non-existent `requirements.txt`, `tests/`, `config/mcp_registry.json` |

---

## Restoration

To restore an archived workflow:

1. Move from `archive/` back to `.github/workflows/`
2. Fix branch targets (repo uses `master`, not `main`/`develop`)
3. Fix any dead path references
4. Add constitutional header comment
5. Update this registry

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-15 |
| Authority | imo-creator |
