# Execution Flow — Garage Control Plane

**Version**: 1.0.0
**Authority**: imo-creator (CC-01 Sovereign)
**Contract Reference**: `app/garage/orchestration_contract.json`

---

## Overview

The Garage control plane operates a 10-stage deterministic pipeline. Every code change to a child repository flows through this pipeline. No stage may be skipped. Certification is the only path to merge.

```
USER INTENT
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 1: User declares intent              │
│  Actor: Human                               │
│  Output: Natural language request            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STAGE 2: Planner generates WORK_PACKET     │
│  Actor: factory/agents/agent-planner/                │
│  Input: User request + doctrine + registry  │
│  Output: work_packets/outbox/{id}.json      │
│  Gate: Schema validation                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STAGE 3: Execution runner mounts repo      │
│  Actor: factory/runtime/execution_runner/       │
│  Input: WORK_PACKET from inbox              │
│  Output: Isolated clone with scope lock     │
│  Gate: Mount validation (5-step protocol)   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STAGE 4: DB Agent validates (conditional)  │
│  Actor: factory/agents/agent-db/                    │
│  Condition: schema_impact=true OR migrate   │
│  Input: WORK_PACKET + mounted repo + DB     │
│  Output: DB validation report               │
│  Gate: Registry-first, cardinality, RAW     │
│  On failure: Execution blocked              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STAGE 5: Builder executes                  │
│  Actor: factory/agents/agent-builder/               │
│  Input: WORK_PACKET + mounted repo          │
│  Output: Modified files + artifacts + log   │
│  Gate: Scope containment (file_targets)     │
│  On violation: HALT                         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STAGE 6: Artifact writer collects + hashes │
│  Actor: factory/runtime/artifact_writer/        │
│  Input: Builder outputs                     │
│  Output: Hashed artifact bundle             │
│  Gate: All required_artifacts present       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STAGE 7: Auditor evaluates                 │
│  Actor: factory/agents/agent-auditor/               │
│  Input: WORK_PACKET + artifacts + rules     │
│  Output: PASS | FAIL_EXECUTION | FAIL_SCOPE │
│  Gate: 12 audit rules, sequential eval      │
│  On FAIL: Pipeline stops                    │
└──────────────────┬──────────────────────────┘
                   │
              ┌────┴────┐
              │  PASS?  │
              └────┬────┘
           ┌───No──┴──Yes───┐
           │                │
           ▼                ▼
┌──────────────────┐  ┌──────────────────────────────┐
│  Return to Human │  │  STAGE 8: Signature engine    │
│  with failure    │  │  Actor: factory/certification/    │
│  reasons         │  │  Input: Audit + hash + key    │
│                  │  │  Output: certification.json   │
│  New WORK_PACKET │  │  Gate: Signing conditions     │
│  required        │  └──────────────┬───────────────┘
└──────────────────┘                 │
                                     ▼
                    ┌─────────────────────────────────┐
                    │  STAGE 9: Child repo CI validates│
                    │  Actor: garage-certification-gate│
                    │  Input: .garage/certification.json│
                    │  Output: VALID or INVALID        │
                    │  Gate: 6 validation checks       │
                    │  On INVALID: Merge blocked       │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │  STAGE 10: Human merges          │
                    │  Actor: Human                    │
                    │  Condition: Certification VALID  │
                    │             + code review OK     │
                    │  Output: Code merged             │
                    └─────────────────────────────────┘
```

---

## Stage Details

### Stage 1: User Declares Intent

The human states what they want done. This can be:
- A feature request
- A bug fix
- A refactoring task
- A schema migration
- A compliance audit

The Planner will translate this into a formal WORK_PACKET.

### Stage 2: Planner Generates WORK_PACKET

The Planner reads:
- `factory/contracts/doctrine_version.json` for current version
- `law/registry/taxonomy_registry.json` for valid classifications
- `fleet/registry/FLEET_REGISTRY.yaml` for valid target repos

The Planner outputs a WORK_PACKET V2 to `work_packets/outbox/`.

**Halt conditions**: Ambiguous intent, unknown target repo, protected asset touched.

### Stage 3: Execution Runner Mounts Repo

The execution runner:
1. Clones `target_repo` at `target_branch` into isolated workspace
2. Validates repo structure against doctrine
3. Locks file system writes to `file_targets` only
4. Hands control to the appropriate agent

