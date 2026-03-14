# Quarterly Hygiene Audit Checklist

**Status**: TEMPLATE
**Authority**: CONSTITUTIONAL
**Version**: 1.1.0

---

## Purpose

This checklist MUST be completed for every quarterly hygiene audit.
**No audit is valid without completing this checklist.**

---

## Audit Metadata

| Field | Value |
|-------|-------|
| **Repository** | |
| **Audit Date** | |
| **Quarter** | Q1 / Q2 / Q3 / Q4 |
| **Year** | |
| **Auditor** | |

---

## Quarterly Schedule

| Quarter | Target Date | Status |
|---------|-------------|--------|
| Q1 | January 15 | |
| Q2 | April 15 | |
| Q3 | July 15 | |
| Q4 | October 15 | |

---

## COMPLIANCE GATE (MANDATORY)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                      ZERO-TOLERANCE ENFORCEMENT RULE                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  You CANNOT mark an audit as COMPLIANT if:                                    ║
║                                                                               ║
║    1. ANY CRITICAL violations exist                                           ║
║    2. ANY HIGH violations exist                                               ║
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

---

## Pre-Audit Setup

| Check | Status |
|-------|--------|
| [ ] Latest main branch pulled | |
| [ ] Database access verified (READ-ONLY) | |
| [ ] Previous audit reviewed | |
| [ ] ADRs since last audit reviewed | |

---

## 1. Schema Drift Check

| Check | Status | Notes |
|-------|--------|-------|
| [ ] Run schema verification script | | |
| [ ] Compare Neon tables to SCHEMA.md | | |
| [ ] Identify undocumented tables | | |
| [ ] Identify missing tables | | |

**Schema Drift Finding**: [ ] None / [ ] Drift detected (see notes)

---

## 2. Staleness Check

Identify governance artifacts that have drifted behind code changes.

```bash
# Manual staleness check — compare last-modified dates of governance files vs source files
# PRD staleness: PRD should be updated within 30 days of any src/ change
find src/ -name "*.py" -o -name "*.ts" -newer docs/PRD.md 2>/dev/null | head -5

# ERD staleness: SCHEMA.md should be updated within 14 days of any registry/migration change
find migrations/ -newer docs/SCHEMA.md 2>/dev/null | head -5

# Doctrine version: compare local doctrine version to imo-creator upstream
grep "version:" DOCTRINE.md 2>/dev/null
```

| Artifact | Threshold | Status | Days Stale | Notes |
|----------|-----------|--------|------------|-------|
| [ ] PRD | 30 days after src/ change | | | |
| [ ] ERD / SCHEMA.md | 14 days after registry change | | | |
| [ ] OSAM | 30 days after data layer change | | | |
| [ ] Column Registry | 7 days after SQL change | | | |
| [ ] Data Dictionary | Immediate (projection of registry) | | | |
| [ ] Doctrine Checkpoint | 7 days + src/ modified since | | | |
| [ ] Doctrine Version | Behind parent imo-creator | | | |

**Severity Guide**:

| Severity | Meaning | Gate Impact |
|----------|---------|-------------|
| CRITICAL | Column registry behind SQL schema | Blocks compliance |
| HIGH | PRD, ERD, OSAM, or doctrine version stale | Blocks compliance |
| MEDIUM | Data dictionary or checkpoint stale | Document, does not block |

**Staleness Finding**: [ ] None / [ ] CRITICAL/HIGH found (see notes) / [ ] MEDIUM only

---

## 3. IMO Compliance Check

For each hub, verify:

| Hub | IMO Structure | Spokes I/O Only | Tools in M Only | Status |
|-----|---------------|-----------------|-----------------|--------|
| | [ ] YES | [ ] YES | [ ] YES | [ ] PASS / [ ] FAIL |
| | [ ] YES | [ ] YES | [ ] YES | [ ] PASS / [ ] FAIL |
| | [ ] YES | [ ] YES | [ ] YES | [ ] PASS / [ ] FAIL |

---

## 4. CTB Compliance Check

| Check | Status |
|-------|--------|
| [ ] No forbidden folders (utils, helpers, common, shared, lib, misc) | |
| [ ] CTB branches intact (sys, data, app, ai, ui) | |
| [ ] No root-level unauthorized scripts | |

---

## 5. ERD Format Check

| Check | Status |
|-------|--------|
| [ ] All SCHEMA.md files use Mermaid erDiagram | |
| [ ] All SCHEMA.md files declare Neon authority | |
| [ ] All tables have documented purpose | |
| [ ] All FKs are documented | |

---

## 6. ADR Review

| ADR | Date | Summary | Impact |
|-----|------|---------|--------|
| | | | |
| | | | |

---

## 7. Version Assessment

| Check | Status |
|-------|--------|
| [ ] Doctrine versions current | |
| [ ] IMO_CONTROL.json up to date | |
| [ ] Version bump required? | [ ] YES / [ ] NO |

---

## Violations Found

| # | Violation | Severity | Category | Status |
|---|-----------|----------|----------|--------|
| 1 | | CRITICAL / HIGH / MEDIUM / LOW | | [ ] Fixed / [ ] Open |
| 2 | | CRITICAL / HIGH / MEDIUM / LOW | | [ ] Fixed / [ ] Open |
| 3 | | CRITICAL / HIGH / MEDIUM / LOW | | [ ] Fixed / [ ] Open |

---

## Compliance Gate Verification

| Severity | Count | Gate Status |
|----------|-------|-------------|
| CRITICAL | | [ ] 0 = PASS / [ ] >0 = BLOCKED |
| HIGH | | [ ] 0 = PASS / [ ] >0 = BLOCKED |
| MEDIUM | | [ ] Documented |
| LOW | | [ ] N/A |

**Gate Result**: [ ] PASS / [ ] BLOCKED

---

## Resolution Actions

### Immediate (Before Marking Compliant)

| Action | Owner | Status |
|--------|-------|--------|
| | | [ ] Done |
| | | [ ] Done |

### Follow-Up (Within Quarter)

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| | | | [ ] Pending |
| | | | [ ] Pending |

---

## Audit Verdict

```
[ ] COMPLIANT (CLEAN PASS)
    → 0 CRITICAL, 0 HIGH, 0 MEDIUM violations
    → All checks passed

[ ] COMPLIANT WITH NOTES
    → 0 CRITICAL, 0 HIGH violations
    → MEDIUM violations documented with owners + deadlines

[ ] NON-COMPLIANT
    → CRITICAL or HIGH violations exist
    → MUST fix before marking compliant
    → Re-audit required after remediation
```

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Auditor | | | |
| Reviewer | | | |
| Engineering Lead (if required) | | | |

---

## Next Audit

| Field | Value |
|-------|-------|
| Next Audit Date | |
| Assigned Auditor | |
| Quarter | |

---

## Traceability

| Document | Reference |
|----------|-----------|
| Constitutional Attestation | templates/audit/CONSTITUTIONAL_AUDIT_ATTESTATION.md |
| Hub Compliance | templates/checklists/HUB_COMPLIANCE.md |
| Repo Housekeeping | templates/checklists/REPO_HOUSEKEEPING.md |
| Hygiene Auditor | templates/claude/HYGIENE_AUDITOR.prompt.md |
| Architecture Doctrine | templates/doctrine/ARCHITECTURE.md |
| Registry Enforcement | templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md |

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.1.0 |
| Created | 2026-02-06 |
| Last Modified | 2026-02-25 |
| Authority | CONSTITUTIONAL |
| Status | TEMPLATE |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
| Maintained By | Human + AI (copy and execute) |
