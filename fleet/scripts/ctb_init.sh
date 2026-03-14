#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.808183
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 75%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01

# ============================================================================
# CTB (Christmas Tree Backbone) Initialization Script
# Version: 1.3.3
# Date: 2025-10-23
# Purpose: Creates all CTB branches required by CTB Doctrine
# ============================================================================

set -e

echo "🎄 CTB Initialization - Creating Christmas Tree Backbone Structure"
echo "=================================================================="
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Define all required branches from the doctrine
DOCTRINE_BRANCHES=(
    "doctrine/get-ingest"
)

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

IMO_BRANCHES=(
    "imo/input"
    "imo/middle"
    "imo/output"
)

UI_BRANCHES=(
    "ui/figma-bolt"
    "ui/builder-templates"
)

OPS_BRANCHES=(
    "ops/automation-scripts"
    "ops/report-builder"
)

# Combine all branches
ALL_BRANCHES=("${DOCTRINE_BRANCHES[@]}" "${SYS_BRANCHES[@]}" "${IMO_BRANCHES[@]}" "${UI_BRANCHES[@]}" "${OPS_BRANCHES[@]}")

echo "📋 Will create ${#ALL_BRANCHES[@]} CTB branches"
echo ""

# Function to create branch if it doesn't exist
create_branch_if_needed() {
    local branch_name=$1
    local altitude=$2

    # Check if branch exists locally
    if git show-ref --verify --quiet refs/heads/$branch_name; then
        echo "  ✅ $branch_name (exists locally)"
    # Check if branch exists remotely
    elif git ls-remote --heads origin $branch_name | grep -q $branch_name; then
        echo "  🔽 $branch_name (exists remotely, fetching...)"
        git checkout -b $branch_name origin/$branch_name
        git checkout $CURRENT_BRANCH
    else
        echo "  ✨ $branch_name (creating...)"
        git checkout -b $branch_name

        # Create a .gitkeep file to ensure branch is not empty
        mkdir -p ".ctb/$altitude"
        echo "# CTB Branch: $branch_name" > ".ctb/$altitude/$branch_name.md"
        echo "" >> ".ctb/$altitude/$branch_name.md"
        echo "**Altitude**: $altitude" >> ".ctb/$altitude/$branch_name.md"
        echo "**Branch**: \`$branch_name\`" >> ".ctb/$altitude/$branch_name.md"
        echo "**Created**: $(date -u +"%Y-%m-%d")" >> ".ctb/$altitude/$branch_name.md"
        echo "" >> ".ctb/$altitude/$branch_name.md"
        echo "This branch is part of the CTB Doctrine (Christmas Tree Backbone) structure." >> ".ctb/$altitude/$branch_name.md"

        git add ".ctb/$altitude/$branch_name.md"
        git commit -m "🎄 CTB: Initialize $branch_name branch at $altitude altitude

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

        git checkout $CURRENT_BRANCH
    fi
}

# Create 40k Altitude Branches (Doctrine Core)
echo "🔥 40k Altitude - Doctrine Core"
echo "--------------------------------"
for branch in "${DOCTRINE_BRANCHES[@]}"; do
    create_branch_if_needed "$branch" "40k"
done
for branch in "${SYS_BRANCHES[@]}"; do
    create_branch_if_needed "$branch" "40k"
done
echo ""

# Create 20k Altitude Branches (IMO Factory)
echo "⚙️  20k Altitude - IMO Factory Layer"
echo "--------------------------------"
for branch in "${IMO_BRANCHES[@]}"; do
    create_branch_if_needed "$branch" "20k"
done
echo ""

# Create 10k Altitude Branches (UI Layer)
echo "🎨 10k Altitude - UI Layer"
echo "--------------------------------"
for branch in "${UI_BRANCHES[@]}"; do
    create_branch_if_needed "$branch" "10k"
done
echo ""

# Create 5k Altitude Branches (Operations)
echo "🔧 5k Altitude - Operations Layer"
echo "--------------------------------"
for branch in "${OPS_BRANCHES[@]}"; do
    create_branch_if_needed "$branch" "5k"
done
echo ""

echo "=================================================================="
echo "✅ CTB Initialization Complete!"
echo ""
echo "📊 Branch Summary:"
echo "   - Doctrine Core (40k): ${#DOCTRINE_BRANCHES[@]} branches"
echo "   - System Layer (40k): ${#SYS_BRANCHES[@]} branches"
echo "   - IMO Factory (20k): ${#IMO_BRANCHES[@]} branches"
echo "   - UI Layer (10k): ${#UI_BRANCHES[@]} branches"
echo "   - Operations (5k): ${#OPS_BRANCHES[@]} branches"
echo ""
echo "🎄 Total: ${#ALL_BRANCHES[@]} CTB branches ready"
echo ""
echo "Next steps:"
echo "1. Push branches to remote: git push --all origin"
echo "2. Verify structure: ./fleet/scripts/ctb_verify.sh"
echo "3. Start organizing files according to ctb.branchmap.yaml"
echo ""
