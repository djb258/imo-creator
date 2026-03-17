#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# STRUCTURE ENFORCEMENT GATE
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: BAR-135 / law/STRUCTURE_MANIFEST.yaml
# Purpose: Fail-closed enforcement of repo directory structure
# Usage: ./scripts/structure-enforce.sh [repo_root]
# Exit: 0 = PASS, 1 = FAIL
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

REPO_ROOT="${1:-.}"
cd "$REPO_ROOT"

FAIL=0
WARN=0

echo "═══════════════════════════════════════════════════════════════"
echo "  STRUCTURE ENFORCEMENT GATE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ─────────────────────────────────────────────────────────────────
# GATE 1: Banned directories MUST NOT exist
# ─────────────────────────────────────────────────────────────────
echo "--- Gate 1: Banned directory check ---"

BANNED_DIRS="templates sys skills app commands audit_reports changesets work_packets ai"
for dir in $BANNED_DIRS; do
  if [ -d "$dir" ]; then
    echo "FAIL: Banned directory exists: $dir/"
    echo "  This directory was removed in BAR-135. Use law/factory/fleet/ structure."
    FAIL=$((FAIL + 1))
  fi
done

if [ $FAIL -eq 0 ]; then
  echo "PASS: No banned directories found"
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# GATE 2: Root-level file check
# ─────────────────────────────────────────────────────────────────
echo "--- Gate 2: Root-level file check ---"

ALLOWED_ROOT="CLAUDE.md CONSTITUTION.md OPERATOR_PROFILE.md README.md LICENSE .gitignore"
GATE2_FAIL=0

for f in $(find . -maxdepth 1 -type f -not -name '.*' | sed 's|^\./||' | sort); do
  FOUND=0
  for allowed in $ALLOWED_ROOT; do
    if [ "$f" = "$allowed" ]; then
      FOUND=1
      break
    fi
  done
  if [ $FOUND -eq 0 ]; then
    echo "FAIL: Unauthorized file at repo root: $f"
    GATE2_FAIL=$((GATE2_FAIL + 1))
    FAIL=$((FAIL + 1))
  fi
done

if [ $GATE2_FAIL -eq 0 ]; then
  echo "PASS: All root files are authorized"
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# GATE 3: Top-level directory check
# ─────────────────────────────────────────────────────────────────
echo "--- Gate 3: Top-level directory check ---"

ALLOWED_DIRS="law factory fleet docs scripts dashboard archive .git .github .claude .wrangler .playwright-mcp"
GATE3_FAIL=0

for d in $(find . -maxdepth 1 -type d -not -name '.' | sed 's|^\./||' | sort); do
  FOUND=0
  for allowed in $ALLOWED_DIRS; do
    if [ "$d" = "$allowed" ]; then
      FOUND=1
      break
    fi
  done
  if [ $FOUND -eq 0 ]; then
    echo "FAIL: Unauthorized directory at repo root: $d/"
    GATE3_FAIL=$((GATE3_FAIL + 1))
    FAIL=$((FAIL + 1))
  fi
done

if [ $GATE3_FAIL -eq 0 ]; then
  echo "PASS: All top-level directories are authorized"
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# GATE 4: Stale path reference scan
# ─────────────────────────────────────────────────────────────────
echo "--- Gate 4: Stale path reference scan ---"

STALE_PATTERNS='templates/doctrine/|templates/integrations/|templates/semantic/|templates/scripts/|templates/prd/|templates/adr/|templates/checklists/|templates/pr/|templates/claude/|templates/config/|templates/child/|templates/migrations/|templates/modules/|templates/SNAP_ON_TOOLBOX|sys/contracts/|sys/registry/|sys/runtime/|sys/certification/|skills/agent-|skills/skill-creator/|skills/SKILLS_SYSTEM|docs/constitutional/|docs/OPERATOR_PROFILE|docs/LAYER0_DOCTRINE'

# Build list of files with stale refs, then filter out false positives
RAW_HITS=$(grep -rlE "$STALE_PATTERNS" \
  --include="*.md" --include="*.json" --include="*.yaml" --include="*.yml" \
  --include="*.sh" --include="*.ps1" --include="*.ts" --include="*.js" \
  . 2>/dev/null \
  | grep -v '.git/' \
  | grep -v 'archive/' \
  | grep -v 'docs/adr/' \
  | grep -v 'docs/audit/' \
  | grep -v 'factory/runtime/inbox/' \
  | grep -v 'factory/runtime/outbox/' \
  | grep -v 'factory/agents/skill-creator/SKILL.md' \
  | grep -v '.claude/' \
  | grep -v 'dashboard/' \
  | grep -v 'node_modules/' \
  | grep -v 'law/STRUCTURE_MANIFEST.yaml' \
  | grep -v 'scripts/structure-enforce.sh' \
  | grep -v 'fleet/scripts/ctb_scaffold_new_repo.sh' \
  | grep -v 'fleet/TEMPLATES_MANIFEST.yaml' \
  || true)

# Second pass: exclude files where ALL matches are archive/ references or changelog entries
STALE_FILES=""
for hit in $RAW_HITS; do
  # Check if any match is NOT an archive/ reference or changelog historical entry
  REAL_STALE=$(grep -nE "$STALE_PATTERNS" "$hit" 2>/dev/null \
    | grep -v 'archive/templates/' \
    | grep -v 'archive/agents' \
    | grep -v '^[[:space:]]*- "' \
    || true)
  if [ -n "$REAL_STALE" ]; then
    STALE_FILES="$STALE_FILES
$hit"
  fi
done
STALE_FILES=$(echo "$STALE_FILES" | sed '/^$/d')

if [ -n "$STALE_FILES" ]; then
  STALE_COUNT=$(echo "$STALE_FILES" | wc -l)
  echo "FAIL: $STALE_COUNT file(s) contain stale path references:"
  echo "$STALE_FILES" | while read -r f; do
    echo "  $f"
  done
  FAIL=$((FAIL + STALE_COUNT))
else
  echo "PASS: No stale path references found"
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# GATE 5: Required structural files exist
# ─────────────────────────────────────────────────────────────────
echo "--- Gate 5: Required structural files ---"

REQUIRED_FILES="CLAUDE.md CONSTITUTION.md OPERATOR_PROFILE.md README.md LICENSE law/heir.yaml law/orbt.yaml law/STRUCTURE_MANIFEST.yaml law/SNAP_ON_TOOLBOX.yaml law/doctrine/TIER0_DOCTRINE.md law/doctrine/ARCHITECTURE.md factory/SKILLS_SYSTEM.md factory/agents/skill-creator/SKILL.md fleet/registry/FLEET_REGISTRY.yaml"
GATE5_FAIL=0

for f in $REQUIRED_FILES; do
  if [ ! -f "$f" ]; then
    echo "FAIL: Required file missing: $f"
    GATE5_FAIL=$((GATE5_FAIL + 1))
    FAIL=$((FAIL + 1))
  fi
done

if [ $GATE5_FAIL -eq 0 ]; then
  echo "PASS: All required structural files present"
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════"
if [ $FAIL -gt 0 ]; then
  echo "  STRUCTURE ENFORCEMENT: FAIL ($FAIL violation(s))"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "Fix all violations before merging."
  echo "Reference: law/STRUCTURE_MANIFEST.yaml"
  exit 1
else
  echo "  STRUCTURE ENFORCEMENT: PASS"
  echo "═══════════════════════════════════════════════════════════════"
  exit 0
fi
