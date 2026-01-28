#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.822943
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 75%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01

# ============================================================================
# CTB (Christmas Tree Backbone) Verification Script
# Version: 1.3.3
# Date: 2025-10-23
# Purpose: Verifies CTB structure compliance with CTB Doctrine
# ============================================================================

set -e

echo "🎄 CTB Verification - Christmas Tree Backbone Structure Audit"
echo "=============================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to check if branch exists
check_branch_exists() {
    local branch_name=$1
    local altitude=$2
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if git show-ref --verify --quiet refs/heads/$branch_name; then
        echo -e "  ${GREEN}✅${NC} $branch_name ($altitude)"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "  ${RED}❌${NC} $branch_name ($altitude) - MISSING"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Define all required branches
DOCTRINE_BRANCHES=("doctrine/get-ingest")
SYS_BRANCHES=(
    "sys/composio-mcp"
    "sys/neon-vault"
    "sys/firebase-workbench"
    "sys/bigquery-warehouse"
    "sys/github-factory"
    "sys/builder-bridge"
    "sys/security-audit"
    "sys/chartdb"
    "sys/activepieces"
    "sys/windmill"
    "sys/claude-skills"
    "sys/deepwiki"
)
IMO_BRANCHES=("imo/input" "imo/middle" "imo/output")
UI_BRANCHES=("ui/figma-bolt" "ui/builder-templates")
OPS_BRANCHES=("ops/automation-scripts" "ops/report-builder")

echo "📋 Branch Structure Verification"
echo "================================="
echo ""

echo "🔥 40k Altitude - Doctrine Core"
echo "--------------------------------"
for branch in "${DOCTRINE_BRANCHES[@]}"; do
    check_branch_exists "$branch" "40k"
done
for branch in "${SYS_BRANCHES[@]}"; do
    check_branch_exists "$branch" "40k"
done
echo ""

echo "⚙️  20k Altitude - IMO Factory"
echo "--------------------------------"
for branch in "${IMO_BRANCHES[@]}"; do
    check_branch_exists "$branch" "20k"
done
echo ""

echo "🎨 10k Altitude - UI Layer"
echo "--------------------------------"
for branch in "${UI_BRANCHES[@]}"; do
    check_branch_exists "$branch" "10k"
done
echo ""

echo "🔧 5k Altitude - Operations"
echo "--------------------------------"
for branch in "${OPS_BRANCHES[@]}"; do
    check_branch_exists "$branch" "5k"
done
echo ""

# Check for required files
echo "📂 Required File Structure"
echo "================================="
echo ""

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "templates/config/ctb.branchmap.yaml" ]; then
    echo -e "  ${GREEN}✅${NC} templates/config/ctb.branchmap.yaml"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))

    # Check version
    VERSION=$(grep "version:" templates/config/ctb.branchmap.yaml | head -1 | awk '{print $2}')
    if [ "$VERSION" == "1.3.3" ]; then
        echo -e "      ${GREEN}✅${NC} Version: $VERSION (latest)"
    else
        echo -e "      ${YELLOW}⚠️${NC}  Version: $VERSION (expected 1.3.3)"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
    fi
else
    echo -e "  ${RED}❌${NC} templates/config/ctb.branchmap.yaml - MISSING"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "templates/config/global_manifest.yaml" ]; then
    echo -e "  ${GREEN}✅${NC} templates/config/global_manifest.yaml"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "  ${RED}❌${NC} templates/config/global_manifest.yaml - MISSING"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "templates/scripts/ctb_init.sh" ]; then
    echo -e "  ${GREEN}✅${NC} templates/scripts/ctb_init.sh"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "  ${RED}❌${NC} templates/scripts/ctb_init.sh - MISSING"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "CLAUDE.md" ]; then
    echo -e "  ${GREEN}✅${NC} CLAUDE.md"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "  ${YELLOW}⚠️${NC}  CLAUDE.md - Not found (recommended)"
    WARNING_CHECKS=$((WARNING_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "COMPOSIO_INTEGRATION.md" ]; then
    echo -e "  ${GREEN}✅${NC} COMPOSIO_INTEGRATION.md"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "  ${YELLOW}⚠️${NC}  COMPOSIO_INTEGRATION.md - Not found (recommended)"
    WARNING_CHECKS=$((WARNING_CHECKS + 1))
fi

echo ""

# Check for HEIR/ORBT utilities
echo "🔧 HEIR/ORBT System"
echo "================================="
echo ""

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "libs/orbt-utils/heir-generator.js" ]; then
    echo -e "  ${GREEN}✅${NC} libs/orbt-utils/heir-generator.js"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "  ${RED}❌${NC} libs/orbt-utils/heir-generator.js - MISSING"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "libs/orbt-utils/heir_generator.py" ]; then
    echo -e "  ${GREEN}✅${NC} libs/orbt-utils/heir_generator.py"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "  ${RED}❌${NC} libs/orbt-utils/heir_generator.py - MISSING"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "libs/orbt-utils/README.md" ]; then
    echo -e "  ${GREEN}✅${NC} libs/orbt-utils/README.md"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "  ${YELLOW}⚠️${NC}  libs/orbt-utils/README.md - Not found (recommended)"
    WARNING_CHECKS=$((WARNING_CHECKS + 1))
fi

echo ""

# Summary
echo "=============================================================="
echo "📊 Verification Summary"
echo "=============================================================="
echo ""
echo "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
echo ""

# Calculate compliance percentage
COMPLIANCE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo "Compliance: ${COMPLIANCE}%"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ CTB Structure is COMPLIANT${NC}"
    echo ""
    echo "🎄 Christmas Tree Backbone is properly configured!"
    echo ""
    exit 0
else
    echo -e "${RED}❌ CTB Structure has ISSUES${NC}"
    echo ""
    echo "Recommended actions:"
    echo "1. Run: ./templates/scripts/ctb_init.sh"
    echo "2. Ensure all required files exist"
    echo "3. Re-run this verification script"
    echo ""
    exit 1
fi
