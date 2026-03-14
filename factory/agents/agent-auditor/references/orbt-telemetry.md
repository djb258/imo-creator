# ORBT Telemetry — Error Emission Rules

## When to Emit

For every `FAIL_EXECUTION`, `FAIL_SCOPE`, or `A_MASTER` classification, the Auditor emits an ORBT error artifact. Never emit for PASS.

## Emission Protocol

1. Construct ORBT error artifact conforming to `factory/contracts/orbt_error.schema.json`.
2. Validate artifact against schema before writing. If schema validation fails: **FAIL_EXECUTION** — Auditor cannot emit malformed telemetry.
3. Populate fields:
   - `process_id`: from WORK_PACKET.payload.process_id (if available) or derive from work_packet_id.
   - `operational_id`: WORK_PACKET.id (the work packet identifier).
   - `orbt_mode`: read directly from `WORK_PACKET.orbt_mode`. Do NOT infer.
   - `altitude_level`: derive from CTB context if available (default: 20000 for standard hub operations).
   - `error_code`: the audit classification (FAIL_EXECUTION, FAIL_SCOPE).
   - `severity`: `FAIL` for FAIL_EXECUTION/FAIL_SCOPE. `A_MASTER` if failure affects sovereignty or doctrine integrity.
   - `failure_surface`: the specific phase and check that triggered failure (e.g., `auditor_phase_1_envelope`, `auditor_phase_3_db_lane`).
   - `timestamp`: ISO 8601 at emission time.
4. Write artifact to: `changesets/outbox/<work_packet_id>/orbt_error_<operational_id>.json`
5. Record artifact path in execution log.

## A_MASTER Severity

`A_MASTER` is reserved for failures that indicate sovereignty or doctrine compromise:
- Protected asset modification detected
- Governance artifacts found in child repo
- Doctrine version mismatch at certification level
- Signature or hash integrity failure

When severity is `A_MASTER`, the execution runner will abort certification automatically.

## Prohibitions

- Do not emit ORBT artifacts for PASS classifications.
- Do not auto-repair based on ORBT data. No blueprint registry in this phase.
- Do not modify ORBT severity after emission. Severity is final at write time.

## Fleet Alignment ORBT

On fleet alignment failure (Phase 3c):

1. Emit classification: **FAIL_SCOPE**
2. Set error_code: **FLEET_NOT_ALIGNED**
3. Emit ORBT artifact (severity=FAIL, error_code=FLEET_NOT_ALIGNED, failure_surface=auditor_phase_3c_fleet_alignment)
4. Generate deterministic REFIT WORK_PACKET payload in the execution log:

```json
{
  "orbt_mode": "build",
  "execution_type": "fleet_refit",
  "target_repo_alias": "<resolved_alias from mount_receipt>",
  "allowed_paths": [
    ".github/",
    "changesets/",
    "audit_reports/",
    ".garage/",
    "heir.doctrine.yaml"
  ]
}
```

5. Do NOT auto-run refit. Human or orchestrator must dispatch.
6. Do NOT auto-remediate. Classification is issued. Remediation is a separate execution.
