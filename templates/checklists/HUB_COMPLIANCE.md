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
| **HIGH** | Blocks compliance | NO — must fix or downgrade with ADR |
| **MEDIUM** | Nice to have | Yes, but document why |
| **LOW** | Optional | Yes |

---

## COMPLIANCE GATE (MANDATORY)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                      ZERO-TOLERANCE ENFORCEMENT RULE                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  You CANNOT mark a hub as COMPLIANT if:                                       ║
║                                                                               ║
║    1. ANY CRITICAL items are unchecked                                        ║
║    2. ANY HIGH violations exist (unfixed)                                     ║
║                                                                               ║
║  HIGH violations are NOT "fix later" items.                                   ║
║  HIGH violations BLOCK compliance.                                            ║
║                                                                               ║
║  The ONLY path forward is:                                                    ║
║    → FIX the violation, OR                                                    ║
║    → DOWNGRADE to MEDIUM with documented justification + ADR                  ║
║                                                                               ║
║  NEVER mark COMPLIANT with open HIGH/CRITICAL violations.                     ║
║  This is a HARD RULE. No exceptions.                                          ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Common Mistake (DO NOT DO THIS)

```
❌ WRONG: "5 HIGH violations found. Status: COMPLIANT"
   This is INVALID. HIGH violations block compliance.

✅ RIGHT: "5 HIGH violations found. Status: NON-COMPLIANT"
   Then fix the violations and re-audit.

✅ RIGHT: "0 HIGH/CRITICAL violations. 3 MEDIUM. Status: COMPLIANT WITH NOTES"
   Medium violations are documented but don't block.
```

**Constitutional Authority**: See CONSTITUTION.md §Violation Zero Tolerance

---

### AI Agent Compliance Rule (MANDATORY)

**AI agents filling out this checklist are bound by CONSTITUTION.md §Violation Zero Tolerance.**

| Prohibited Action | Consequence |
|-------------------|-------------|
| Marking COMPLIANT when CRITICAL items are unchecked | AUDIT INVALIDATED |
| Marking COMPLIANT when HIGH violations exist (unfixed) | AUDIT INVALIDATED |
| Downgrading violations to skip the gate | DOCTRINE VIOLATION |
| Using "partial pass" or "conditional compliance" | NO SUCH STATUS EXISTS |
| Proceeding past violations without human approval | WORK INVALIDATED |

**Required behavior when violations exist:**

```
CHECKLIST FAILED
────────────────
Hub: [HUB-ID]
Status: NON-COMPLIANT

CRITICAL unchecked: [count]
HIGH violations: [count]

Violations:
1. §[section] — [description]
2. §[section] — [description]

HUMAN ACTION REQUIRED:
- Review violations above
- Fix violations OR downgrade with ADR justification
- Re-run checklist after remediation

This hub CANNOT ship until violations are resolved.
```

**There is no "continue anyway" option. AI agents must STOP and report.**

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

### HSS — Hub-and-Spoke Set Up (MANDATORY)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] HSS section exists at top of PRD |
| CRITICAL | [ ] Idea/Need field is completed |
| CRITICAL | [ ] Hub Justification (CONST → VAR) is completed |
| CRITICAL | [ ] Hub-Spoke Decision is explicitly IMPLEMENTED or DECLINED |
| CRITICAL | [ ] Candidate Constants are listed |
| CRITICAL | [ ] Candidate Variables are listed |
| CRITICAL | [ ] Candidate Tools reference SNAP-ON TOOLBOX only |

**PRD without completed HSS section = INVALID**

### HSS Validator (HARD FAIL)

```
IF PRD exists AND HSS section missing → FAIL
IF PRD exists AND HSS section incomplete → FAIL

There is no "PRD exists, skip HSS" path.
This validator has no exceptions.
```

