# Fleet Alignment Standard — Garage Control Plane V2

**Authority**: imo-creator (CC-01 Sovereign)
**Version**: 1.0.0
**Status**: OPERATIONAL

---

## Purpose

Defines the required and optional surfaces every child repo must have to conform to the Garage Control Plane V2. This is a structural alignment standard — not a rewrite spec. Child repos retain their application logic; only governance surfaces are standardized.

---

## Required Surfaces

Every child repo must have ALL of the following to reach `aligned` status in the fleet inventory.

### 1. Certification Gate CI

**Path**: `.github/workflows/garage-certification-gate.yml`

Must implement:
- Trigger on PR to default branch
- Read `.garage/certification.json` from PR branch
- Validate: certification exists, schema valid, doctrine version current, audit status PASS, signature valid, artifact hash valid
- Required status check — merge blocked without PASS
- No `continue-on-error: true` on any gate step

### 2. Changesets Directory

**Path**: `changesets/`

Structure:
```
changesets/
  outbox/          # Worker writes here during execution
    <work_packet_id>/
      changeset.json
      db/            # (when db_required)
      ui/            # (when ui_required)
      container/     # (when container_required)
```

Must exist even if empty. Worker targets this path for all artifact output.

### 3. Audit Reports Directory

**Path**: `audit_reports/`

Structure:
```
audit_reports/
  <work_packet_id>/
    audit_report.json
```

Auditor classification output lands here. Retained for traceability.

### 4. Garage Certification Directory

**Path**: `.garage/`

Structure:
```
.garage/
  certification.json    # Signed certification artifact
  work_packet.json      # Copy of executed WORK_PACKET
  audit_report.json     # Copy of audit classification
```

Written by artifact_writer at end of execution. Read by CI gate. Worker must NOT write to this directory.

### 5. CI Schema Validation

The certification gate must validate `.garage/certification.json` against `sys/contracts/certification.schema.json` (from imo-creator). This can be done via:
- Inline JSON schema validation in the workflow
- A shared validation action/script referenced from imo-creator

### 6. No Governance Logic Inside Repo

Per RULE-009 (`no_governance_in_car`):
- No agent definitions (planner, worker, auditor, db_agent master prompts)
- No WORK_PACKET schema files
- No audit taxonomy or doctrine registry files
- No execution contracts or runtime contracts

Governance lives in the Garage (imo-creator) only. Child repos consume governance artifacts via `.garage/` — they do not define them.

---

## Optional Surfaces

These are permitted but not required for alignment.

| Surface | Purpose |
|---------|---------|
| `scripts/local-dev.sh` | Local developer convenience scripts |
| `.env.example` | Environment variable templates (never `.env` itself) |
| `docs/` | Repo-specific documentation (not doctrine) |
| `DOCTRINE.md` | Declares conformance to imo-creator (recommended) |
| `IMO_CONTROL.json` | Machine-readable conformance metadata (recommended) |

---

## Structure Types

The fleet inventory tracks each repo's `current_structure_type`:

| Type | Definition |
|------|-----------|
| `independent` | No Garage surfaces present. Operates outside control plane. |
| `partial` | Some required surfaces present but not all. In-progress alignment. |
| `aligned` | All 6 required surfaces present and validated. Ready for Garage execution. |

### Progression

```
independent → partial → aligned
```

Repos move through this progression during fleet refit passes. There is no backward movement — once aligned, removal of required surfaces is a doctrine violation.

---

## Alignment Checklist

For each child repo, verify:

- [ ] `.github/workflows/garage-certification-gate.yml` exists and has no `continue-on-error`
- [ ] `changesets/` directory exists with `outbox/` subdirectory
- [ ] `audit_reports/` directory exists
- [ ] `.garage/` directory exists (or will be created by first execution)
- [ ] CI validates `.garage/certification.json` against schema
- [ ] No governance artifacts present in repo (RULE-009)
- [ ] `DOCTRINE.md` declares conformance to imo-creator (recommended)
- [ ] `IMO_CONTROL.json` present with `doctrine_version` field (recommended)

When all required checks pass, set `current_structure_type: "aligned"` and `status: "complete"` in `fleet_inventory.json`.

---

## Refit Process

1. Auditor evaluates child repo against this standard.
2. Missing surfaces are logged as alignment gaps.
3. Planner generates a WORK_PACKET per repo to add missing surfaces.
4. Worker executes the alignment WORK_PACKET against the mounted child repo.
5. Auditor re-evaluates. If all surfaces present → `aligned`.
6. Fleet inventory updated.

No governance logic is pushed to child repos. Only structural directories and CI workflows.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-25 |
| Authority | imo-creator (Sovereign) |
| Version | 1.0.0 |
| Related | `sys/registry/fleet_inventory.json`, `docs/ENFORCEMENT_MODEL.md`, RULE-009 |
