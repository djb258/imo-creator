# Constitution

**IMO-Creator is a governing constitution, not a framework.**

It defines invariants, gates, and authority boundaries for all derived systems.

---

## What This Constitution Governs

- **Repo structure** — CTB branches define physical placement
- **Descent order** — CC layers define authority hierarchy
- **Flow ownership** — IMO defines ingress/middle/egress within hubs
- **Hub/Spoke geometry** — Hubs own logic, spokes carry data
- **Enforcement mechanisms** — Pre-commit, CI, Claude Code, Lovable.dev

---

## What This Constitution Does NOT Govern

- Programming languages
- Frameworks or libraries
- Test strategies or coverage targets
- Logging implementations
- Deployment mechanics
- Internal folder structure within CTB branches
- Naming conventions

These are **local policy**, delegated to individual repositories.

---

## Scope Boundary

IMO-Creator governs structure and declaration only. Runtime behavior, execution history, retries, and state mutation are explicitly out of scope and must live in downstream systems.

---

## The Transformation Law (CONST → VAR)

**This is the supreme governing principle. All other invariants derive from it.**

> Nothing may exist unless it transforms declared constants into declared variables.

| Proof Type | Purpose | Authority |
|------------|---------|-----------|
| **PRD** | Explains WHY and HOW the transformation occurs | Behavioral proof |
| **ERD** | Proves WHAT structural artifacts are allowed to exist | Structural proof |
| **Process** | Executes constitutionally approved transformations | Execution declaration |

**Constitutional rule**: No hub, table, schema, or identifier may be instantiated without both proofs.

**Execution rule**: Processes do not define legitimacy. They execute transformations already approved via PRD and ERD. Tools implement processes but do not define them — tools are explicitly downstream and replaceable.

A system that cannot be summarized as *"This transforms X constants into Y variables"* is not a valid system under this constitution.

See: `templates/doctrine/PRD_CONSTITUTION.md`, `templates/doctrine/ERD_CONSTITUTION.md`, and `templates/doctrine/PROCESS_DOCTRINE.md`

**Note**: The Constitution does not adjudicate transformation uniqueness. It governs validity, not redundancy.

---

## Design Declaration Requirement (CRITICAL)

**Scope**: Global — All PRDs — Human and AI enforced
**Authority**: Constitutional
**Effect**: PRD validity gating

### The Rule

**All PRDs are INVALID unless they begin with a completed Design Declaration that precedes and informs the authoritative PRD sections.**

### What This Means

| Statement | Meaning |
|-----------|---------|
| Design Declaration is MANDATORY | Every PRD must have it |
| Design Declaration is NON-AUTHORITATIVE | It is a worksheet, not a contract |
| PRD body (§§1-15) remains the sole contract | Only the numbered sections carry authority |
| ERDs are forbidden without a valid PRD | ERD creation requires valid PRD first |
| Execution is forbidden without a valid PRD | No task execution without valid PRD |

### Design Declaration Contents

A valid Design Declaration MUST contain:

| Field | Purpose |
|-------|---------|
| Idea/Need | Problem or need that caused this hub to exist |
| Hub Justification | CONST → VAR transformation statement |
| Hub-Spoke Decision | IMPLEMENTED or DECLINED (explicit choice) |
| Candidate Constants | Draft list of invariant inputs |
| Candidate Variables | Draft list of governed outputs |
| Candidate Tools | SNAP-ON TOOLBOX references only |

### Validity Chain

```
Design Declaration (completed)
        │
        ▼ informs
PRD Body (§§1-15 restate all decisions)
        │
        ▼ gates
ERD (structural proof)
        │
        ▼ gates
Process / Execution
```

**No step may proceed without the prior step being valid.**

### AI Employee Enforcement

AI employees MUST FAIL HARD if:

| Condition | Action |
|-----------|--------|
| PRD has no Design Declaration | REJECT — PRD invalid |
| Design Declaration is incomplete | REJECT — list missing fields |
| PRD body does not restate Declaration | REJECT — authority leakage |
| ERD requested without valid PRD | REJECT — PRD must exist first |
| Execution requested without valid PRD | REJECT — no constitutional basis |

**There is no "infer missing inputs" option. Missing = Invalid.**

---

## Canonical Invariants

- **Transformation law**: Constants → Variables (requires PRD + ERD proof)
- **CTB branches**: `sys` / `data` / `app` / `ai` / `ui`
- **CC descent gates**: PRD before code, ADR before code
- **Hub owns logic**: Spokes carry data only, no logic
- **Forbidden folders**: `utils`, `helpers`, `common`, `shared`, `lib`, `misc`
- **Doctrine-first**: Structure before code, gates before artifacts

---

## Global vs Local Authority

IMO-Creator defines global invariants that all repositories must obey. Individual repositories define local policy for how they operate within those boundaries. Global invariants constrain structure; local policy determines usage.

See **ARCHITECTURE.md** for the full authority definition.

---

## Governance Direction (CRITICAL)

**Doctrine flows DOWN. Never UP.**

```
IMO-CREATOR (Parent/Sovereign)
       │
       ▼  PULL doctrine down
       │
   CHILD REPO
       │
       ▼  APPLY locally
       │
   LOCAL CONFORMANCE
```

