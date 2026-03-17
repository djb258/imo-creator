# Vendor JSON + Frozen Bridge Lockdown — Verification Audit

**Date**: 2026-02-20
**Manifest Version**: 3.2.0
**Auditor**: Claude Code (automated)

---

## 1. No continue-on-error

```
grep -R "continue-on-error: true" .github/workflows/ --include="*.yml" (excluding archive/)
```

**Result**: 0 matches in active workflows (only detection echo strings in reusable-fail-closed-gate.yml Gate D)

**Status**: PASS

---

## 2. Template File Count

```
find templates -type f | wc -l
```

**Result**: 138
**Manifest total_file_count**: 138

**Status**: PASS

---

## 3. Manifest Integrity

- `manifest.version`: "3.2.0"
- `manifest.total_file_count`: 138
- `manifest.ctb_hardening_version`: "3.2.0"
- `document_control.version`: "3.2.0"
- Changelog v3.2.0 entry: present
- CTB_REGISTRY_ENFORCEMENT.md version in manifest: "1.4.0"

**Status**: PASS

---

## 4. Doctrine §9 Content

### 4a. Section exists in CTB_REGISTRY_ENFORCEMENT.md
- `## 9. Vendor JSON Intake Model (Frozen Bridge Architecture)`: present
- Document version: 1.4.0

### 4b. Sub-sections

| Sub-section | Present | Content |
|-------------|---------|---------|
| §9.1 Vendor Layer (JSON Sandbox) | YES | Required structure, rules table, naming convention |
| §9.2 Bridge Enforcement Law | YES | Requirements table, prohibitions table, version discipline |
| §9.3 RAW Layer Discipline | YES | Column rules, JSON boundary definition |
| §9.4 Downstream Access Law | YES | No JSON, no vendor references, INSERT only |

### 4c. Non-negotiables verified in doctrine
- No new leaf types: CONFIRMED (vendor tables use `STAGING`)
- No CANONICAL structure changes: CONFIRMED
- No new execution surfaces: CONFIRMED (migrations in `migrations/`)
- No continue-on-error: CONFIRMED
- Fail closed: CONFIRMED (strict mode = VIOLATION, baseline = WARNING)
- RAW/SUPPORTING/CANONICAL INSERT-only: CONFIRMED (§8.2 + §9)

**Status**: PASS

---

## 5. New Migration Files

| File | Exists | Idempotent | SECURITY DEFINER | Doctrine Reference |
|------|--------|------------|------------------|--------------------|
| `008_vendor_json_template.sql` | YES | YES | YES | §9.1 |
| `009_bridge_template.sql` | YES | YES | YES | §9.2 |
| `010_vendor_write_permissions.sql` | YES | YES | YES | §9.1, §9.2 |

### 5a. Migration 008 (Vendor JSON Template)
- Template table `vendor_claude_template`: present
- Required columns (id, ingestion_batch_id, tool_name, payload_json, created_at): present
- `payload_json` is JSONB: YES
- Validation function `ctb.validate_vendor_table()`: present
- Comments reference §9.1: YES

### 5b. Migration 009 (Bridge Template)
- Bridge function `ctb.bridge_template_v1()`: present
- `BRIDGE_VERSION CONSTANT TEXT`: present
- `BRIDGE_ID CONSTANT TEXT`: present
- Explicit JSON extraction (`payload_json->>'key'`): YES (name, email, created_at)
- Explicit casting: YES (`::TIMESTAMPTZ`)
- `RAISE EXCEPTION` on missing keys: YES
- `RAISE EXCEPTION` on type mismatch: YES
- No `jsonb_each` or `jsonb_object_keys`: CONFIRMED
- Validation function `ctb.validate_bridge_function()`: present
- Batch registry INSERT: YES

### 5c. Migration 010 (Role Separation)
- Role `ctb_vendor_writer`: present (NOLOGIN)
- Role `ctb_data_reader`: present (NOLOGIN)
- Role `ctb_bridge_executor`: present (NOLOGIN)
- Grant templates (commented, ready to customize): YES
- Deny patterns (commented, ready to customize): YES
- Validation function `ctb.validate_role_separation()`: present

