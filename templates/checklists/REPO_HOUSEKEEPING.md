# Repo Housekeeping Checklist

**Status**: TEMPLATE
**Authority**: OPERATIONAL
**Version**: 1.0.0
**Companion Checklists**: QUARTERLY_HYGIENE_AUDIT.md (governance), HUB_COMPLIANCE.md (hub readiness)

---

## Purpose

Structural housekeeping audit for repo file and folder hygiene. Run quarterly alongside the Quarterly Hygiene Audit, or after any major refactoring work (migration consolidation, archive cleanup, template sync, etc.).

This checklist answers: **"Is the repo clean, accurate, and free of debris?"**

It does NOT cover governance compliance, hub shipping readiness, or schema drift — those have their own checklists.

---

## Operating Rules

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                         AUDIT-FIRST, FIX-NEVER                               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  PHASE 1 (SCAN): READ-ONLY. Touch nothing. Grep, find, ls, diff only.       ║
║  PHASE 2 (REPORT): Present findings in tables. Classify severity.            ║
║  PHASE 3 (FIX): ONLY after human approval. Tag before starting.             ║
║                                                                               ║
║  Prohibited in Phase 1 & 2: rm, git rm, mv, git mv, any file writes         ║
║  Prohibited always: deleting anything without explicit human approval        ║
║                                                                               ║
║  When in doubt: flag as ASK OWNER, do not assume.                            ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Audit Metadata

| Field | Value |
|-------|-------|
| **Repository** | |
| **Audit Date** | |
| **Trigger** | Quarterly / Post-Refactor / Manual |
| **Auditor** | |
| **Safety Tag** | (created before Phase 3) |

---

## Severity Definitions

| Severity | Meaning | Action |
|----------|---------|--------|
| CRITICAL | Breaks CC operations or doctrine chain | Must fix before any productive work |
| HIGH | Causes CC confusion or incorrect behavior | Fix in this session |
| MEDIUM | Technical debt, noise, or cosmetic | Document, fix when convenient |
| LOW | Minor or pre-existing, not from this work | Note for awareness |
| INFO | Observation only, no action needed | Record and move on |

---

## PHASE 1: SCAN (Read-Only)

### 1. Root-Level Debris

Scan repo root for files that don't belong at the top level.

```bash
# List everything at root that isn't a known governance file, config, or directory
ls -la | grep -v "^d" | grep -v ".git" | grep -v ".env" | grep -v ".gitignore"
```

**Flag**: One-off scripts, data files, temp files, OS artifacts (.DS_Store, Thumbs.db, desktop.ini), duplicate READMEs, orphaned configs.

| File | Classification | Severity | Action |
|------|---------------|----------|--------|
| | Keep / Archive / Delete / ASK OWNER | | |

---

### 2. Scaffolding / Boilerplate Detection

Check if the repo was originally scaffolded from a different project (Lovable, CRA, Next.js, etc.) and still carries dead artifacts.

```bash
# Common scaffolding leftovers
find . -maxdepth 1 \( \
  -name "vite.config.*" -o -name "tailwind.config.*" -o \
  -name "postcss.config.*" -o -name "components.json" -o \
  -name "next.config.*" -o -name "angular.json" -o \
  -name "tsconfig.json" -o -name "webpack.config.*" -o \
  -name ".eslintrc*" -o -name "eslint.config.*" \
\) 2>/dev/null | grep -v node_modules | grep -v archive
```

```bash
# Check package.json — does it describe THIS project or a boilerplate?
cat package.json 2>/dev/null | head -5
```

```bash
# Check README.md — does it describe THIS repo accurately?
head -20 README.md
```

| File | Belongs To This Project? | Severity | Action |
|------|-------------------------|----------|--------|
| | YES / NO / PARTIAL | | |

---

### 3. Deprecated / Empty Directory Scan

Look for directories that are empty, marked deprecated, or are nested duplicates.