### PRD Body (Authoritative)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] PRD exists for this hub |
| CRITICAL | [ ] PRD explains WHY the hub exists |
| CRITICAL | [ ] PRD explains HOW transformation occurs |
| CRITICAL | [ ] PRD declares constants (inputs) |
| CRITICAL | [ ] PRD declares variables (outputs) |
| CRITICAL | [ ] PRD declares pass structure (CAPTURE / COMPUTE / GOVERN) |
| CRITICAL | [ ] PRD §6 Hub-Spoke Status matches HSS section |
| CRITICAL | [ ] PRD §§1-15 restate all HSS decisions (no deferrals) |
| HIGH | [ ] PRD explicitly states what is IN scope |
| HIGH | [ ] PRD explicitly states what is OUT of scope |

**PRD must remain accurate as behavior changes.**

| Field | Value |
|-------|-------|
| PRD Location | |
| PRD Version | |
| Governing ERD | |

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
| CRITICAL | [ ] ERD aligns with OSAM (all joins declared) |
| HIGH | [ ] No speculative tables (for future use) |
| HIGH | [ ] No convenience tables (not serving transformation) |

| Field | Value |
|-------|-------|
| ERD Location | |
| ERD Version | |
| Governing OSAM | |

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

## OSAM Compliance (Semantic Access Map) {#section-a6}
<!-- §A.6 -->

**OSAM is the authoritative query-routing contract. Violations are BLOCKING.**

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] OSAM exists for this hub (`doctrine/OSAM.md`) |
| CRITICAL | [ ] OSAM declares universal join key |
| CRITICAL | [ ] OSAM declares spine table |
| CRITICAL | [ ] All ERD joins are declared in OSAM |
| CRITICAL | [ ] No queries target SOURCE tables |
| CRITICAL | [ ] No queries target ENRICHMENT tables as primary query surface |
| CRITICAL | [ ] PRD questions are routable via OSAM |
| HIGH | [ ] All tables classified (QUERY/SOURCE/ENRICHMENT/AUDIT) |
| HIGH | [ ] Query routing table is complete |

### OSAM Alignment Verification

| Check | Result |
|-------|--------|
| ERD joins in OSAM | ______ / ______ aligned |
| Undeclared joins | ______ (must be 0) |
| SOURCE table queries | ______ (must be 0) |
| Unroutable PRD questions | ______ (must be 0) |

### OSAM Violation Detection

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                         OSAM VIOLATIONS ARE BLOCKING                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  IF OSAM is missing                        → FAIL (constitutional violation)  ║
║  IF ERD contains joins not in OSAM         → FAIL (alignment violation)       ║
║  IF PRD requires unanswered questions      → FAIL (routing violation)         ║
║  IF agent references undocumented paths    → FAIL (agent violation)           ║
║  IF queries touch SOURCE/ENRICHMENT tables → FAIL (surface violation)         ║
║                                                                               ║
║  OSAM violations BLOCK compliance. There are no warnings.                     ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

| Field | Value |
|-------|-------|
| OSAM Location | |
| OSAM Version | |

---

## Process Compliance (Execution Declaration) {#section-a7}
<!-- §A.7 -->

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

**Section Anchors**: §B.1 through §B.12

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
| HIGH | [ ] CTB Governance document exists (`docs/CTB_GOVERNANCE.md`) |
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

## Documentation Alignment (MANDATORY) {#section-b12}
<!-- §B.12 -->

**MD files are AI instructions. Stale documentation causes AI agents to operate on bad information.**

### Core Documentation Files

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] CLAUDE.md exists and references correct doctrine |
| CRITICAL | [ ] CLAUDE.md locked files list is accurate for this repo |
| CRITICAL | [ ] README.md folder structure matches actual structure |
| CRITICAL | [ ] PRD constants/variables match actual implementation |
| HIGH | [ ] DOCTRINE.md points to correct imo-creator version |
| HIGH | [ ] REGISTRY.yaml hub ID is consistent across all files |
| HIGH | [ ] All ADRs reference correct file paths |

### Path and Reference Accuracy

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] No MD files reference moved or deleted files |
| CRITICAL | [ ] No MD files reference old folder structure |
| HIGH | [ ] All doctrine template references are valid |
| HIGH | [ ] All internal links between MD files work |