**Halt conditions**: Repo fails structural validation, clone failure.

### Stage 4: DB Agent Validates (Conditional)

Invoked when `schema_impact=true` or `execution_type=migrate`.

The DB Agent checks:
- Registry-first compliance (tables registered before creation)
- Sub-hub cardinality (1 CANONICAL + 1 ERROR per sub-hub)
- RAW immutability (INSERT-only enforcement)
- Vendor JSON containment (JSON only in vendor_claude_* tables)
- Bridge versioning (version constants in bridge functions)
- Application role (NOSUPERUSER)

**Halt conditions**: Any validation failure blocks Builder execution.

### Stage 5: Builder Executes

The Builder operates within the mounted repo:
- Modifies files within `file_targets` only
- Produces all artifacts listed in `required_artifacts`
- Follows CTB topology, forbidden folder rules, protected asset boundaries

**Halt conditions**: File write outside `file_targets`, timeout.

### Stage 6: Artifact Writer Collects and Hashes

The artifact writer:
1. Collects all modified files and generated artifacts
2. Sorts `required_artifacts` alphabetically
3. Concatenates file contents as bytes
4. Computes SHA-256 hash
5. Prepares certification payload

### Stage 7: Auditor Evaluates

The Auditor evaluates 12 rules from `law/registry/audit_rules.json`:

| Phase | Rules | Failure Type |
|-------|-------|-------------|
| Envelope | RULE-001 through RULE-002, RULE-009 | FAIL_SCOPE |
| Compliance | RULE-006 through RULE-008, RULE-010 | FAIL_SCOPE or FAIL_EXECUTION |
| Acceptance | RULE-003 through RULE-005 | FAIL_EXECUTION |
| Integrity | RULE-011 through RULE-012 | FAIL_EXECUTION |

First BLOCKING failure halts evaluation.

### Stage 8: Signature Engine Issues Certification

On PASS classification:
1. Constructs canonical JSON payload (7 fields, deterministic order)
2. Signs with HMAC-SHA256 using GARAGE_SIGNING_KEY
3. Produces `certification.json`

On FAIL classification:
1. Produces FAIL certification with failure_reasons populated
2. No signature issued for FAIL certifications

### Stage 9: Child Repo CI Validates

The `garage-certification-gate` workflow runs 6 checks:
1. CERT_EXISTS — certification.json present
2. CERT_SCHEMA_VALID — validates against schema
3. DOCTRINE_VERSION_CURRENT — version not stale
4. AUDIT_STATUS_PASS — audit passed
5. SIGNATURE_VALID — HMAC-SHA256 matches
6. ARTIFACT_HASH_VALID — SHA-256 matches

All must pass. Fail-closed.

### Stage 10: Human Merges

Human reviews:
- Certification status (VALID)
- Code review (approved)
- All CI checks (green)

Human makes final merge decision. Agents execute. Humans decide.

---

## Failure Recovery

| Failure Point | Recovery Path |
|---------------|---------------|
| Planner halts | Human clarifies intent. New WORK_PACKET generated. |
| Mount fails | Target repo must be brought into structural compliance. |
| DB validation fails | Planner revises scope. Builder does not execute. |
| Builder scope violation | Builder halts. New WORK_PACKET with corrected file_targets. |
| Builder timeout | Execution terminated. New WORK_PACKET required. |
| Audit FAIL_EXECUTION | Implementation incorrect. New WORK_PACKET, Builder re-executes. |
| Audit FAIL_SCOPE | Scope violated. Planner must narrow scope. |
| Stale certification | Doctrine updated. Re-certify with current version. |
| Invalid signature | Key rotated or tampering. Re-certify. |

Every failure requires a new WORK_PACKET. No implicit retries. No automatic recovery.

---

## Invariants

1. One WORK_PACKET per pipeline run. No batching.
2. Artifacts are the only handoff between stages. No side channels.
3. Every stage is deterministic. Same inputs produce same outputs.
4. Human is sovereign at every decision point.
5. No stage may be skipped.
6. Certification is the only path to merge.
7. Failed pipelines produce no certification. Merge remains blocked.

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Created | 2026-02-25 |
| Authority | imo-creator (Sovereign) |
| Contract | app/garage/orchestration_contract.json |