```bash
# Empty directories (excluding .git)
find . -type d -empty -not -path "./.git/*" -not -path "./node_modules/*"

# Directories with only __pycache__ or .gitkeep
find . -type d -not -path "./.git/*" -not -path "./node_modules/*" | while read dir; do
  count=$(ls -A "$dir" 2>/dev/null | grep -v __pycache__ | grep -v .gitkeep | wc -l)
  [ "$count" -eq 0 ] && echo "NEAR-EMPTY: $dir"
done
```

| Directory | Status | Severity | Action |
|-----------|--------|----------|--------|
| | Empty / Near-Empty / Deprecated / Duplicate | | |

---

### 4. Duplicate Structure Detection

Check for the same logical content living in multiple locations (e.g., three migration folders, two config dirs).

```bash
# Migration directories
find . -type d -name "migrations" -not -path "./archive/*" -not -path "./.git/*"

# Config directories
find . -type d \( -name "config" -o -name "configs" -o -name "global-config" \) -not -path "./archive/*"
```

| Logical Content | Locations Found | Should Be | Severity |
|----------------|----------------|-----------|----------|
| Migrations | | Single consolidated dir | |
| Config | | | |

---

### 5. Tracked File Hygiene

Check for files that shouldn't be tracked by git.

```bash
# __pycache__ tracked in git
git ls-files | grep __pycache__

# node_modules tracked in git
git ls-files | grep node_modules

# .env files tracked (should be .env.example only)
git ls-files | grep "^\.env$\|^\.env\." | grep -v example

# OS artifacts tracked
git ls-files | grep -i "thumbs.db\|desktop.ini\|\.DS_Store"

# Credential/secret files tracked
git ls-files | grep -i "credential\|secret\|\.key$\|\.pem$\|\.p12$"
```

| File | Issue | Severity | Action |
|------|-------|----------|--------|
| | Tracked but shouldn't be / Missing from .gitignore | | |

---

### 6. .gitignore Coverage

Verify .gitignore covers standard exclusions.

```bash
# Check for common patterns
for pattern in __pycache__ node_modules .env "*.pyc" ".DS_Store" Thumbs.db "*.key" "*.pem"; do
  grep -q "$pattern" .gitignore 2>/dev/null && echo "COVERED: $pattern" || echo "MISSING: $pattern"
done
```

| Pattern | Status | Severity |
|---------|--------|----------|
| | COVERED / MISSING | |

---

### 7. Reference Integrity Audit

Check that every file path referenced in governance documents actually exists.

```bash
# CLAUDE.md references
grep -oP '(?:docs|scripts|hubs|ops|spokes|src|contracts|doctrine|templates|migrations|archive|tests)/[^\s\)\"'\''`,>]+' CLAUDE.md | sort -u | while read path; do
  [ ! -e "$path" ] && echo "BROKEN: $path"
done

# DOCTRINE.md references
grep -oP '(?:docs|scripts|hubs|ops|spokes|src|contracts|doctrine|templates|migrations|archive|tests)/[^\s\)\"'\''`,>]+' DOCTRINE.md 2>/dev/null | sort -u | while read path; do
  [ ! -e "$path" ] && echo "BROKEN: $path"
done

# REGISTRY.yaml references
grep -oP '(?:contracts|hubs|spokes|src)/[^\s"]+' REGISTRY.yaml 2>/dev/null | while read path; do
  [ ! -e "$path" ] && echo "BROKEN: $path"
done
```

| Source File | Broken Reference | Severity | Action |
|-------------|-----------------|----------|--------|
| | | CRITICAL (if CLAUDE.md) / HIGH (if doctrine) / MEDIUM (if docs) | |

---

### 8. Stale Directory Reference Scan

Search all markdown, yaml, and json files for references to directories that no longer exist. Customize the grep pattern to include any directories removed in recent cleanup.

```bash
# Template — add/remove directory patterns as needed for this repo
grep -rn "PATTERN1\|PATTERN2\|PATTERN3" \
  --include="*.md" --include="*.yaml" --include="*.yml" --include="*.json" \
  . | grep -v archive/ | grep -v .git/ | grep -v node_modules/
```

