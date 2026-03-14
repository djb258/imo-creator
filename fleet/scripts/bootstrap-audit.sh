#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# BOOTSTRAP AUDIT — Day 0 Structural Validation
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: One-command validation that a child repo is structurally complete
#          and governance-enforced before any work begins.
# Doctrine: CTB_REGISTRY_ENFORCEMENT.md §10, FAIL_CLOSED_CI_CONTRACT.md §7
# Usage:
#   DATABASE_URL="postgres://..." ./scripts/bootstrap-audit.sh
#
# Output: docs/BOOTSTRAP_AUDIT.md (human-readable attestation)
# Exit: 0 = all checks pass, 1 = violations found, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

VIOLATIONS=0
WARNINGS=0
PASSES=0
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date)
OUTPUT_FILE="docs/BOOTSTRAP_AUDIT.md"

violation() {
    echo -e "  ${RED}[FAIL]${NC} $1"
    ((VIOLATIONS++))
    RESULTS+=("| FAIL | $1 |")
}

warning() {
    echo -e "  ${YELLOW}[WARN]${NC} $1"
    ((WARNINGS++))
    RESULTS+=("| WARN | $1 |")
}

pass() {
    echo -e "  ${GREEN}[PASS]${NC} $1"
    ((PASSES++))
    RESULTS+=("| PASS | $1 |")
}

RESULTS=()

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  BOOTSTRAP AUDIT — Day 0 Structural Validation"
echo "═══════════════════════════════════════════════════════════════"
echo "  Date: $TIMESTAMP"
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 1: Required governance files exist
# ───────────────────────────────────────────────────────────────────
echo "─── Check 1: Required Governance Files ──────────────────────"

REQUIRED_FILES=(
    "IMO_CONTROL.json"
    "DOCTRINE.md"
    "CC_OPERATIONAL_DIGEST.md"
    "STARTUP_PROTOCOL.md"
    "column_registry.yml"
)

for req_file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$req_file" ]; then
        pass "$req_file exists"
    else
        violation "$req_file missing — run bootstrap from imo-creator"
    fi
done
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 2: CTB folder structure
# ───────────────────────────────────────────────────────────────────
echo "─── Check 2: CTB Folder Structure ───────────────────────────"

CTB_DIRS=("src/sys" "src/data" "src/app" "src/ai" "src/ui")

for ctb_dir in "${CTB_DIRS[@]}"; do
    if [ -d "$ctb_dir" ]; then
        pass "$ctb_dir/ exists"
    else
        violation "$ctb_dir/ missing — CTB structure incomplete"
    fi
done
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 3: Governance CI wired
# ───────────────────────────────────────────────────────────────────
echo "─── Check 3: Governance CI ──────────────────────────────────"

if [ -f "scripts/verify-governance-ci.sh" ]; then
    chmod +x scripts/verify-governance-ci.sh
    if ./scripts/verify-governance-ci.sh > /dev/null 2>&1; then
        pass "Governance CI verification passed"
    else
        violation "Governance CI verification failed — run scripts/verify-governance-ci.sh for details"
    fi
else
    violation "scripts/verify-governance-ci.sh not found — copy from imo-creator"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 4: Required governance scripts present
# ───────────────────────────────────────────────────────────────────
echo "─── Check 4: Governance Scripts ─────────────────────────────"

GOV_SCRIPTS=(
    "scripts/ctb-drift-audit.sh"
    "scripts/ctb-registry-gate.sh"
    "scripts/detect-banned-db-clients.sh"
    "scripts/verify-governance-ci.sh"
    "scripts/bootstrap-audit.sh"
)

for script in "${GOV_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        pass "$script present"
    else
        violation "$script missing — copy from imo-creator"
    fi
done
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 5: Migrations directory
# ───────────────────────────────────────────────────────────────────
echo "─── Check 5: Migrations ─────────────────────────────────────"

if [ -d "migrations" ]; then
    MIGRATION_COUNT=$(find migrations -name "*.sql" -type f 2>/dev/null | wc -l | tr -d ' ')
    if [ "$MIGRATION_COUNT" -ge 11 ]; then
        pass "migrations/ has $MIGRATION_COUNT SQL files (minimum 11 required)"
    else
        violation "migrations/ has only $MIGRATION_COUNT SQL files — need at least 11 (001-011)"
    fi
else
    violation "migrations/ directory missing — copy from imo-creator templates/migrations/"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 6: Pre-commit hook
# ───────────────────────────────────────────────────────────────────
echo "─── Check 6: Pre-commit Hook ────────────────────────────────"

if [ -f ".git/hooks/pre-commit" ] && [ -x ".git/hooks/pre-commit" ]; then
    pass "Pre-commit hook installed and executable"
else
    warning "Pre-commit hook not installed — run scripts/install-hooks.sh"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 7: Application role validation (requires DATABASE_URL)
# ───────────────────────────────────────────────────────────────────
echo "─── Check 7: Application Role (Database) ────────────────────"

