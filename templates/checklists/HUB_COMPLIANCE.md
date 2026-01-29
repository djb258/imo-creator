# Hub Compliance Checklist

This checklist must be completed before any hub can ship.
No exceptions. No partial compliance.

**This is NOT a one-time audit.** Compliance is continuous — revalidate after every change.

**This checklist MUST be referenced by an attestation document.**
See: `templates/audit/CONSTITUTIONAL_AUDIT_ATTESTATION.md`

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-02 |
| **Last Validated** | |
| **Validated By** | |

---

## Priority Definitions

| Priority | Meaning | Ship Without? |
|----------|---------|---------------|
| **CRITICAL** | Blocks ship | NO — must be checked |
| **HIGH** | Strongly recommended | Only with ADR exception |
| **MEDIUM** | Nice to have | Yes, but document why |

---

# PART A — CONSTITUTIONAL VALIDITY

These sections verify the hub satisfies the Transformation Law.
Failure in Part A invalidates the hub regardless of Part B status.

**Section Anchors**: §A.1 through §A.6

---

## Constitutional Validity (CONST → VAR) {#section-a1}
<!-- §A.1 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Hub purpose can be stated as a CONST → VAR transformation |
| CRITICAL | [ ] All constants are explicitly declared and bounded |
| CRITICAL | [ ] All variables are explicitly declared and necessary |
| CRITICAL | [ ] Hub exists because of value transformation, not convenience |

**Validity Test**: Complete this statement:

> "This hub transforms _________________ (constants) into _________________ (variables)."

If this statement cannot be completed, the hub is invalid.

---

## PRD Compliance (Behavioral Proof) {#section-a2}
<!-- §A.2 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] PRD exists for this hub |
| CRITICAL | [ ] PRD explains WHY the hub exists |
| CRITICAL | [ ] PRD explains HOW transformation occurs |
| CRITICAL | [ ] PRD declares constants (inputs) |
| CRITICAL | [ ] PRD declares variables (outputs) |
| CRITICAL | [ ] PRD declares pass structure (CAPTURE / COMPUTE / GOVERN) |
| HIGH | [ ] PRD explicitly states what is IN scope |
| HIGH | [ ] PRD explicitly states what is OUT of scope |

**PRD must remain accurate as behavior changes.**

| Field | Value |
|-------|-------|
| PRD Location | |
| PRD Version | |

---

## ERD Compliance (Structural Proof) {#section-a3}
<!-- §A.3 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] ERD exists for this hub |
| CRITICAL | [ ] All tables represent declared variables |
| CRITICAL | [ ] All tables depend on declared constants |
| CRITICAL | [ ] Each table has a producing pass (CAPTURE / COMPUTE / GOVERN) |
| CRITICAL | [ ] Lineage to constants is enforced |
| CRITICAL | [ ] No orphan tables (not referenced in PRD) |
| HIGH | [ ] No speculative tables (for future use) |
| HIGH | [ ] No convenience tables (not serving transformation) |

| Field | Value |
|-------|-------|
| ERD Location | |
| ERD Version | |

---

## ERD Pressure Test (Static) {#section-a4}
<!-- §A.4 -->

For **each table**, all four questions must pass:

| # | Question | Failure Condition |
|---|----------|-------------------|
| Q1 | What constant(s) does this table depend on? | No constant = ILLEGAL |
| Q2 | What variable does this table represent? | No variable = ILLEGAL |
| Q3 | Which pass produced this table? | No pass = ILLEGAL |
| Q4 | How is lineage enforced? | No mechanism = ILLEGAL |

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All tables pass Q1 (constant dependency explicit) |
| CRITICAL | [ ] All tables pass Q2 (variable output explicit) |
| CRITICAL | [ ] All tables pass Q3 (pass ownership declared) |
| CRITICAL | [ ] All tables pass Q4 (lineage mechanism defined) |

**Partial pass = FAIL. Failure on any table invalidates the hub.**

---