| File | Line | Stale Reference | Severity | Action |
|------|------|----------------|----------|--------|
| | | | | |

---

### 9. Import Chain Audit (Python repos only)

Check for broken imports, cross-hub sovereignty violations, and banned patterns.

```bash
# All imports in active code
grep -rn "^from \|^import " hubs/ spokes/ ops/ src/ --include="*.py" | grep -v __pycache__ | sort

# Cross-hub imports (sovereignty violations)
grep -rn "from hubs\." hubs/ --include="*.py" | grep -v __pycache__

# Imports from deleted/archived modules
grep -rn "from ctb\.\|from backend\.\|from analytics\.\|from tooling\." hubs/ ops/ spokes/ src/ --include="*.py" | grep -v __pycache__
```

| File | Import | Issue | Severity | Action |
|------|--------|-------|----------|--------|
| | | Broken / Sovereignty violation / Banned pattern | | |

---

### 10. Dependency File Accuracy

Check that dependency manifests (requirements.txt, package.json) match actual usage.

```bash
# Python: packages imported but not in requirements.txt
grep -roh "^import \w\+\|^from \w\+" hubs/ ops/ spokes/ src/ --include="*.py" | \
  sed 's/^import //;s/^from //' | sort -u | while read pkg; do
  grep -q "$pkg" requirements.txt 2>/dev/null || echo "NOT IN REQUIREMENTS: $pkg"
done

# Python: packages in requirements.txt but never imported
cat requirements.txt 2>/dev/null | grep -v "^#\|^$" | sed 's/[>=<].*//' | while read pkg; do
  grep -rq "$pkg" hubs/ ops/ spokes/ src/ --include="*.py" 2>/dev/null || echo "UNUSED: $pkg"
done
```

| Package | Issue | Severity |
|---------|-------|----------|
| | Missing from manifest / In manifest but unused | |

---

### 11. README.md Accuracy

Verify README.md describes the current state of the repo.

```bash
# Every directory mentioned in README should exist
grep -oP '[\w-]+/' README.md | sort -u | while read dir; do
  [ -d "$dir" ] || echo "MISSING DIR: $dir"
done
```

| Check | Status |
|-------|--------|
| Describes correct project? | YES / NO |
| Directory listing matches reality? | YES / NO |
| Tech stack description accurate? | YES / NO |
| Setup instructions work? | YES / NO / N/A |
| No references to wrong project? | YES / NO |

---

### 12. CLAUDE.md Content Accuracy

Beyond reference integrity (check 7), verify the prose accurately describes the repo.

| Check | Status |
|-------|--------|
| REPOSITORY STRUCTURE section matches `ls -d */`? | YES / NO |
| Directory descriptions match actual contents? | YES / NO |
| Last Refactored date is current? | YES / NO |
| Migration paths reference correct consolidated location? | YES / NO |
| Enrichment stats have verification dates? | YES / NO |

---

### 13. Secrets Scan

Quick scan for accidentally committed credentials or sensitive data.

```bash
# Common secret patterns in tracked files
git ls-files | xargs grep -l -i "api_key\|api-key\|apikey\|secret_key\|secret-key\|password\|credential\|private_key\|access_token" 2>/dev/null | \
  grep -v ".md$\|.yaml$\|.yml$\|.example$\|.template$\|requirements.txt\|.gitignore"
```

**Note**: .md and .yaml hits are usually documentation references, not actual secrets. Focus on .py, .sh, .json, .env, .txt hits.

| File | Pattern Found | Actual Secret? | Severity |
|------|--------------|----------------|----------|
| | | YES / NO / ASK OWNER | CRITICAL if yes |

---

### 14. Config File Orphan Check

Verify config files reflect the actual tech stack.

| Config File | Exists? | Accurate? | Notes |
|-------------|---------|-----------|-------|
| .env.example | | Does it list vars the system actually uses? | |
| .devcontainer/ | | Does it match the current stack? | |
| .editorconfig | | Still relevant? | |
| .python-version | | Matches requirements and CI? | |
| doppler.yaml | | Still in use? | |

---

### 15. Archive Health

