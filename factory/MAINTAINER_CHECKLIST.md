# Maintainer Checklist

**Authority**: CONSTITUTIONAL
**Purpose**: What to update when making changes to imo-creator
**Status**: MANDATORY

---

## When to Use This Checklist

Use this checklist EVERY TIME you:
- Add a new file to `templates/`
- Remove a file from `templates/`
- Rename a file in `templates/`
- Modify doctrine or prompts
- Update version numbers
- Push changes to GitHub

---

## Pre-Change Checklist

Before making changes:

| Check | Status |
|-------|--------|
| [ ] I understand what I'm changing |
| [ ] Changes align with CONSTITUTION.md |
| [ ] If modifying LOCKED files, I have ADR + human approval |

---

## Post-Change Checklist

### 1. TEMPLATES_MANIFEST.yaml (If files added/removed/renamed)

| Check | Status |
|-------|--------|
| [ ] Run: `./scripts/verify_templates_manifest.sh` |
| [ ] If mismatch: Update `templates/TEMPLATES_MANIFEST.yaml` |
| [ ] Update `total_file_count` to match actual count |
| [ ] Add new files to appropriate section |
| [ ] Remove deleted files from manifest |
| [ ] Update `last_updated` date |

### 2. templates/README.md (If structure changed)

| Check | Status |
|-------|--------|
| [ ] Update "Directory Structure" section if folders changed |
| [ ] Update file lists if files added/removed |
| [ ] Verify reading order is still accurate |

### 3. Version Numbers (If doctrine/prompts changed)

| Check | Status |
|-------|--------|
| [ ] Update version in modified file's Document Control section |
| [ ] Update `last_modified` date |
| [ ] If breaking change: Increment major version |
| [ ] If new feature: Increment minor version |
| [ ] If fix: Increment patch version |

### 4. CONSTITUTION.md (If governance changed)

| Check | Status |
|-------|--------|
| [ ] Changes reflected in CONSTITUTION.md |
| [ ] Enforcement section updated if new checks added |

### 5. Downstream Notification (If breaking changes)

| Check | Status |
|-------|--------|
| [ ] Document what child repos need to do |
| [ ] Update ADOPTION.md if adoption process changed |

---

## File Addition Protocol

When adding a NEW file to templates/:

```
1. Create the file
2. Add entry to templates/TEMPLATES_MANIFEST.yaml
   - Add to correct section (doctrine, claude, etc.)
   - Set required: true/false
   - Set locked: true if doctrine/prompt
   - Add purpose description
3. Increment total_file_count
4. Update templates/README.md directory listing
5. Run verification script
6. Commit all changes together
```

---

## File Removal Protocol

When REMOVING a file from templates/:

```
1. Remove the file
2. Remove entry from templates/TEMPLATES_MANIFEST.yaml
3. Decrement total_file_count
4. Update templates/README.md directory listing
5. Check if any other files reference this file
6. Run verification script
7. Commit all changes together
```

---

## Verification Commands

Run these before committing:

```bash
# Verify manifest matches reality
./scripts/verify_templates_manifest.sh

# Count files
find templates -type f | wc -l

# List files not in manifest (should be empty)
./scripts/verify_templates_manifest.sh --show-missing
```

---

## Common Mistakes

| Mistake | Prevention |
|---------|------------|
| Added file but not to manifest | Run verification script |
| Updated manifest but wrong count | Script auto-counts |
| Changed file but not version | Check Document Control section |
| Breaking change without notice | Review ADOPTION.md |

---

## Final Commit Checklist

Before pushing to GitHub:

| Check | Status |
|-------|--------|
| [ ] `./scripts/verify_templates_manifest.sh` passes |
| [ ] All modified files have updated versions |
| [ ] Commit message describes changes |
| [ ] No unintended files included |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-30 |
| Last Modified | 2026-01-30 |
| Version | 1.0.0 |
| Status | ACTIVE |
| Authority | CONSTITUTIONAL |
