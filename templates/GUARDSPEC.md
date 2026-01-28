# Guard Specification

**CI-Style Enforcement Rules for Template Compliance**

This document defines enforcement rules that MAY be implemented by any CI system.
It contains NO implementation code, scripts, or vendor-specific syntax.

---

## Purpose

This specification defines rules for detecting incomplete or invalid template usage in child repositories. A compliant CI system MUST enforce these rules before allowing merge to protected branches.

---

## 1. Placeholder Enforcement Rules

### 1.1 Definition of a Placeholder

A placeholder is any string matching the following patterns:

| Pattern | Description |
|---------|-------------|
| `[TEXT]` | Square brackets containing any text |
| `[TEXT_WITH_UNDERSCORES]` | Square brackets with underscored identifiers |
| `[YYYY-MM-DD]` | Date placeholders |
| `[PLACEHOLDER]` | Explicit placeholder markers |

### 1.2 Placeholder Detection Criteria

A file FAILS placeholder enforcement if:

- It contains ANY string matching `\[.+\]` (square brackets with content)
- EXCEPTION: Markdown checkbox syntax `[ ]` and `[x]` are ALLOWED
- EXCEPTION: JSON schema references `"$schema"` values are ALLOWED
- EXCEPTION: Markdown link syntax `[text](url)` is ALLOWED if `url` does not start with `[`

### 1.3 Files Subject to Placeholder Enforcement

| File Pattern | Enforcement |
|--------------|-------------|
| `IMO_CONTROL.json` | REQUIRED |
| `REGISTRY.yaml` | REQUIRED |
| `DOCTRINE.md` | REQUIRED |
| `doctrine/REPO_DOMAIN_SPEC.md` | REQUIRED |
| `*.template` files | EXEMPT (templates are allowed to have placeholders) |
| Files in `templates/` directory of parent repo | EXEMPT |

---

## 2. Required File Enforcement

### 2.1 Mandatory Files

A child repository FAILS if ANY of these files are missing:

| File | Required |
|------|----------|
| `IMO_CONTROL.json` | YES |
| `REGISTRY.yaml` | YES |
| `DOCTRINE.md` | YES |
| `README.md` | YES |
| `doctrine/REPO_DOMAIN_SPEC.md` | YES |

### 2.2 Required Directories

A child repository FAILS if the following structure is missing:

| Directory | Required |
|-----------|----------|
| `doctrine/` | YES |
| `src/` | YES (if any code exists) |

---

## 3. Forbidden Pattern Enforcement

### 3.1 Forbidden Directories

A repository FAILS if ANY of these directories exist:

| Directory Name | Violation Type |
|----------------|----------------|
| `utils/` | CTB_VIOLATION |
| `helpers/` | CTB_VIOLATION |
| `common/` | CTB_VIOLATION |
| `shared/` | CTB_VIOLATION |
| `lib/` | CTB_VIOLATION |
| `misc/` | CTB_VIOLATION |

### 3.2 Forbidden File Patterns

A repository FAILS if files exist matching:

| Pattern | Violation Type |
|---------|----------------|
| `src/*.js` (loose files in src root) | LOOSE_FILE_VIOLATION |
| `src/*.ts` (loose files in src root) | LOOSE_FILE_VIOLATION |
| `src/*.py` (loose files in src root) | LOOSE_FILE_VIOLATION |

---

## 4. Version Consistency Enforcement

### 4.1 Version Reference Check

The following version references MUST be consistent:

| Source | Target | Rule |
|--------|--------|------|
| `IMO_CONTROL.json` doctrine_files[].version | Actual doctrine file version | MUST MATCH |
| `DOCTRINE.md` version references | Parent doctrine versions | MUST NOT EXCEED parent |

### 4.2 Upstream Commit Validation

`IMO_CONTROL.json` field `control_plane.upstream_commit` MUST:
- Reference a valid commit in the parent repository
- Be updated when syncing with parent

---

## 5. PASS / FAIL Criteria

### 5.1 PASS Conditions

A repository PASSES enforcement if ALL of the following are true:

- [ ] All required files exist
- [ ] No placeholders remain in governed files
- [ ] No forbidden directories exist
- [ ] No loose files in `src/` root
- [ ] Version references are consistent
- [ ] `doctrine/REPO_DOMAIN_SPEC.md` exists and is non-empty

### 5.2 FAIL Conditions

A repository FAILS enforcement if ANY of the following are true:

- [ ] Any required file is missing
- [ ] Any placeholder remains in a governed file
- [ ] Any forbidden directory exists
- [ ] Loose files exist in `src/` root
- [ ] Version mismatch detected
- [ ] `doctrine/REPO_DOMAIN_SPEC.md` is missing or empty

---

## 6. HALT Behavior

### 6.1 On Failure

When enforcement FAILS, the CI system MUST:

1. **HALT** the pipeline
2. **REPORT** all violations with:
   - File path
   - Line number (if applicable)
   - Violation type
   - Required action
3. **BLOCK** merge to protected branches
4. **NOTIFY** the author

### 6.2 Violation Report Format

Each violation MUST be reported in this format:

```
VIOLATION DETECTED
==================
Type: [VIOLATION_TYPE]
File: [FILE_PATH]
Line: [LINE_NUMBER or N/A]
Pattern: [MATCHED_PATTERN]
Required: [WHAT_MUST_BE_DONE]
```

### 6.3 No Silent Passes

A CI system MUST NOT:
- Silently pass a failing repository
- Auto-fix violations
- Allow override without explicit human approval

---

## 7. Enforcement Scope

### 7.1 When to Enforce

| Trigger | Enforcement |
|---------|-------------|
| Pull request to protected branch | REQUIRED |
| Push to protected branch | REQUIRED |
| Scheduled audit | RECOMMENDED |
| Manual trigger | ALLOWED |

### 7.2 Protected Branches

The following branches SHOULD be protected:

| Branch | Protection Level |
|--------|-----------------|
| `main` | FULL |
| `master` | FULL |
| `release/*` | FULL |

---

## 8. Exemptions

### 8.1 Allowed Exemptions

| Exemption | Condition |
|-----------|-----------|
| Template files | Files with `.template` extension |
| Parent repository | `imo-creator` itself (contains templates) |
| Documentation files | Files in `docs/` that are not governance artifacts |

### 8.2 Disallowed Exemptions

No exemption is permitted for:
- `IMO_CONTROL.json`
- `doctrine/REPO_DOMAIN_SPEC.md`
- Forbidden directory detection

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | imo-creator |
| Type | Specification (not implementation) |
| Status | ACTIVE |