| Action | Permitted |
|--------|-----------|
| Child pulls doctrine from parent | YES |
| Child applies doctrine locally | YES |
| Child creates local PRD/ERD/Process | YES |
| Child pushes changes to parent | **NO — FORBIDDEN** |
| Child modifies parent doctrine | **NO — FORBIDDEN** |
| Child submits ADR to parent for human review | YES (change request only) |

**Constitutional rule**: Child repositories CONFORM to imo-creator. They do not CONTRIBUTE to it. Any change to parent doctrine requires ADR submission and human approval within the parent repository.

**AI agents operating in child repos**: You may READ parent doctrine. You may APPLY it locally. You may NOT modify, propose changes to, or push commits to the parent repository. If doctrine does not fit your use case, escalate to a human — do not attempt to "fix" the parent.

---

## Structural Instantiation & Visualization

After constitutional admission, repositories may perform **structural instantiation** to declare hubs, sub-hubs, mint unique identifiers, normalize physical layout, and render a Christmas Tree diagram derived from registry data.

This phase may reorganize files but must not alter logic.

See **DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md** for the execution protocol.

---

## How Enforcement Works

| Layer | Mechanism |
|-------|-----------|
| Claude Code | `APPLY_DOCTRINE.prompt.md` — reads doctrine, audits structure, blocks violations |
| Pre-commit | `scripts/hooks/pre-commit` — validates on every commit |
| CI | `.github/workflows/doctrine-enforcement.yml` — fails PR on violations |
| UI Builder | `UI_CONTROL_CONTRACT.json` — gates UI builds on structure compliance |
| Audit | `scripts/apply_doctrine_audit.sh` — generates compliance reports |

### Audit Output Requirement (MANDATORY)

**Every constitutional audit MUST produce a `CONSTITUTIONAL_AUDIT_ATTESTATION.md` artifact.**

- Attestation template: `templates/audit/CONSTITUTIONAL_AUDIT_ATTESTATION.md`
- Location in child repos: repo root OR `docs/audit/`
- Audits without an attestation are **NON-AUTHORITATIVE**

The attestation is the SINGLE artifact a human reads to verify compliance.

---

## Violation Zero Tolerance (CRITICAL)

**If ANY violation exists, the audit FAILS. No exceptions.**

### Absolute Rules

| Rule | Enforcement |
|------|-------------|
| Any violation = FAIL | Audit cannot pass with unresolved violations |
| No "pass with warnings" for violations | Warnings are not violations; violations are not warnings |
| Violations MUST be surfaced | Hidden violations are themselves critical violations |
| Human notification REQUIRED | All violations must be reported to human before proceeding |
| No green checkmark with violations | COMPLIANT status is forbidden until ALL violations resolved |

### What Constitutes a Violation

A **violation** is any failure of:
- Part A (Constitutional Validity) checks — ALL are CRITICAL
- Part B CRITICAL checks — as marked in HUB_COMPLIANCE.md
- Remediation order — per REPO_REFACTOR_PROTOCOL.md §9
- Transformation law — CONST → VAR proof missing

A **warning** is:
- Part B HIGH or MEDIUM checks that are incomplete
- Recommendations for improvement
- Non-blocking observations

**Warnings do NOT block. Violations ALWAYS block.**

### AI Agent Prohibition

AI agents conducting audits are PROHIBITED from:

| Prohibited Action | Consequence |
|-------------------|-------------|
| Marking audit as PASSED when violations exist | CRITICAL violation — audit invalidated |
| Hiding or downgrading violations to warnings | CRITICAL violation — audit invalidated |
| Proceeding past violations without human approval | DOCTRINE violation — work invalidated |
| Issuing "COMPLIANT" status with unresolved violations | CRITICAL violation — audit invalidated |
| Using "partial pass" or "conditional pass" language | DOCTRINE violation — no such status exists |

### Required Audit Behavior

When violations are found:

```
AUDIT FAILED
────────────
Violations Found: [count]
Status: NON-COMPLIANT

Violations:
1. [violation description]
2. [violation description]

HUMAN ACTION REQUIRED:
- Review violations above
- Remediate per REPO_REFACTOR_PROTOCOL.md §9
- Re-run audit after remediation

This repository CANNOT proceed until violations are resolved.
```

**There is no "continue anyway" option for violations.**

---

## How Downstream Repos Inherit This Constitution

1. Copy `IMO_CONTROL.json` to repository root
2. Copy `UI_CONTROL_CONTRACT.json` if UI exists
3. Run `scripts/install-hooks.sh` to install pre-commit
4. Create `DOCTRINE.md` pointing to imo-creator
5. Follow CTB structure exactly
6. Define local policy within invariant boundaries
7. Produce `CONSTITUTIONAL_AUDIT_ATTESTATION.md` at repo root or `docs/audit/`
8. Declare IMO-Creator doctrine version in attestation
9. Acknowledge remediation order per `REPO_REFACTOR_PROTOCOL.md §9`

---

## Document Control

| Field | Value |
|-------|-------|
| Authority | IMO-Creator (Sovereign) |
| Status | CONSTITUTIONAL |
| First Read | Required for Claude Code |
| Full Doctrine | `templates/doctrine/` |
