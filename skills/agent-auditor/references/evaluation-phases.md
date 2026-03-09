# Evaluation Phases — Full Check Tables

## Phase 0: ORBT Mode Validation (Charter §6)

| Check | On Failure |
|-------|-----------|
| `WORK_PACKET.orbt_mode` is present | FAIL_SCOPE — error_code: ORBT_MODE_MISSING_OR_INVALID |
| `WORK_PACKET.orbt_mode` is one of: operate, repair, build, troubleshoot, train | FAIL_SCOPE — error_code: ORBT_MODE_MISSING_OR_INVALID |
| If `WORK_PACKET.execution_type` is present: value is one of: standard, fleet_refit | FAIL_SCOPE — error_code: INVALID_EXECUTION_TYPE |

## Phase 1: Envelope Validation

| Check | Rule | On Failure |
|-------|------|-----------|
| WORK_PACKET schema valid | Validate against sys/contracts/work_packet.schema.json | FAIL_SCOPE |
| doctrine_version current | RULE-001 | FAIL_SCOPE |
| file_target_containment | RULE-002: All modified files within allowed_paths | FAIL_SCOPE |
| no_governance_in_car | RULE-009 | FAIL_SCOPE |

## Phase 2: Compliance Validation

| Check | Rule | On Failure |
|-------|------|-----------|
| ctb_branch_compliance | RULE-006 | FAIL_SCOPE |
| forbidden_folder_absence | RULE-007 | FAIL_SCOPE |
| protected_asset_boundary | RULE-008 | FAIL_SCOPE |
| execution_type_consistency | RULE-010 | FAIL_EXECUTION |

## Phase 3b: Mount Integrity Validation

| Check | Rule | On Failure |
|-------|------|-----------|
| mount_receipt exists | RULE-013 | FAIL_EXECUTION |
| mount_receipt.detached_head === false | RULE-014 | FAIL_EXECUTION |
| mount_receipt.resolved_commit_sha === mount_receipt.remote_head_sha | RULE-014 | FAIL_EXECUTION |

## Phase 3c: Fleet Alignment — Required Surfaces

| Surface | Check | On Failure |
|---------|-------|-----------|
| `heir.doctrine.yaml` | Exists in mounted repo root | FAIL_SCOPE — no identity record |
| `.github/workflows/garage-certification-gate.yml` | Exists in mounted repo | FAIL_SCOPE — missing CI gate |
| Certification gate integrity | No `continue-on-error: true` in garage-certification-gate workflow | FAIL_SCOPE — CI gate has bypass |
| `changesets/outbox/` | Directory exists | FAIL_SCOPE — missing changeset surface |
| `audit_reports/` | Directory exists | FAIL_SCOPE — missing audit report surface |
| No governance in child | No governance artifacts in child repo (RULE-009 extended) | FAIL_SCOPE — governance leak detected |

On any alignment failure: emit FAIL_SCOPE with error_code FLEET_NOT_ALIGNED.

## Fleet Status Update (after alignment checks)

| Missing Surfaces | Status Transition |
|------------------|-------------------|
| All surfaces missing | `independent` |
| Has `heir.doctrine.yaml` + directories but missing CI gate | `partial` |
| All required surfaces present and valid | `aligned` |

## Phase 4: Acceptance Validation

| Check | Rule | On Failure |
|-------|------|-----------|
| acceptance_criteria_met | RULE-003 | FAIL_EXECUTION |
| required_artifacts_present | RULE-004 | FAIL_EXECUTION |
| schema_impact_ctb_validation | RULE-005 (when db_required=true) | FAIL_EXECUTION |

## Phase 4a: Documentation Staleness

| Check | Rule | On Failure |
|-------|------|-----------|
| PRD/OSAM freshness | AUD-009: not updated within 30 days of `src/` change | FAIL_EXECUTION |
| ERD/SCHEMA freshness | AUD-010: not updated within 14 days of schema registry change | FAIL_EXECUTION |
| OSAM data-layer freshness | AUD-011: not updated within 30 days of data layer change | FAIL_EXECUTION |
| column_registry freshness | AUD-012: not updated within 7 days of SQL change | FAIL_EXECUTION |

## Phase 5: Integrity

| Check | Rule | On Failure |
|-------|------|-----------|
| artifact_hash_integrity | RULE-011 | FAIL_EXECUTION |
| signature_valid | RULE-012 | FAIL_EXECUTION |

## Classification Rules

- If ANY BLOCKING rule fails: classify and stop.
- FAIL_SCOPE takes precedence over FAIL_EXECUTION.
- Only issue PASS when ALL phases pass.
- Do not issue advisory classifications. Every rule is binding.
- Do not downgrade a FAIL to a warning.

## Fail-Closed Lane Rules

| Condition | Classification |
|-----------|---------------|
| `db_required=true` and no DB_CHANGESET | FAIL_EXECUTION |
| `ui_required=true` and no UI_CHANGESET | FAIL_EXECUTION |
| `container_required=true` and no CONTAINER_RUN | FAIL_EXECUTION |
| `doc_required=true` and no DOC_ARTIFACT | FAIL_EXECUTION |
| V1 packet attempts DB work | FAIL_SCOPE |
| V1 packet attempts UI work | FAIL_SCOPE |
| DB_CHANGESET rollback_plan missing | FAIL_EXECUTION |
| UI_CHANGESET acceptance_checks not all PASS | FAIL_EXECUTION |
| CONTAINER_RUN exit_code non-zero | FAIL_EXECUTION |
