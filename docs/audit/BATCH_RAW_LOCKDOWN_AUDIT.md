# Batch-Level RAW Lockdown — Verification Audit

**Date**: 2026-02-20
**Manifest Version**: 3.1.0
**Auditor**: Claude Code (automated)

---

## 1. Template File Count

```
find templates -type f | wc -l
```

**Result**: 135
**Manifest total_file_count**: 135

**Status**: PASS

---

## 2. continue-on-error Check

```
grep -R "continue-on-error: true" .github/workflows/ --include="*.yml" (excluding archive/)
```

**Result**: 0 matches in active workflows (only detection echo strings in reusable-fail-closed-gate.yml Gate D)

**Status**: PASS

---

## 3. Manifest Integrity

- `manifest.version`: "3.1.0"
- `manifest.total_file_count`: 135
- `manifest.ctb_hardening_version`: "3.1.0"
- `document_control.version`: "3.1.0"
- Changelog v3.1.0 entry: present
- CTB_REGISTRY_ENFORCEMENT.md version in manifest: "1.3.0"

**Status**: PASS

---

## 4. New Migration Files

| File | Exists | Idempotent | SECURITY DEFINER | Doctrine Reference |
|------|--------|------------|------------------|--------------------|
| `005_raw_immutability.sql` | YES | YES (CREATE OR REPLACE, IF NOT EXISTS) | YES | §8.1, §8.2 |
| `006_raw_batch_registry.sql` | YES | YES (CREATE OR REPLACE, IF NOT EXISTS) | YES | §8.3 |
| `007_raw_active_view_template.sql` | YES | YES (CREATE OR REPLACE) | YES | §8.4 |

**Status**: PASS

---

## 5. Doctrine §8 Content

### 5a. Section exists in CTB_REGISTRY_ENFORCEMENT.md
- `## 8. Batch-Level RAW Lockdown`: present

### 5b. Sub-sections
| Sub-section | Present | Content |
|-------------|---------|---------|
| §8.1 Vendor Layer | YES | Bridge registration, required fields, REJECTED rule |
| §8.2 RAW Intake Layer | YES | INSERT-only rules, required columns, exception for ERROR |
| §8.3 RAW Batch Registry | YES | Table schema, status transitions, immutability rules |
| §8.4 RAW_ACTIVE View | YES | Template SQL, downstream-must-read rule |
| §8.5 Promotion Enforcement | YES | Full INSERT-only chain, enforcement table |

### 5c. Non-negotiables verified in doctrine
- No new leaf types: CONFIRMED (§8 uses existing STAGING, not a new type)
- No CTB cardinality changes: CONFIRMED (still 1C+1E+0-2S)
- No UPDATE/DELETE on STAGING/SUPPORTING/CANONICAL: CONFIRMED (§8.2 immutability table)
- ERROR allows UPDATE but not DELETE: CONFIRMED
- Fail closed: CONFIRMED (reject on unregistered bridges, missing triggers)

**Status**: PASS

---

## 6. Drift Audit Extension

### 6a. New drift classes in ctb-drift-audit.sh
| Class | Present | Severity | Section |
|-------|---------|----------|---------|
| `IMMUTABILITY_MISSING` | YES | VIOLATION | Drift Check 7 |
| `RAW_COLUMNS_MISSING` | YES | VIOLATION | Drift Check 8 |
| `RAW_VIEW_MISSING` | YES | WARNING | Drift Check 9 |

### 6b. Drift check logic
- Check 7: Queries `information_schema.triggers` for `trg_ctb_immutability_%` on all non-ERROR registered tables
- Check 8: Validates 5 required columns (`ingestion_batch_id`, `vendor_source`, `bridge_version`, `supersedes_batch_id`, `created_at`) on STAGING tables
- Check 9: Checks `information_schema.views` for `{table}_active` companion views on STAGING tables

**Status**: PASS

---

## 7. Enforcement Summary Diagram Updated

- §7 defense-in-depth diagram includes:
  - `RAW immutability triggers (§8)`: YES
  - `Batch registry (§8.3)`: YES
  - `Immutability drift (§8 violations)`: YES

**Status**: PASS

---

## 8. Documentation Updates

| File | Updated |
|------|---------|
| `CLAUDE.md` | v1.3.0 ref, Batch-Level RAW Lockdown section, hierarchy tree |
| `templates/TEMPLATES_MANIFEST.yaml` | v3.1.0, 135 files, 3 new migrations, changelog, sync rules |
| `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | §8 (5 sub-sections), v1.3.0, updated §7 diagram |
| `templates/scripts/ctb-drift-audit.sh` | 3 new drift classes (checks 7-9), updated report references |
| `templates/scripts/README.md` | Updated drift audit description |

**Status**: PASS

---

## 9. Sync Rules

### sync_if_missing (new entries)
- `005_raw_immutability.sql` → `migrations/005_raw_immutability.sql`: YES
- `006_raw_batch_registry.sql` → `migrations/006_raw_batch_registry.sql`: YES
- `007_raw_active_view_template.sql` → `migrations/007_raw_active_view_template.sql`: YES

### always_sync (drift audit)
- `ctb-drift-audit.sh` in always_sync: YES (already present from v3.0.2)

**Status**: PASS

---

## Summary

| Check | Result |
|-------|--------|
| 1. Template file count matches manifest | PASS (135) |
| 2. No continue-on-error in active workflows | PASS |
| 3. Manifest version and integrity | PASS (3.1.0) |
| 4. New migration files present and valid | PASS (005-007) |
| 5. Doctrine §8 complete and correct | PASS |
| 6. Drift audit extended with 3 new classes | PASS |
| 7. Enforcement summary diagram updated | PASS |
| 8. Documentation updates | PASS |
| 9. Sync rules for new files | PASS |

**Overall**: ALL CHECKS PASSED

---

## Files Changed

### New Files
- `templates/migrations/005_raw_immutability.sql`
- `templates/migrations/006_raw_batch_registry.sql`
- `templates/migrations/007_raw_active_view_template.sql`
- `docs/BATCH_RAW_LOCKDOWN_AUDIT.md` (this file)

### Modified Files
- `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` (§8, v1.3.0)
- `templates/scripts/ctb-drift-audit.sh` (drift checks 7-9)
- `templates/TEMPLATES_MANIFEST.yaml` (v3.1.0, 135 files)
- `templates/scripts/README.md` (updated drift audit description)
- `CLAUDE.md` (v1.3.0 ref, Batch-Level RAW Lockdown section)