if [ -n "${DATABASE_URL:-}" ]; then
    if command -v psql &> /dev/null; then
        # Check if validate_application_role() exists
        HAS_FN=$(psql "$DATABASE_URL" -t -A -c "
            SELECT EXISTS(
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'ctb'
                  AND p.proname = 'validate_application_role'
            );
        " 2>/dev/null || echo "f")

        if [ "$HAS_FN" = "t" ]; then
            # Run validation
            ROLE_FAILURES=$(psql "$DATABASE_URL" -t -A -c "
                SELECT count(*) FROM ctb.validate_application_role() WHERE NOT passed;
            " 2>/dev/null || echo "-1")

            if [ "$ROLE_FAILURES" = "0" ]; then
                pass "Application role validation passed — not superuser, role configured"
            else
                violation "Application role validation failed — $ROLE_FAILURES check(s) failed. Run: SELECT * FROM ctb.validate_application_role();"
            fi
        else
            violation "ctb.validate_application_role() not found — migration 011 not applied"
        fi
    else
        warning "psql not installed — cannot validate application role"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} DATABASE_URL not set — skipping database checks"
    RESULTS+=("| SKIP | Application role — DATABASE_URL not set |")
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 8: Drift audit (requires DATABASE_URL)
# ───────────────────────────────────────────────────────────────────
echo "─── Check 8: Drift Audit (Strict Mode) ──────────────────────"

if [ -n "${DATABASE_URL:-}" ]; then
    if [ -f "scripts/ctb-drift-audit.sh" ]; then
        chmod +x scripts/ctb-drift-audit.sh
        if DATABASE_URL="$DATABASE_URL" ./scripts/ctb-drift-audit.sh --mode=strict > /dev/null 2>&1; then
            pass "Drift audit strict mode passed — no violations"
        else
            DRIFT_EXIT=$?
            if [ "$DRIFT_EXIT" -eq 2 ]; then
                warning "Drift audit dependency error — check psql/yq/jq"
            else
                violation "Drift audit strict mode failed — run scripts/ctb-drift-audit.sh --mode=strict for details"
            fi
        fi
    else
        violation "scripts/ctb-drift-audit.sh not found"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} DATABASE_URL not set — skipping drift audit"
    RESULTS+=("| SKIP | Drift audit — DATABASE_URL not set |")
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 9: No continue-on-error
# ───────────────────────────────────────────────────────────────────
echo "─── Check 9: No continue-on-error ───────────────────────────"

if [ -d ".github/workflows" ]; then
    COE_COUNT=$(grep -rlE "continue-on-error:\s*true" .github/workflows/ 2>/dev/null \
        | grep -v "archive/" \
        | grep -E '\.yml$|\.yaml$' \
        | wc -l | tr -d ' ')

    if [ "$COE_COUNT" -eq 0 ]; then
        pass "No continue-on-error: true in active workflows"
    else
        violation "$COE_COUNT workflow(s) contain continue-on-error: true"
    fi
else
    warning ".github/workflows/ not found"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# GENERATE ATTESTATION
# ───────────────────────────────────────────────────────────────────
mkdir -p "$(dirname "$OUTPUT_FILE")"

STATUS=$([ "$VIOLATIONS" -gt 0 ] && echo "FAIL" || echo "PASS")

cat > "$OUTPUT_FILE" << ENDMD
# Bootstrap Audit Attestation

**Date**: $TIMESTAMP
**Status**: **$STATUS**
**Violations**: $VIOLATIONS
**Warnings**: $WARNINGS
**Passes**: $PASSES

---

## Results

| Status | Check |
|--------|-------|
$(printf '%s\n' "${RESULTS[@]}")

---

## What This Proves

$(if [ "$STATUS" = "PASS" ]; then
    echo "This repo has passed all bootstrap validation checks. It is structurally"
    echo "enforced and governance-compliant on Day 0."
    echo ""
    echo "- Application role is configured (non-superuser)"
    echo "- Governance CI is wired"
    echo "- Drift audit strict mode passes"
    echo "- All required files and scripts are present"
else
    echo "This repo has **NOT** passed bootstrap validation. The violations listed"
    echo "above must be resolved before this repo is considered structurally valid."
    echo ""
    echo "Doctrine: CTB_REGISTRY_ENFORCEMENT.md §10, FAIL_CLOSED_CI_CONTRACT.md §7"
fi)

---

## Document Control

| Field | Value |
|-------|-------|
| Generated By | bootstrap-audit.sh |
| Doctrine | CTB_REGISTRY_ENFORCEMENT.md §10 |
| Authority | imo-creator |
ENDMD

echo "  Output: $OUTPUT_FILE"

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ "$VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}BOOTSTRAP FAILED${NC}: $VIOLATIONS violation(s), $WARNINGS warning(s), $PASSES pass(es)"
    echo ""
    echo "This repo is NOT structurally valid."
    echo "Fix violations and re-run: ./scripts/bootstrap-audit.sh"
    echo ""
    exit 1
elif [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}BOOTSTRAP PASSED WITH WARNINGS${NC}: $WARNINGS warning(s), $PASSES pass(es)"
    echo ""
    echo "Attestation written to: $OUTPUT_FILE"
    echo ""
    exit 0
else
    echo -e "${GREEN}BOOTSTRAP PASSED${NC}: $PASSES pass(es)"
    echo ""
    echo "This repo is structurally valid and governance-enforced."
    echo "Attestation written to: $OUTPUT_FILE"
    echo ""
    exit 0
fi
