#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# VERIFY GOVERNANCE CI — Child Repo CI Adoption Enforcement
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Verify that a child repo has wired governance CI correctly.
#          Fails if required workflows are missing, not referenced,
#          or if continue-on-error is present on enforcement jobs.
# Doctrine: FAIL_CLOSED_CI_CONTRACT.md §7, CTB_REGISTRY_ENFORCEMENT.md §10
# Usage:
#   ./scripts/verify-governance-ci.sh
#
# Exit: 0 = all checks pass, 1 = violations found
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

VIOLATIONS=0
WARNINGS=0
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date)

violation() {
    echo -e "  ${RED}[VIOLATION]${NC} $1"
    ((VIOLATIONS++))
}

warning() {
    echo -e "  ${YELLOW}[WARNING]${NC} $1"
    ((WARNINGS++))
}

pass() {
    echo -e "  ${GREEN}[PASS]${NC} $1"
}

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  GOVERNANCE CI VERIFICATION"
echo "═══════════════════════════════════════════════════════════════"
echo "  Date: $TIMESTAMP"
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 1: .github/workflows/ directory exists
# ───────────────────────────────────────────────────────────────────
echo "─── Check 1: Workflow Directory ─────────────────────────────"

if [ ! -d ".github/workflows" ]; then
    violation "MISSING_WORKFLOWS_DIR: .github/workflows/ does not exist — no CI governance possible"
    echo ""
    echo -e "${RED}FAILED${NC}: Cannot continue without .github/workflows/"
    exit 1
fi
pass ".github/workflows/ directory exists"
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 2: Required reusable workflow references
# Child repos MUST reference these imo-creator reusable workflows.
# ───────────────────────────────────────────────────────────────────
echo "─── Check 2: Required Workflow References ───────────────────"

REQUIRED_REFS=(
    "reusable-fail-closed-gate.yml"
)

for ref in "${REQUIRED_REFS[@]}"; do
    FOUND=$(grep -rl "$ref" .github/workflows/ 2>/dev/null | grep -v "archive/" | head -1 || true)
    if [ -n "$FOUND" ]; then
        pass "Reference to $ref found in $FOUND"
    else
        violation "MISSING_GOVERNANCE_REF: No workflow references $ref — fail-closed gate not wired"
    fi
done
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 3: continue-on-error detection
# No active workflow should have continue-on-error: true
# ───────────────────────────────────────────────────────────────────
echo "─── Check 3: continue-on-error Detection ────────────────────"

COE_FILES=$(grep -rlE "continue-on-error:\s*true" .github/workflows/ 2>/dev/null \
    | grep -v "archive/" \
    | grep -E '\.yml$|\.yaml$' || true)

if [ -n "$COE_FILES" ]; then
    while IFS= read -r coe_file; do
        [ -z "$coe_file" ] && continue
        violation "CONTINUE_ON_ERROR: $coe_file contains continue-on-error: true"
    done <<< "$COE_FILES"
else
    pass "No continue-on-error: true in active workflows"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 4: Enforcement workflow present (not just referenced)
# At least one workflow file should call the fail-closed gate
# ───────────────────────────────────────────────────────────────────
echo "─── Check 4: Enforcement Workflow Exists ────────────────────"

ENFORCEMENT_WF=$(grep -rl "reusable-fail-closed-gate" .github/workflows/ 2>/dev/null \
    | grep -v "archive/" \
    | grep -E '\.yml$|\.yaml$' || true)

if [ -n "$ENFORCEMENT_WF" ]; then
    while IFS= read -r ewf; do
        [ -z "$ewf" ] && continue
        pass "Enforcement workflow: $ewf"
    done <<< "$ENFORCEMENT_WF"
else
    violation "MISSING_ENFORCEMENT_WF: No workflow file calls reusable-fail-closed-gate — CI governance not active"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 5: Required scripts present
# ───────────────────────────────────────────────────────────────────
echo "─── Check 5: Required Governance Scripts ────────────────────"

REQUIRED_SCRIPTS=(
    "scripts/ctb-drift-audit.sh"
    "scripts/ctb-registry-gate.sh"
    "scripts/detect-banned-db-clients.sh"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        pass "$script exists"
    else
        violation "MISSING_SCRIPT: $script not found — governance enforcement incomplete"
    fi
done
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 6: Pre-commit hook installed
# ───────────────────────────────────────────────────────────────────
echo "─── Check 6: Pre-commit Hook ────────────────────────────────"

if [ -f ".git/hooks/pre-commit" ]; then
    if [ -x ".git/hooks/pre-commit" ]; then
        pass "Pre-commit hook installed and executable"
    else
        warning "Pre-commit hook exists but is not executable"
    fi
else
    warning "Pre-commit hook not installed — run scripts/install-hooks.sh"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# GENERATE REPORT
# ───────────────────────────────────────────────────────────────────
REPORT_FILE=".governance-ci-report.json"
STATUS=$([ "$VIOLATIONS" -gt 0 ] && echo "FAIL" || echo "PASS")

cat > "$REPORT_FILE" << ENDJSON
{
  "timestamp": "$TIMESTAMP",
  "status": "$STATUS",
  "violations": $VIOLATIONS,
  "warnings": $WARNINGS,
  "checks": {
    "workflows_dir": true,
    "required_refs": $([ "$VIOLATIONS" -eq 0 ] && echo "true" || echo "false"),
    "no_continue_on_error": $([ -z "$COE_FILES" ] && echo "true" || echo "false"),
    "enforcement_workflow": $([ -n "${ENFORCEMENT_WF:-}" ] && echo "true" || echo "false")
  },
  "doctrine": "FAIL_CLOSED_CI_CONTRACT.md §7, CTB_REGISTRY_ENFORCEMENT.md §10"
}
ENDJSON

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════"

if [ "$VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}FAILED${NC}: $VIOLATIONS violation(s), $WARNINGS warning(s)"
    echo ""
    echo "This repo does not meet governance CI requirements."
    echo "Doctrine: FAIL_CLOSED_CI_CONTRACT.md §7"
    echo ""
    exit 1
elif [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}PASSED WITH WARNINGS${NC}: $WARNINGS warning(s)"
    echo ""
    exit 0
else
    echo -e "${GREEN}PASSED${NC}: All governance CI checks passed"
    echo ""
    exit 0
fi