### Post-Refactor Verification

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All MD files reviewed after structure changes |
| CRITICAL | [ ] Hub identity consistent across CLAUDE.md, README.md, REGISTRY.yaml |
| HIGH | [ ] No stale examples or code snippets in docs |

### ERD Metrics Verification (MANDATORY)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    METRICS LIVE IN ERD_METRICS.yaml, NOT MD FILES             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  MD files are ARCHITECTURE (CONST) — structure, rules, relationships.        ║
║  ERD_METRICS.yaml is DATA (VAR) — counts, statistics, runtime state.         ║
║                                                                               ║
║  DO NOT put record counts in MD files.                                        ║
║  DO put record counts in erd/ERD_METRICS.yaml.                                ║
║                                                                               ║
║  Before work sessions, sync ERD_METRICS.yaml from database.                   ║
║  This ensures decisions are based on CURRENT data.                            ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] erd/ERD_METRICS.yaml exists (created from template) |
| CRITICAL | [ ] ERD_METRICS.yaml has been synced this session |
| CRITICAL | [ ] sync.last_updated is within stale_after_hours threshold |
| HIGH | [ ] All tables from ERD.md are represented in ERD_METRICS.yaml |
| HIGH | [ ] Queries section documents how to refresh each metric |

**Metrics Sync Verification Output (REQUIRED):**

```
ERD METRICS STATUS
──────────────────
File: erd/ERD_METRICS.yaml
Last Synced: [timestamp]
Stale Threshold: [hours]
Status: [CURRENT / STALE]

Key Metrics:
  [table_name]: [count] records
  [table_name]: [count] records
  [aggregate_name]: [value]

Alerts: [count]
```

**If ERD_METRICS.yaml is missing or stale, sync before proceeding.**

**Documentation drift is a violation. If structure changed, docs MUST be updated.**
**Metrics are NOT in MD files. Metrics are in ERD_METRICS.yaml.**

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
| A | ERD Compliance | 7 | ___ / 7 |
| A | Pressure Test | 4 | ___ / 4 |
| A | Upstream Flow Test | 5 | ___ / 5 |
| A | **OSAM Compliance** | 7 | ___ / 7 |
| A | Process Compliance | 6 | ___ / 6 |
| B | All Operational Sections | varies | ___ / ___ |

| Priority | Must Have | Your Count |
|----------|-----------|------------|
| CRITICAL | ALL checked | ___ / ___ |
| HIGH | Most checked (ADR for exceptions) | ___ / ___ |
| MEDIUM | Optional | ___ / ___ |

**If any CRITICAL item is unchecked, this hub may not ship.**
**If any HIGH violation exists, this hub is NON-COMPLIANT.**

---

## Compliance Gate Verification (MANDATORY — CANNOT BE SKIPPED)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           ZERO-TOLERANCE GATE                                 ║
║                                                                               ║
║  YOU MUST FILL OUT THIS SECTION. SKIPPING IS A DOCTRINE VIOLATION.           ║
║                                                                               ║
║  Per CONSTITUTION.md §Violation Zero Tolerance:                               ║
║  • Any violation = FAIL                                                       ║
║  • No green checkmark with violations                                         ║
║  • AI agents CANNOT mark COMPLIANT with unresolved violations                 ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Step 1: Count Your Violations (MANDATORY)

| Violation Type | Count | Enter Number |
|----------------|-------|--------------|
| CRITICAL items unchecked | Must be 0 | ______ |
| HIGH violations unfixed | Must be 0 | ______ |

### Step 2: Gate Decision (MANDATORY)

```
IF CRITICAL unchecked > 0  →  STOP. Status = NON-COMPLIANT. No exceptions.
IF HIGH violations > 0     →  STOP. Status = NON-COMPLIANT. No exceptions.
IF BOTH = 0                →  MAY proceed to mark COMPLIANT.
```

### Step 3: Declare Status (MANDATORY)

**Select ONE. This is your final declaration.**

