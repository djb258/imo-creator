# WORK_PACKET V2 — Field Generation Rules

## Core Fields (V1 Compatible)

| Field | Rule |
|-------|------|
| `id` | Generate unique identifier. Format: `wp-YYYYMMDD-<slug>`. |
| `change_type` | One of: `feature`, `architectural`, `refactor`, `fix`. |
| `architectural_flag` | True if change touches protected assets or backbone primitives. |
| `requires_pressure_test` | Must be true when `architectural_flag=true`. |
| `allowed_paths` | Explicit file paths within scope. No wildcards unless structurally justified. **Barrel rule**: when a directory path is listed, the barrel/re-export file at that directory root (`index.ts`, `index.js`, `index.mts`, `mod.ts`) is implicitly in scope. When individual files within a directory are listed instead of the directory itself, the barrel file MUST be explicitly included if the Builder will modify it. |
| `summary` | Declarative scope boundary derived from user intent. |
| `doctrine_version` | Copy from `factory/contracts/doctrine_version.json` current_version. |
| `timestamp` | ISO 8601 at generation time. |
| `payload` | Domain-specific content. Governance envelope is strict; payload is open. |

## ORBT + Execution Type Fields (Charter §6)

| Field | Rule |
|-------|------|
| `orbt_mode` | **REQUIRED.** One of: `operate`, `repair`, `build`, `troubleshoot`, `train`. Copy from Orchestrator Intake Packet. If no Orchestrator packet provided, Planner MUST NOT infer from prose — HALT and request mode from human or Orchestrator. |
| `execution_type` | Copy from Orchestrator Intake Packet. If absent, set to `"standard"`. One of: `standard`, `fleet_refit`. If provided value is not in enum: **FAIL_SCOPE**. |

## DB Routing Flags

| Field | Rule |
|-------|------|
| `db_required` | Set to `true` if user intent includes any database scope: schema changes, migrations, table modifications, drift audits. |
| `db_targets` | Required if `db_required=true`. Array of database objects targeted (table names, migration files, views). |
| `db_system` | Required if `db_required=true`. One of: `neon`, `firebase`, `bigquery`. Infer from child repo context or ask user. |

## UI Routing Flags

| Field | Rule |
|-------|------|
| `ui_required` | Set to `true` if user intent includes any UI scope: component changes, page modifications, Lovable.dev work, Figma exports. |
| `ui_surface` | Required if `ui_required=true`. One of: `local`, `lovable`, `figma`. |
| `ui_target` | Required if `ui_required=true`. Target component, page path, or artifact reference. |

## Container Routing Flags

| Field | Rule |
|-------|------|
| `container_required` | Set to `true` if work requires containerized execution. |
| `container_profile` | Required if `container_required=true`. One of: `node`, `python`, `mixed`. |
| `container_target` | Required if `container_required=true`. Repo path or service name. |

## Documentation Routing Flags

| Field | Rule |
|-------|------|
| `doc_required` | Set to `true` if user intent includes documentation scope. **Auto-set to `true` when `orbt_mode=train`.** |
| `doc_targets` | Required if `doc_required=true`. Array of documentation artifacts targeted. |
| `doc_surface` | Required if `doc_required=true`. One of: `prd`, `osam`, `erd`, `schema`, `column_registry`, `mixed`. |

## Validation Checks (All 12 Must Pass)

1. Validate against `factory/contracts/work_packet.schema.json`.
2. Verify `doctrine_version` matches current.
3. Verify exactly one of `target_repo_alias` or `target_repo_url` is present.
4. If `target_repo_alias`: verify alias exists in `repo_registry.json` and `enabled=true`.
5. If `target_repo_url`: verify `repo_pull_policy.allow_raw_url=true`.
6. Verify `target_branch` is in the registry entry's `allowed_branches`.
7. If `db_required=true`: `db_targets` and `db_system` must be present.
8. If `ui_required=true`: `ui_surface` and `ui_target` must be present.
9. If `container_required=true`: `container_profile` and `container_target` must be present.
10. If `doc_required=true`: `doc_targets` and `doc_surface` must be present.
11. If `orbt_mode=train`: `doc_required` must be `true`.
12. `allowed_paths` contains at least one path.
13. `orbt_mode` is present and valid enum.
14. If `execution_type` present: valid enum value.
