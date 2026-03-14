# Fleet Refit Subroutine

## `apply_refit_bundle(repo_path, registry_entry)`

Internal capability for fleet alignment. Only invoked when `execution_type === "fleet_refit"`.

## Behavior

1. Load bundle from `factory/runtime/fleet_refit/bundle/`.
2. Copy bundle contents into mounted repo at `repo_path`.
3. Perform placeholder substitution using values from `registry_entry`:
   - `{{doctrine_version}}` from `factory/runtime/doctrine_version.json`
   - `{{sovereign_id}}` from Garage identity (CC-01)
   - `{{hub_id}}` from `registry_entry.repo_alias`
   - `{{ctb_placement}}` from `registry_entry.ctb_placement` (or WORK_PACKET payload)
   - `{{imo_topology}}` from `registry_entry.imo_topology` (or WORK_PACKET payload)
   - `{{primary_service}}` from WORK_PACKET payload
   - `{{secrets_provider}}` from WORK_PACKET payload
   - `{{acceptance_criterion_1}}` from WORK_PACKET payload

## Guard Rails

| Rule | Enforcement |
|------|-------------|
| Existing valid `heir.doctrine.yaml` | Do NOT overwrite. Skip HEIR template. Record in refit report. |
| Business logic files | Do NOT modify. Refit touches infrastructure only. |
| Allowed paths during refit | `.github/`, `changesets/`, `audit_reports/`, `.garage/`, `heir.doctrine.yaml` |
| Non-allowed path write | **HALT. FAIL_SCOPE.** Refit must not touch business logic. |

## Output

Produce refit artifact: `changesets/outbox/refit_<operational_id>.json`

Schema: `factory/contracts/refit_report.schema.json`

Fields:
- `process_id` — execution process ID
- `operational_id` — WORK_PACKET ID
- `repo_alias` — alias of refitted repo
- `refit_applied` — boolean, true if bundle was applied
- `surfaces_created` — array of paths created
- `timestamp` — ISO 8601

`additionalProperties: false`.