**Status**: PASS

---

## 6. Drift Audit Extension

### 6a. New drift classes in ctb-drift-audit.sh

| Class | Check # | Severity (strict) | Severity (baseline) | Section |
|-------|---------|-------------------|---------------------|---------|
| `JSON_IN_RAW` | 10 | VIOLATION | WARNING | §9.3 |
| `JSON_IN_DOWNSTREAM` | 11 | VIOLATION | WARNING | §9.4 |
| `BRIDGE_NO_VERSION` | 12 | VIOLATION | WARNING | §9.2 |
| `VENDOR_REF_VIOLATION` | 13 | VIOLATION | WARNING | §9.4 |

### 6b. Check logic
- Check 10: Queries STAGING tables (excluding `vendor_claude_*`) for JSONB/JSON columns
- Check 11: Queries CANONICAL/MV/REGISTRY/ERROR tables for JSONB/JSON columns
- Check 12: Queries bridge functions in ctb schema for `BRIDGE_VERSION CONSTANT TEXT` in source
- Check 13: Queries `ctb.promotion_paths` for vendor table sources

### 6c. Mode behavior
- Strict mode: all JSON containment violations = FAIL
- Baseline mode: all JSON containment violations = WARNING

**Status**: PASS

---

## 7. Enforcement Summary Diagram Updated

- §7 defense-in-depth diagram includes:
  - `Frozen bridge functions (§9.2)`: YES
  - `Role separation (§9, migration 010)`: YES
  - `JSON containment (§9 violations)`: YES

**Status**: PASS

---

## 8. Documentation Updates

| File | Updated |
|------|---------|
| `CLAUDE.md` | v1.4.0 ref, Vendor JSON Law section, hierarchy tree |
| `templates/TEMPLATES_MANIFEST.yaml` | v3.2.0, 138 files, 3 new migrations, changelog, sync rules |
| `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | §9 (4 sub-sections), v1.4.0, updated §7 diagram |
| `templates/scripts/ctb-drift-audit.sh` | 4 new drift classes (checks 10-13), updated report references |
| `templates/scripts/README.md` | Updated drift audit description |

**Status**: PASS

---

## 9. No JSON in Template RAW/SUPPORTING/CANONICAL

The template migrations (001-007) define governance infrastructure, not data tables. The vendor template (008) is the ONLY migration that defines a JSONB column (`payload_json`). Migrations 005-007 (RAW immutability, batch registry, active views) contain no JSON columns. This is correct — JSON is contained at the vendor layer only.

**Status**: PASS

---

## Summary

| Check | Result |
|-------|--------|
| 1. No continue-on-error in active workflows | PASS |
| 2. Template file count matches manifest | PASS (138) |
| 3. Manifest version and integrity | PASS (3.2.0) |
| 4. Doctrine §9 complete and correct | PASS |
| 5. New migration files present and valid | PASS (008-010) |
| 6. Drift audit extended with 4 new classes | PASS |
| 7. Enforcement summary diagram updated | PASS |
| 8. Documentation updates | PASS |
| 9. No JSON in RAW/SUPPORTING/CANONICAL templates | PASS |

**Overall**: ALL CHECKS PASSED

---

## Files Changed

### New Files
- `templates/migrations/008_vendor_json_template.sql`
- `templates/migrations/009_bridge_template.sql`
- `templates/migrations/010_vendor_write_permissions.sql`
- `docs/VENDOR_JSON_LOCKDOWN_AUDIT.md` (this file)

### Modified Files
- `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` (§9, v1.4.0)
- `templates/scripts/ctb-drift-audit.sh` (drift checks 10-13)
- `templates/TEMPLATES_MANIFEST.yaml` (v3.2.0, 138 files)
- `templates/scripts/README.md` (updated drift audit description)
- `CLAUDE.md` (v1.4.0 ref, Vendor JSON Law section)