## ERD Upstream Flow Test (Simulated) {#section-a5}
<!-- §A.5 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Flow testing begins at declared constants (never at tables) |
| CRITICAL | [ ] Declared passes traversed sequentially (CAPTURE → COMPUTE → GOVERN) |
| CRITICAL | [ ] Data can reach all declared variables |
| CRITICAL | [ ] Lineage survives end-to-end |
| CRITICAL | [ ] No unreachable tables exist |

**Flow tests must be re-evaluated after any ERD change.**

---

## Process Compliance (Execution Declaration) {#section-a6}
<!-- §A.6 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Process declaration exists |
| CRITICAL | [ ] Process references governing PRD |
| CRITICAL | [ ] Process references governing ERD |
| CRITICAL | [ ] Process introduces no new constants |
| CRITICAL | [ ] Process introduces no new variables |
| CRITICAL | [ ] Pass sequence matches PRD and ERD |
| HIGH | [ ] Process is tool-agnostic (remains valid if tools change) |

| Field | Value |
|-------|-------|
| Process Location | |
| Governing PRD | |
| Governing ERD | |

---

# PART B — OPERATIONAL COMPLIANCE

These sections verify the hub is ready to ship.
Part B assumes Part A passes.

**Part B governs ship-readiness, not existence legitimacy.**
Items marked CRITICAL define minimum operational safety, not architectural purity.

**Section Anchors**: §B.1 through §B.11

---

## Canonical Chain (CC) Compliance {#section-b1}
<!-- §B.1 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Sovereign declared (CC-01 reference) |
| CRITICAL | [ ] Hub ID assigned (unique, immutable) (CC-02) |
| CRITICAL | [ ] Authorization matrix honored (no upward writes) |
| CRITICAL | [ ] Doctrine version declared |
| HIGH | [ ] All child contexts scoped to CC-03 |
| HIGH | [ ] All processes scoped to CC-04 |

---

## Hub Identity (CC-02) {#section-b2}
<!-- §B.2 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Hub ID assigned (unique, immutable) |
| CRITICAL | [ ] Process ID pattern defined (CC-04 execution scope) |
| HIGH | [ ] Hub Name defined |
| HIGH | [ ] Hub Owner assigned |

---

## CTB Placement {#section-b3}
<!-- §B.3 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] CTB path defined (Trunk / Branch / Leaf) |
| CRITICAL | [ ] No forbidden folders (utils, helpers, common, shared, lib, misc) |
| HIGH | [ ] Branch level specified (sys / ui / ai / data / app) |
| MEDIUM | [ ] Parent hub identified (if nested hub) |

---

## IMO Structure {#section-b4}
<!-- §B.4 -->

### Ingress (I Layer)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Ingress contains no logic |
| CRITICAL | [ ] Ingress contains no state |
| HIGH | [ ] Ingress points defined |
| MEDIUM | [ ] UI (if present) is dumb ingress only |

### Middle (M Layer)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All logic resides in M layer |
| CRITICAL | [ ] All state resides in M layer |
| CRITICAL | [ ] All decisions occur in M layer |
| CRITICAL | [ ] Tools scoped to M layer only |

### Egress (O Layer)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Egress contains no logic |
| CRITICAL | [ ] Egress contains no state |
| HIGH | [ ] Egress points defined |

---

## Spokes {#section-b5}
<!-- §B.5 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All spokes typed as I or O only |
| CRITICAL | [ ] No spoke contains logic |
| CRITICAL | [ ] No spoke contains state |
| CRITICAL | [ ] No spoke owns tools |
| CRITICAL | [ ] No spoke performs decisions |

---

## Tools {#section-b6}
<!-- §B.6 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All tools scoped inside this hub or accessed via approved platform boundary |
| CRITICAL | [ ] No tools exposed to spokes |
| HIGH | [ ] All tools have Doctrine ID |
| HIGH | [ ] All tools have ADR reference |

---

## Cross-Hub Isolation {#section-b7}
<!-- §B.7 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] No sideways hub-to-hub calls |
| CRITICAL | [ ] No cross-hub logic |
| CRITICAL | [ ] No shared mutable state between hubs |