If archive/ exists, verify it's organized and documented.

| Check | Status |
|-------|--------|
| archive/README.md exists and is current? | YES / NO / N/A |
| No actual secrets or credentials in archive/? | YES / NO |
| Archive contents match what README describes? | YES / NO |

---

### 16. Test Alignment

Verify tests reference code that still exists.

```bash
# Test files importing from deleted/moved locations
grep -rn "^from \|^import " tests/ --include="*.py" | grep -v __pycache__ | while read line; do
  echo "$line"
done
```

| Test File | Issue | Severity |
|-----------|-------|----------|
| | Imports deleted module / Tests removed feature | |

---

### 17. GitHub Actions Triage (if .github/workflows/ exists)

Classify each workflow as ACTIVE or DEAD.

```bash
ls .github/workflows/*.yml 2>/dev/null
```

| Workflow | Status | Reason |
|----------|--------|--------|
| | ACTIVE / DEAD / UNKNOWN | |

---

### 18. Unstaged Drift

Check for uncommitted changes that have been floating.

```bash
git status --porcelain
```

| File | Status | Action |
|------|--------|--------|
| | Modified / Untracked / Deleted | Commit / Revert / ASK OWNER |

---

### 19. Schema Validation (if column_registry exists)

Verify generated code and validators are in sync with the registry.

```bash
# Run schema validator
bash scripts/validate-schema-completeness.sh 2>/dev/null
```

| Check | Status |
|-------|--------|
| Validator passes? | YES / NO |
| All leaf_types recognized by validator? | YES / NO |
| Generated types match registry? | YES / NO / N/A |

---

## PHASE 2: REPORT

After completing all Phase 1 scans, compile findings into a summary table.

### Findings Summary

| # | Check | Finding | Severity | Recommended Action |
|---|-------|---------|----------|--------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Severity Counts

| Severity | Count |
|----------|-------|
| CRITICAL | |
| HIGH | |
| MEDIUM | |
| LOW | |
| INFO | |

### Verdict

```
[ ] CLEAN — No CRITICAL or HIGH findings. Repo is structurally healthy.
[ ] NEEDS WORK — CRITICAL or HIGH findings exist. Phase 3 required.
[ ] COSMETIC ONLY — Only MEDIUM/LOW/INFO findings. Fix at convenience.
```

**Present this report to the repo owner. Do not proceed to Phase 3 without approval.**

---

## PHASE 3: FIX (Human-Approved Only)

### Pre-Fix Safety

```bash
# MANDATORY: Create safety tag before ANY changes
git tag pre-housekeeping-YYYYMMDD
git push origin pre-housekeeping-YYYYMMDD
```

| Safety Check | Status |
|--------------|--------|
| [ ] Safety tag created | |
| [ ] Human approved fix plan | |
| [ ] Each fix category gets its own commit | |

### Fix Execution

For each approved fix:
1. Make the change
2. Verify the change (re-run the relevant Phase 1 scan)
3. Commit with descriptive message
4. Move to next fix

**Do NOT batch unrelated fixes into one commit.**

### Post-Fix Verification

Re-run all Phase 1 scans that had findings. Confirm:

| Check | Pre-Fix Count | Post-Fix Count | Status |
|-------|--------------|----------------|--------|
| | | | RESOLVED / REMAINING |

---

## Traceability

| Document | Reference |
|----------|-----------|
| Quarterly Hygiene Audit | `templates/checklists/QUARTERLY_HYGIENE_AUDIT.md` |
| Hub Compliance | `templates/checklists/HUB_COMPLIANCE.md` |
| Doctrine Architecture | `templates/doctrine/ARCHITECTURE.md` |
| Template Immutability | `templates/doctrine/TEMPLATE_IMMUTABILITY.md` |
| Rollback Protocol | `templates/doctrine/ROLLBACK_PROTOCOL.md` |

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Created | 2026-02-16 |
| Last Modified | 2026-02-16 |
| Authority | OPERATIONAL |
| Status | TEMPLATE |
| Maintained By | Human + AI (copy and execute) |
