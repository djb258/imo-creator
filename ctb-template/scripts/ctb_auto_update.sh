#!/bin/bash
################################################################################
# CTB Auto-Update Script
#
# Purpose: Automatically sync CTB updates from IMO-Creator master repo
# Usage: Run this script in any CTB-derived repository to pull latest updates
# Location: Should be copied to scripts/ctb_auto_update.sh in child repos
#
# Version: 1.3.1
# Last Updated: 2025-10-23
################################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMO_CREATOR_REPO="https://github.com/djb258/imo-creator.git"
IMO_CREATOR_BRANCH="master"
TEMP_DIR="/tmp/ctb-update-$$"
BACKUP_DIR=".ctb-backup-$(date +%Y%m%d-%H%M%S)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🔄 CTB Auto-Update System${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Verify this is a CTB repo
echo -e "${BLUE}[1/6]${NC} Verifying CTB repository..."

if [ ! -f "ctb-template/version.json" ]; then
    echo -e "${RED}❌ ERROR: This does not appear to be a CTB repository${NC}"
    echo "   ctb-template/version.json not found"
    echo ""
    echo "   This script should only be run in CTB-derived repositories."
    exit 1
fi

CURRENT_VERSION=$(cat ctb-template/version.json | grep -o '"ctb_version"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}✅ CTB repository detected${NC}"
echo "   Current version: ${CURRENT_VERSION}"
echo ""

# Step 2: Create backup
echo -e "${BLUE}[2/6]${NC} Creating backup of current CTB structure..."

mkdir -p "$BACKUP_DIR"
cp -r ctb-template "$BACKUP_DIR/" 2>/dev/null || true
cp -r .github/workflows "$BACKUP_DIR/" 2>/dev/null || true

echo -e "${GREEN}✅ Backup created: $BACKUP_DIR${NC}"
echo ""

# Step 3: Clone IMO-Creator
echo -e "${BLUE}[3/6]${NC} Fetching latest CTB from IMO-Creator..."

if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

git clone --depth 1 --branch "$IMO_CREATOR_BRANCH" "$IMO_CREATOR_REPO" "$TEMP_DIR" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: Failed to clone IMO-Creator repository${NC}"
    exit 1
fi

NEW_VERSION=$(cat "$TEMP_DIR/ctb-template/version.json" | grep -o '"ctb_version"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}✅ IMO-Creator fetched${NC}"
echo "   Latest version: ${NEW_VERSION}"
echo ""

# Step 4: Check if update needed
if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    echo -e "${YELLOW}⚠️  Already up to date (version $CURRENT_VERSION)${NC}"
    echo ""
    rm -rf "$TEMP_DIR"
    exit 0
fi

echo -e "${YELLOW}🔄 Update available: $CURRENT_VERSION → $NEW_VERSION${NC}"
echo ""

# Step 5: Apply updates
echo -e "${BLUE}[4/6]${NC} Applying CTB updates..."

# Update core CTB structures
echo "   - Updating manual/ (System documentation)..."
if [ -d "$TEMP_DIR/ctb-template/manual" ]; then
    rm -rf ctb-template/manual
    cp -r "$TEMP_DIR/ctb-template/manual" ctb-template/
    echo -e "     ${GREEN}✓${NC} manual/ updated"
fi

echo "   - Updating drivers/ (Vendor implementations)..."
if [ -d "$TEMP_DIR/ctb-template/drivers" ]; then
    rm -rf ctb-template/drivers
    cp -r "$TEMP_DIR/ctb-template/drivers" ctb-template/
    echo -e "     ${GREEN}✓${NC} drivers/ updated"
fi

echo "   - Updating viewer-api/ (External API layer)..."
if [ -d "$TEMP_DIR/ctb-template/viewer-api" ]; then
    rm -rf ctb-template/viewer-api
    cp -r "$TEMP_DIR/ctb-template/viewer-api" ctb-template/
    echo -e "     ${GREEN}✓${NC} viewer-api/ updated"
fi

# Update workflows (with user confirmation)
echo "   - Checking workflow updates..."
if [ -d "$TEMP_DIR/ctb-template/.github/workflows" ]; then
    echo -e "${YELLOW}   ⚠️  Workflow updates available${NC}"
    echo "     Location: .github/workflows/"
    echo ""
    read -p "     Apply workflow updates? (y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mkdir -p .github/workflows
        cp -r "$TEMP_DIR/ctb-template/.github/workflows/"* .github/workflows/
        echo -e "     ${GREEN}✓${NC} workflows updated"
    else
        echo -e "     ${YELLOW}⊘${NC} workflows skipped (backup available in $BACKUP_DIR)"
    fi
fi

# Update version.json
echo "   - Updating version.json..."
cp "$TEMP_DIR/ctb-template/version.json" ctb-template/version.json
echo -e "     ${GREEN}✓${NC} version.json updated"

# Update documentation
echo "   - Updating documentation..."
if [ -d "$TEMP_DIR/docs/ctb" ]; then
    mkdir -p docs/ctb
    cp -r "$TEMP_DIR/docs/ctb/"* docs/ctb/
    echo -e "     ${GREEN}✓${NC} documentation updated"
fi

echo ""

# Step 6: EXECUTE/APPLY Updates (Actually run the new code)
echo -e "${BLUE}[5/7]${NC} Executing CTB updates..."
echo ""

# Check if package.json changed
if [ -f "package.json" ]; then
    echo "   - Checking for dependency updates..."
    if ! cmp -s "$BACKUP_DIR/package.json" "package.json" 2>/dev/null; then
        echo -e "     ${YELLOW}⚠️  package.json changed - running npm install${NC}"
        npm install > /dev/null 2>&1 && echo -e "     ${GREEN}✓${NC} dependencies installed" || echo -e "     ${RED}✗${NC} npm install failed"
    else
        echo -e "     ${GREEN}✓${NC} no dependency changes"
    fi
fi

# Execute health check script if exists
if [ -f "manual/scripts/status_check.ts" ]; then
    echo "   - Running CTB health check..."
    if command -v ts-node &> /dev/null; then
        ts-node manual/scripts/status_check.ts > /dev/null 2>&1 && echo -e "     ${GREEN}✓${NC} health check passed" || echo -e "     ${YELLOW}⚠${NC} health check warnings (see logs)"
    else
        echo -e "     ${YELLOW}⊘${NC} ts-node not found, skipping health check"
    fi
fi

# Run CTB enforcement validation
if [ -f "global-config/scripts/ctb_enforce.sh" ]; then
    echo "   - Validating CTB doctrine compliance..."
    bash global-config/scripts/ctb_enforce.sh > /dev/null 2>&1 && echo -e "     ${GREEN}✓${NC} doctrine validation passed" || echo -e "     ${YELLOW}⚠${NC} doctrine validation warnings"
fi

# Execute any post-update scripts
if [ -f "scripts/post_ctb_update.sh" ]; then
    echo "   - Running post-update script..."
    bash scripts/post_ctb_update.sh && echo -e "     ${GREEN}✓${NC} post-update script executed" || echo -e "     ${RED}✗${NC} post-update script failed"
fi

# Rebuild TypeScript if tsconfig exists
if [ -f "tsconfig.json" ]; then
    echo "   - Rebuilding TypeScript..."
    if command -v tsc &> /dev/null; then
        tsc --noEmit > /dev/null 2>&1 && echo -e "     ${GREEN}✓${NC} TypeScript compiled successfully" || echo -e "     ${YELLOW}⚠${NC} TypeScript compilation warnings"
    else
        echo -e "     ${YELLOW}⊘${NC} tsc not found, skipping compilation"
    fi
fi

# Run tests to verify updates didn't break anything
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "   - Running tests to verify updates..."
    npm test > /dev/null 2>&1 && echo -e "     ${GREEN}✓${NC} all tests passed" || echo -e "     ${RED}✗${NC} tests failed (review required)"
fi

echo ""

# Step 7: Cleanup and summary
echo -e "${BLUE}[6/7]${NC} Cleaning up..."
rm -rf "$TEMP_DIR"
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

echo -e "${BLUE}[7/7]${NC} Update Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ CTB Update Complete!${NC}"
echo ""
echo "   Previous version: ${CURRENT_VERSION}"
echo "   Current version:  ${NEW_VERSION}"
echo ""
echo "   Backup location: $BACKUP_DIR"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "   1. Review changes:"
echo "      git status"
echo ""
echo "   2. Test the updates:"
echo "      npm test"
echo ""
echo "   3. Commit the updates:"
echo "      git add -A"
echo "      git commit -m \"🔄 CTB: Update to v${NEW_VERSION}\""
echo ""
echo "   4. If issues occur, rollback:"
echo "      cp -r $BACKUP_DIR/ctb-template ./ctb-template"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