| Condition | Status | Select |
|-----------|--------|--------|
| CRITICAL > 0 OR HIGH > 0 | **NON-COMPLIANT** | [ ] ← ONLY valid option if violations exist |
| CRITICAL = 0 AND HIGH = 0, MEDIUM items exist | **COMPLIANT WITH NOTES** | [ ] |
| CRITICAL = 0 AND HIGH = 0, no MEDIUM items | **COMPLIANT** | [ ] |

### Step 4: AI Agent Acknowledgment (MANDATORY FOR AI AGENTS)

If you are an AI agent filling out this checklist, you MUST complete this acknowledgment:

```
I, [AI AGENT NAME], acknowledge that:

[ ] I have read CONSTITUTION.md §Violation Zero Tolerance
[ ] I understand that ANY violation = FAIL
[ ] I have counted violations above truthfully
[ ] I have NOT marked COMPLIANT if violations exist
[ ] I understand that falsifying this checklist INVALIDATES the audit

CRITICAL count declared above: ______
HIGH count declared above: ______
Status selected above: ______________________

If CRITICAL > 0 or HIGH > 0 and I selected COMPLIANT, this audit is INVALID.
```

**AI agents who skip this acknowledgment or falsify counts have violated doctrine.**

---

## Final Declaration

> **This hub remains valid only while all checklist items pass.**
> **Any change that causes failure invalidates the hub until corrected.**
> **HIGH violations BLOCK compliance — they are NOT "fix later" items.**
>
> **ZERO TOLERANCE: If you declared violations above and marked COMPLIANT, this audit is VOID.**

---

## CTB Hardening Migration Verification (v2.0.0) {#section-migration}
<!-- §MIGRATION -->

**Added 2026-02-06**: This section verifies compliance with CTB Hardening v2.0.0

| Priority | Check |
|----------|-------|
| HIGH | [ ] DOCTRINE.md references ARCHITECTURE.md (not old files) |
| HIGH | [ ] CLAUDE.md locked files table references ARCHITECTURE.md |
| HIGH | [ ] No MD files reference old section numbers (e.g., "CANONICAL §3") |
| MEDIUM | [ ] Reading order documentation references ARCHITECTURE.md |
| MEDIUM | [ ] Any PRD/ADR traceability sections updated |

**Section Reference Mapping:**

| Old Reference | New Reference |
|---------------|---------------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | ARCHITECTURE.md |
| CANONICAL §1 (CTB) | ARCHITECTURE.md Part II |
| CANONICAL §2 (CC) | ARCHITECTURE.md Part III |
| CANONICAL §3 (Hub-Spoke) | ARCHITECTURE.md Part IV |
| CANONICAL §3.5 (IMO) | ARCHITECTURE.md Part V |
| HUB_SPOKE_ARCHITECTURE.md | ARCHITECTURE.md Part IV |
| ALTITUDE_DESCENT_MODEL.md | ARCHITECTURE.md Part VI |

**Note**: Old files exist as REDIRECTs for backward compatibility. Migration recommended within 30 days.

---

## Traceability Reference

| Artifact | Reference |
|----------|-----------|
| Constitution | CONSTITUTION.md |
| **Architecture Doctrine** | templates/doctrine/ARCHITECTURE.md |
| CTB Topology | ARCHITECTURE.md Part II |
| CC Hierarchy | ARCHITECTURE.md Part III |
| Hub/Spoke Geometry | ARCHITECTURE.md Part IV |
| IMO Flow | ARCHITECTURE.md Part V |
| Descent Gates | ARCHITECTURE.md Part VI |
| PRD Constitution | templates/doctrine/PRD_CONSTITUTION.md |
| ERD Constitution | templates/doctrine/ERD_CONSTITUTION.md |
| Process Doctrine | templates/doctrine/PROCESS_DOCTRINE.md |
| ERD Doctrine | templates/doctrine/ERD_DOCTRINE.md |
| **OSAM (Semantic Access Map)** | templates/semantic/OSAM.md |

**Note**: CANONICAL_ARCHITECTURE_DOCTRINE.md, HUB_SPOKE_ARCHITECTURE.md, and ALTITUDE_DESCENT_MODEL.md are now redirects to ARCHITECTURE.md.
