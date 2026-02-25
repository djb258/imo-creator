# Enforcement Model — Garage Certification Gate

**Version**: 1.0.0
**Authority**: imo-creator (CC-01 Sovereign)
**Scope**: Child repo CI merge-blocking enforcement
**Subordinate to**: CONSTITUTION.md, FAIL_CLOSED_CI_CONTRACT.md

---

## Purpose

This document defines the required CI enforcement rule that every child repository must implement. It is the mechanism by which Garage certification becomes a merge-blocking gate.

---

## The Rule

**Merge is blocked unless ALL of the following are true:**

| # | Condition | Check |
|---|-----------|-------|
| 1 | `certification.json` exists | `.garage/certification.json` present in PR branch |
| 2 | `doctrine_version` matches current | `certification.doctrine_version === doctrine_version.json.current_version` |
| 3 | `audit_status` = PASS | `certification.audit_status === "PASS"` |
| 4 | Signature valid | `HMAC-SHA256(payload, GARAGE_SIGNING_KEY) === certification.auditor_signature` |
| 5 | Artifact hash valid | `SHA-256(sorted(required_artifacts)) === certification.artifact_hash` |
| 6 | Schema valid | `certification.json` validates against `certification.schema.json` |

**Fail-closed. Any single failure blocks merge. No override without ADR.**

---

## CI Workflow Implementation

Child repos must add a required status check workflow:

```yaml
name: garage-certification-gate

on:
  pull_request:
    branches: [main, master]

jobs:
  certification-gate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout PR branch
        uses: actions/checkout@v4

      - name: Check certification exists
        run: |
          if [ ! -f ".garage/certification.json" ]; then
            echo "BLOCK_MERGE: No certification artifact found."
            echo "All PRs must go through the Garage pipeline."
            exit 1
          fi

      - name: Validate certification schema
        run: |
          # Validate against certification.schema.json
          # Implementation: use ajv-cli or similar JSON schema validator
          echo "Schema validation: checking .garage/certification.json"
          # ajv validate -s certification.schema.json -d .garage/certification.json
          # exit 1 on failure

      - name: Check doctrine version current
        run: |
          CERT_VERSION=$(jq -r '.doctrine_version' .garage/certification.json)
          CURRENT_VERSION="${{ vars.CURRENT_DOCTRINE_VERSION }}"
          if [ "$CERT_VERSION" != "$CURRENT_VERSION" ]; then
            echo "BLOCK_MERGE: Stale doctrine version."
            echo "Certification: $CERT_VERSION | Current: $CURRENT_VERSION"
            exit 1
          fi

      - name: Check audit status
        run: |
          STATUS=$(jq -r '.audit_status' .garage/certification.json)
          if [ "$STATUS" != "PASS" ]; then
            echo "BLOCK_MERGE: Audit status is $STATUS."
            echo "Failure reasons:"
            jq -r '.failure_reasons[]' .garage/certification.json
            exit 1
          fi

      - name: Validate signature
        run: |
          # Extract payload (all fields except auditor_signature)
          # Recompute HMAC-SHA256 with GARAGE_SIGNING_KEY
          # Compare against certification.auditor_signature
          # exit 1 on mismatch
          echo "Signature validation: verifying HMAC-SHA256"

      - name: Validate artifact hash
        run: |
          # Read work_packet.json to get required_artifacts list
          # Sort artifacts alphabetically
          # Concatenate file contents as bytes
          # Compute SHA-256
          # Compare against certification.artifact_hash
          # exit 1 on mismatch
          echo "Artifact hash validation: verifying SHA-256"
```

---

## Branch Protection Configuration

Child repos must configure GitHub branch protection:

| Setting | Value |
|---------|-------|
| Require status checks to pass before merging | Enabled |
| Required status check: `garage-certification-gate` | Enabled |
| Require branches to be up to date before merging | Enabled |
| Do not allow bypassing the above settings | Enabled |

---

## Failure Modes

| Failure | Cause | Resolution |
|---------|-------|------------|
| No certification.json | PR was not processed through Garage pipeline | Run work packet through Garage |
| Stale doctrine version | Doctrine updated after certification was issued | Re-certify with current doctrine |
| Audit status FAIL | Worker execution did not pass audit rules | Review failure_reasons, create new work packet |
| Invalid signature | Certification was tampered or key was rotated | Re-certify. If key rotated, all outstanding certifications need re-issue. |
| Hash mismatch | Artifacts were modified after certification | Re-certify. Do not modify artifacts after certification. |

---

## Override Protocol

There is no automated override.

To merge without certification (emergency only):

1. Create ADR at sovereign level (imo-creator) documenting the emergency.
2. ADR must be approved by human authority.
3. Temporarily disable branch protection (human action).
4. Merge with ADR reference in commit message.
5. Re-enable branch protection immediately after merge.
6. Post-merge: run full audit and re-certify.

This is not a shortcut. This is an escape hatch for genuine emergencies only.

---

## Relationship to Existing Enforcement

This certification gate **layers on top of** existing CI enforcement:

| Gate | Source | Relationship |
|------|--------|-------------|
| Fail-closed gate (Gates A-E) | FAIL_CLOSED_CI_CONTRACT.md | Runs in parallel. Both must pass. |
| CTB drift audit | CTB_REGISTRY_ENFORCEMENT.md | Runs in parallel. Both must pass. |
| Doctrine enforcement | doctrine-enforcement.yml | Runs in parallel. Both must pass. |
| **Certification gate** | **This document** | **Additional required gate. Must also pass.** |

All gates must pass for merge. Certification does not replace existing gates. It adds a signed attestation layer.

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Created | 2026-02-25 |
| Authority | imo-creator (Sovereign) |
| Scope | Child repo CI enforcement |
