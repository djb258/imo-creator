# RUNBOOK

**Version**: 1.0.0
**Authority**: imo-creator (CC-01 Sovereign)
**Type**: Operational guidance

---

## A) Standard Execution

**Pipeline:**

```
Orchestrator → Planner → Worker → Auditor → ORBT_CAPTURE → SANITATE → CERTIFY
```

**Artifacts produced:**

| Artifact | Path | Required |
|----------|------|----------|
| work_packet.json | `work_packets/outbox/<id>/` | Yes |
| mount_receipt.json | `changesets/outbox/<id>/` | Yes |
| changeset.json | `changesets/outbox/<id>/` | Yes |
| orbt_error.json | `changesets/outbox/<id>/` | Only on FAIL |
| sanitation_report.json | `changesets/outbox/<id>/` | Yes |
| certification.json | `.garage/` (child repo) | Yes |

**Release rule:**

All three conditions must be true:
- `certification.json` emitted
- `sanitation_passed == true`
- `audit_status == PASS`

If any condition is false, merge is blocked.

---

## B) Fleet Refit

**Mode:**
- `orbt_mode = "build"`
- `execution_type = "fleet_refit"`

**Worker behavior:**
- Runs `apply_refit_bundle()` only
- Restricted to allowed_paths: `.github/`, `changesets/`, `audit_reports/`, `.garage/`, `heir.doctrine.yaml`
- No standard lane, no DB/UI/container lanes

**Artifacts:**

| Artifact | Path | Required |
|----------|------|----------|
| refit_report.json | `changesets/outbox/refit_<operational_id>.json` | Yes |
| certification.json | `.garage/` (child repo) | Yes |

**Constraint:** No business logic mutation permitted during fleet refit.

---

## C) Repair Loop

**Trigger:** Auditor emits `FAIL_EXECUTION`, `FAIL_SCOPE`, or `A_MASTER`.

**Sequence:**

1. Orchestrator receives failure classification.
2. Orchestrator may dispatch new WORK_PACKET with:
   - `orbt_mode = "repair"`
   - `execution_type = "standard"`
3. Full pipeline repeats: Planner → Worker → Auditor → ORBT_CAPTURE → SANITATE → CERTIFY.
4. If repair attempt fails, repeat from step 2.
5. Abort if repair attempts exceed `max_repair_attempts_per_operational_id` (currently: 2).

**A_MASTER rule:** If severity is `A_MASTER`, certification is aborted unconditionally. No repair loop. Human intervention required.

---

This runbook is operational guidance only. Governance is defined in constitutional documents.