---

## Guard Rails {#section-b8}
<!-- §B.8 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Rate limits defined |
| CRITICAL | [ ] Timeouts defined |
| HIGH | [ ] Validation implemented |
| HIGH | [ ] Permissions enforced |

---

## Kill Switch {#section-b9}
<!-- §B.9 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Kill switch endpoint defined |
| CRITICAL | [ ] Kill switch activation criteria documented |
| HIGH | [ ] Kill switch tested and verified |
| HIGH | [ ] Emergency contact assigned |

---

## Rollback {#section-b10}
<!-- §B.10 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Rollback plan documented |
| HIGH | [ ] Rollback tested and verified |

---

## Observability {#section-b11}
<!-- §B.11 -->

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Logging implemented |
| HIGH | [ ] Metrics implemented |
| HIGH | [ ] Alerts configured |
| CRITICAL | [ ] Shipping without observability is forbidden |

---

## Failure Modes

| Priority | Check |
|----------|-------|
| HIGH | [ ] Failure modes documented |
| HIGH | [ ] Severity levels assigned |
| MEDIUM | [ ] Remediation steps defined |

---

## Human Override

| Priority | Check |
|----------|-------|
| HIGH | [ ] Override conditions defined |
| HIGH | [ ] Override approvers assigned |

---

## Traceability

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] PRD exists and is current (CC-02) |
| CRITICAL | [ ] ADR exists for each decision (CC-03) |
| HIGH | [ ] Work item linked |
| HIGH | [ ] PR linked (CC-04) |
| HIGH | [ ] Canonical Doctrine referenced |

---

## CC Layer Verification

| Priority | Layer | Check |
|----------|-------|-------|
| CRITICAL | CC-01 (Sovereign) | [ ] Reference declared |
| CRITICAL | CC-02 (Hub) | [ ] Identity, PRD, CTB complete |
| HIGH | CC-03 (Context) | [ ] ADRs, spokes, guard rails defined |
| HIGH | CC-04 (Process) | [ ] PIDs, code, tests implemented |

---

## Continuous Validity

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] This checklist has been revalidated after the most recent change |
| CRITICAL | [ ] All Part A sections pass (constitutional validity) |
| CRITICAL | [ ] All Part B CRITICAL items pass (operational compliance) |
| HIGH | [ ] Drift requires redesign, not patching |

**Compliance is continuous, not event-based.**

---

## Compliance Summary

**Before shipping, count your checks:**

| Part | Section | CRITICAL Items | Your Count |
|------|---------|----------------|------------|
| A | Constitutional Validity | 4 | ___ / 4 |
| A | PRD Compliance | 8 | ___ / 8 |
| A | ERD Compliance | 6 | ___ / 6 |
| A | Pressure Test | 4 | ___ / 4 |
| A | Upstream Flow Test | 5 | ___ / 5 |
| A | Process Compliance | 6 | ___ / 6 |
| B | All Operational Sections | varies | ___ / ___ |

| Priority | Must Have | Your Count |
|----------|-----------|------------|
| CRITICAL | ALL checked | ___ / ___ |
| HIGH | Most checked (ADR for exceptions) | ___ / ___ |
| MEDIUM | Optional | ___ / ___ |

**If any CRITICAL item is unchecked, this hub may not ship.**

---

## Final Declaration

> **This hub remains valid only while all checklist items pass.**
> **Any change that causes failure invalidates the hub until corrected.**

---

## Traceability Reference

| Artifact | Reference |
|----------|-----------|
| Constitution | CONSTITUTION.md |
| PRD Constitution | templates/doctrine/PRD_CONSTITUTION.md |
| ERD Constitution | templates/doctrine/ERD_CONSTITUTION.md |
| Process Doctrine | templates/doctrine/PROCESS_DOCTRINE.md |
| ERD Doctrine | templates/doctrine/ERD_DOCTRINE.md |
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| Hub/Spoke Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md §3 |
