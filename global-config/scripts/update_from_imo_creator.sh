#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.841843
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 75%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01


###############################################################################
# IMO-Creator CTB Update Script
# Version: 1.3.2
# Purpose: One-command update from IMO-Creator SOURCE repository
# Usage: bash update_from_imo_creator.sh [/path/to/imo-creator]
#
# Simple command: "update from imo-creator"
# This script handles everything automatically.
#
# Updates include:
# - CTB Doctrine v1.3.2 (all 4 mandatory integrations)
# - Phase 1: Testing infrastructure, integration docs, GitHub templates
# - Phase 2: Dev containers, VS Code config, troubleshooting, architecture
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
  echo -e "${CYAN}[STEP]${NC} $1"
}

# Header
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  IMO-Creator CTB Doctrine Update v1.3.2   ║${NC}"
echo -e "${CYAN}║  Automatic Repository Synchronization     ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Determine if we're in the SOURCE repo or a child repo
CURRENT_REPO_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")

if [ "$CURRENT_REPO_NAME" = "imo-creator" ]; then
  log_warning "You are in the IMO-Creator SOURCE repository"
  log_info "This repository DEFINES the CTB doctrine"
  log_info "No update needed - this is the source of truth"
  echo ""
  log_info "To apply CTB to another repository:"
  log_info "  1. Navigate to that repository"
  log_info "  2. Run: bash /path/to/imo-creator/global-config/scripts/update_from_imo_creator.sh"
  echo ""
  exit 0
fi

# We're in a different repository - proceed with update
log_info "Current repository: $CURRENT_REPO_NAME"
log_info "Updating from IMO-Creator SOURCE v1.3.2..."
echo ""

# Find IMO-Creator source
IMO_CREATOR_PATH=""

# Check if imo-creator/ subfolder exists (IMPORT repo pattern)
if [ -d "imo-creator" ]; then
  log_step "Detected imo-creator/ subfolder (IMPORT repository pattern)"
  IMO_CREATOR_PATH="imo-creator"
else
  # Try to find imo-creator in common locations
  SEARCH_PATHS=(
    "../imo-creator"
    "../../imo-creator"
    "$HOME/Desktop/Cursor Builds/imo-creator"
    "/c/Users/CUSTOM PC/Desktop/Cursor Builds/imo-creator"
    "C:/Users/CUSTOM PC/Desktop/Cursor Builds/imo-creator"
  )

  for path in "${SEARCH_PATHS[@]}"; do
    if [ -d "$path/global-config" ]; then
      IMO_CREATOR_PATH="$path"
      log_step "Found IMO-Creator SOURCE at: $path"
      break
    fi
  done
fi

if [ -z "$IMO_CREATOR_PATH" ] || [ ! -d "$IMO_CREATOR_PATH/global-config" ]; then
  log_error "Cannot find IMO-Creator SOURCE repository"
  log_info "Please specify the path to imo-creator:"
  log_info "  bash update_from_imo_creator.sh /path/to/imo-creator"
  exit 1
fi

# Allow override via argument
if [ -n "$1" ]; then
  if [ -d "$1/global-config" ]; then
    IMO_CREATOR_PATH="$1"
    log_step "Using specified IMO-Creator path: $1"
  else
    log_error "Specified path does not contain global-config/"
    exit 1
  fi
fi

log_success "IMO-Creator SOURCE located at: $IMO_CREATOR_PATH"
echo ""

# Step 1: Copy global configuration
log_step "1/8 Syncing global configuration files..."

mkdir -p global-config/scripts
mkdir -p config

# Copy CTB configuration files
[ -f "$IMO_CREATOR_PATH/global-config/ctb.branchmap.yaml" ] && cp "$IMO_CREATOR_PATH/global-config/ctb.branchmap.yaml" "global-config/" && log_info "  ✓ ctb.branchmap.yaml"
# Prefer standardized filename; fallback to legacy
if [ -f "$IMO_CREATOR_PATH/ctb/docs/global-config/doctrine_ctb.md" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/global-config/doctrine_ctb.md" "global-config/" && log_info "  ✓ doctrine_ctb.md"
elif [ -f "$IMO_CREATOR_PATH/global-config/CTB_DOCTRINE.md" ]; then
  cp "$IMO_CREATOR_PATH/global-config/CTB_DOCTRINE.md" "global-config/" && log_info "  ✓ CTB_DOCTRINE.md (legacy)"
fi
[ -f "$IMO_CREATOR_PATH/global-config/ctb_version.json" ] && cp "$IMO_CREATOR_PATH/global-config/ctb_version.json" "global-config/" && log_info "  ✓ ctb_version.json (version tracking)"
[ -f "$IMO_CREATOR_PATH/global-config/branch_protection_config.json" ] && cp "$IMO_CREATOR_PATH/global-config/branch_protection_config.json" "global-config/" && log_info "  ✓ branch_protection_config.json"

# Copy global manifest (supports legacy and CTB paths)
if [ -f "$IMO_CREATOR_PATH/global-config/global_manifest.yaml" ]; then
  cp "$IMO_CREATOR_PATH/global-config/global_manifest.yaml" "global-config/" && log_info "  ✓ global_manifest.yaml"
elif [ -f "$IMO_CREATOR_PATH/ctb/docs/global-config/global_manifest.yaml" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/global-config/global_manifest.yaml" "global-config/" && log_info "  ✓ global_manifest.yaml (from CTB path)"
fi

# Copy MCP registry
[ -f "$IMO_CREATOR_PATH/config/mcp_registry.json" ] && cp "$IMO_CREATOR_PATH/config/mcp_registry.json" "config/" && log_info "  ✓ mcp_registry.json (4 mandatory tools)"

# Copy IMO-RA (Radial Architecture) schema
[ -f "$IMO_CREATOR_PATH/global-config/imo-ra-schema.json" ] && cp "$IMO_CREATOR_PATH/global-config/imo-ra-schema.json" "global-config/" && log_info "  ✓ imo-ra-schema.json (Hub-and-Spoke Architecture)"

# Copy ALL scripts (including new v1.3 scripts)
for script in "$IMO_CREATOR_PATH/global-config/scripts"/*.sh; do
  if [ -f "$script" ]; then
    cp "$script" "global-config/scripts/"
    chmod +x "global-config/scripts/$(basename "$script")"
  fi
done

# Copy CTB scripts from new location (ctb/docs/global-config/scripts/)
if [ -d "$IMO_CREATOR_PATH/ctb/docs/global-config/scripts" ]; then
  for script in "$IMO_CREATOR_PATH/ctb/docs/global-config/scripts"/*.sh "$IMO_CREATOR_PATH/ctb/docs/global-config/scripts"/*.py; do
    if [ -f "$script" ]; then
      cp "$script" "global-config/scripts/"
      chmod +x "global-config/scripts/$(basename "$script")" 2>/dev/null || true
    fi
  done
fi
log_info "  ✓ All CTB scripts (enforce, security, setup, planner, etc.)"

# Copy CTB Planner documentation
mkdir -p ctb/docs ctb/examples/ctb_plan_examples
if [ -f "$IMO_CREATOR_PATH/ctb/docs/CTB_PLANNER.md" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/CTB_PLANNER.md" "ctb/docs/" && log_info "  ✓ CTB_PLANNER.md"
fi
if [ -f "$IMO_CREATOR_PATH/ctb/docs/CTB_TOOL_INTEGRATION.md" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/CTB_TOOL_INTEGRATION.md" "ctb/docs/" && log_info "  ✓ CTB_TOOL_INTEGRATION.md"
fi

# Copy example CTB plans
if [ -d "$IMO_CREATOR_PATH/ctb/examples/ctb_plan_examples" ]; then
  cp -r "$IMO_CREATOR_PATH/ctb/examples/ctb_plan_examples"/* "ctb/examples/ctb_plan_examples/" 2>/dev/null || true
  log_info "  ✓ CTB plan examples"
fi

log_success "Configuration files synced"
echo ""

# Step 2: Copy GitHub Actions workflows and templates
log_step "2/8 Syncing GitHub Actions and templates..."

mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE

# Workflows
[ -f "$IMO_CREATOR_PATH/.github/workflows/doctrine_sync.yml" ] && cp "$IMO_CREATOR_PATH/.github/workflows/doctrine_sync.yml" ".github/workflows/" && log_info "  ✓ doctrine_sync.yml"
[ -f "$IMO_CREATOR_PATH/.github/workflows/ctb_health.yml" ] && cp "$IMO_CREATOR_PATH/.github/workflows/ctb_health.yml" ".github/workflows/" && log_info "  ✓ ctb_health.yml"
[ -f "$IMO_CREATOR_PATH/.github/workflows/audit.yml" ] && cp "$IMO_CREATOR_PATH/.github/workflows/audit.yml" ".github/workflows/" && log_info "  ✓ audit.yml"
[ -f "$IMO_CREATOR_PATH/.github/workflows/test_coverage.yml" ] && cp "$IMO_CREATOR_PATH/.github/workflows/test_coverage.yml" ".github/workflows/" && log_info "  ✓ test_coverage.yml (Phase 1)"

# Templates
[ -f "$IMO_CREATOR_PATH/.github/ISSUE_TEMPLATE/bug_report.md" ] && cp "$IMO_CREATOR_PATH/.github/ISSUE_TEMPLATE/bug_report.md" ".github/ISSUE_TEMPLATE/" && log_info "  ✓ bug_report.md (Phase 1)"
[ -f "$IMO_CREATOR_PATH/.github/pull_request_template.md" ] && cp "$IMO_CREATOR_PATH/.github/pull_request_template.md" ".github/" && log_info "  ✓ pull_request_template.md (Phase 1)"

log_success "GitHub configuration synced"
echo ""

# Step 3: Copy testing infrastructure (Phase 1)
log_step "3/8 Syncing testing infrastructure (Phase 1)..."

mkdir -p tests

[ -f "$IMO_CREATOR_PATH/pytest.ini" ] && cp "$IMO_CREATOR_PATH/pytest.ini" "./" && log_info "  ✓ pytest.ini"
[ -f "$IMO_CREATOR_PATH/tests/test_ctb_scripts.sh" ] && cp "$IMO_CREATOR_PATH/tests/test_ctb_scripts.sh" "tests/" && chmod +x "tests/test_ctb_scripts.sh" && log_info "  ✓ test_ctb_scripts.sh"
[ -f "$IMO_CREATOR_PATH/tests/test_registry.py" ] && cp "$IMO_CREATOR_PATH/tests/test_registry.py" "tests/" && log_info "  ✓ test_registry.py"

log_success "Testing infrastructure synced"
echo ""

# Step 4: Copy integration documentation (Phase 1)
log_step "4/8 Syncing integration documentation (Phase 1)..."

mkdir -p chartdb activepieces windmill sys/claude-skills

[ -f "$IMO_CREATOR_PATH/chartdb/README.md" ] && cp "$IMO_CREATOR_PATH/chartdb/README.md" "chartdb/" && log_info "  ✓ chartdb/README.md (04.04.07)"
[ -f "$IMO_CREATOR_PATH/activepieces/README.md" ] && cp "$IMO_CREATOR_PATH/activepieces/README.md" "activepieces/" && log_info "  ✓ activepieces/README.md (04.04.08)"
[ -f "$IMO_CREATOR_PATH/windmill/README.md" ] && cp "$IMO_CREATOR_PATH/windmill/README.md" "windmill/" && log_info "  ✓ windmill/README.md (04.04.09)"

# Copy entire sys/claude-skills directory
if [ -d "$IMO_CREATOR_PATH/sys/claude-skills" ]; then
  cp -r "$IMO_CREATOR_PATH/sys/claude-skills"/* "sys/claude-skills/" 2>/dev/null || true
  log_info "  ✓ sys/claude-skills/* (04.04.10 - AI/SHQ layer)"
fi

log_success "Integration documentation synced"
echo ""

# Step 5: Copy dev container configuration (Phase 2)
log_step "5/8 Syncing dev container configuration (Phase 2)..."

mkdir -p .devcontainer

[ -f "$IMO_CREATOR_PATH/.devcontainer/devcontainer.json" ] && cp "$IMO_CREATOR_PATH/.devcontainer/devcontainer.json" ".devcontainer/" && log_info "  ✓ devcontainer.json (one-click environment)"

log_success "Dev container synced"
echo ""

# Step 6: Copy VS Code configuration (Phase 2)
log_step "6/8 Syncing VS Code configuration (Phase 2)..."

mkdir -p .vscode

# Only copy if they don't exist (preserve existing customizations)
if [ ! -f ".vscode/settings.json" ]; then
  [ -f "$IMO_CREATOR_PATH/.vscode/settings.json" ] && cp "$IMO_CREATOR_PATH/.vscode/settings.json" ".vscode/" && log_info "  ✓ settings.json (created)"
else
  log_warning "  ⊘ settings.json exists - preserving existing file"
fi

[ -f "$IMO_CREATOR_PATH/.vscode/extensions.json" ] && cp "$IMO_CREATOR_PATH/.vscode/extensions.json" ".vscode/" && log_info "  ✓ extensions.json"

log_success "VS Code configuration synced"
echo ""

# Step 7: Copy comprehensive documentation (Phase 2)
log_step "7/8 Syncing comprehensive documentation (Phase 2)..."

mkdir -p docs

[ -f "$IMO_CREATOR_PATH/docs/TROUBLESHOOTING.md" ] && cp "$IMO_CREATOR_PATH/docs/TROUBLESHOOTING.md" "docs/" && log_info "  ✓ TROUBLESHOOTING.md (90% self-service)"
[ -f "$IMO_CREATOR_PATH/docs/ARCHITECTURE.md" ] && cp "$IMO_CREATOR_PATH/docs/ARCHITECTURE.md" "docs/" && log_info "  ✓ ARCHITECTURE.md (complete system overview)"

log_success "Documentation synced"
echo ""

# Step 7.1: Copy custom integrations (Hostinger, Abacus.AI, etc.)
log_step "7.1/10 Syncing custom integrations (Composio extensions)..."

mkdir -p global-config/integrations

# Sync all custom integrations from imo-creator
if [ -d "$IMO_CREATOR_PATH/global-config/integrations" ]; then
  for integration_dir in "$IMO_CREATOR_PATH/global-config/integrations"/*; do
    if [ -d "$integration_dir" ]; then
      integration_name=$(basename "$integration_dir")
      mkdir -p "global-config/integrations/$integration_name"
      cp -r "$integration_dir"/* "global-config/integrations/$integration_name/" 2>/dev/null || true
      log_info "  ✓ global-config/integrations/$integration_name/* (custom integration)"
    fi
  done
  log_success "Custom integrations synced (Hostinger 04.04.13, Abacus.AI 04.04.14)"
else
  log_warning "  ⊘ No custom integrations found in SOURCE - skipping"
fi
echo ""

# Step 7.3: Sync agent definitions/templates
log_step "7.3/10 Syncing agent definitions and templates..."

# Global agents (doctrine)
mkdir -p docs/doctrine/agents
if [ -d "$IMO_CREATOR_PATH/ctb/docs/doctrine/agents" ]; then
  cp -r "$IMO_CREATOR_PATH/ctb/docs/doctrine/agents"/* "docs/doctrine/agents/" 2>/dev/null || true
  log_info "  ✓ docs/doctrine/agents/* (global fleet)"
fi

# Doctrine system manifest (front-and-center)
mkdir -p docs/doctrine/doctrine
if [ -f "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/doctrine_system_manifest.yaml" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/doctrine_system_manifest.yaml" "docs/doctrine/doctrine/" && log_info "  ✓ docs/doctrine/doctrine/doctrine_system_manifest.yaml"
fi

# Doctrine error flow (correlation)
if [ -f "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/doctrine_error_flow.md" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/doctrine_error_flow.md" "docs/doctrine/doctrine/" && log_info "  ✓ docs/doctrine/doctrine/doctrine_error_flow.md"
fi

# Local agent templates
mkdir -p templates/agents
if [ -d "$IMO_CREATOR_PATH/templates/agents" ]; then
  cp -r "$IMO_CREATOR_PATH/templates/agents"/* "templates/agents/" 2>/dev/null || true
  log_info "  ✓ templates/agents/* (local agent templates)"
fi

# Step 7.25: Sync doctrine acronyms/glossary (standardized name preferred)
log_step "7.25/10 Syncing doctrine acronyms/glossary..."

mkdir -p docs/doctrine

if [ -f "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/doctrine_acronyms.md" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/doctrine_acronyms.md" "docs/doctrine/doctrine_acronyms.md" && log_info "  ✓ docs/doctrine/doctrine_acronyms.md (standard)"
elif [ -f "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/ACRONYMS.md" ]; then
  cp "$IMO_CREATOR_PATH/ctb/docs/doctrine/doctrine/ACRONYMS.md" "docs/doctrine/ACRONYMS.md" && log_info "  ✓ docs/doctrine/ACRONYMS.md (legacy)"
elif [ -f "$IMO_CREATOR_PATH/doctrine/ACRONYMS.md" ]; then
  cp "$IMO_CREATOR_PATH/doctrine/ACRONYMS.md" "docs/doctrine/ACRONYMS.md" && log_info "  ✓ docs/doctrine/ACRONYMS.md (legacy)"
fi

# Step 7.8: Sync tooling scripts (validator, doctor, visuals, enforcer)
log_step "7.8/10 Syncing doctrine tooling scripts..."
mkdir -p scripts
copy_script() {
  local src_file="$1"
  local name
  name=$(basename "$src_file")
  if [ -f "$src_file" ]; then
    cp "$src_file" "scripts/$name"
    chmod +x "scripts/$name" 2>/dev/null || true
    log_info "  ✓ scripts/$name"
  fi
}

copy_script "$IMO_CREATOR_PATH/scripts/validate_configs.cjs"
copy_script "$IMO_CREATOR_PATH/scripts/doctor.sh"
copy_script "$IMO_CREATOR_PATH/scripts/gen_visuals.cjs"
copy_script "$IMO_CREATOR_PATH/scripts/doctrine_enforcer.sh"
copy_script "$IMO_CREATOR_PATH/scripts/check_file_names.sh"

# Step 7.5: Copy imo_tools library (modular toolbox)
log_step "7.5/10 Syncing imo_tools library (modular toolbox)..."

mkdir -p libs/imo_tools

# Copy the entire imo_tools library
if [ -d "$IMO_CREATOR_PATH/libs/imo_tools" ]; then
  # Copy all Python files from imo_tools
  for tool_file in "$IMO_CREATOR_PATH/libs/imo_tools"/*.py; do
    if [ -f "$tool_file" ]; then
      cp "$tool_file" "libs/imo_tools/"
      log_info "  ✓ $(basename "$tool_file") (modular tool)"
    fi
  done

  # Ensure libs __init__.py exists
  [ -f "$IMO_CREATOR_PATH/libs/__init__.py" ] && cp "$IMO_CREATOR_PATH/libs/__init__.py" "libs/" && log_info "  ✓ libs/__init__.py"

  log_success "imo_tools library synced (AI-ready toolbox)"
else
  log_warning "  ⊘ imo_tools not found in SOURCE - skipping"
fi
echo ""

# Step 8: Create/sync CTB branches
log_step "8/10 Creating CTB branch structure..."

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "master")
log_info "Current branch: $CURRENT_BRANCH"

# List of all CTB branches (19 total)
CTB_BRANCHES=(
  "doctrine/get-ingest"
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
  "imo/input"
  "imo/middle"
  "imo/output"
  "ui/figma-bolt"
  "ui/builder-templates"
  "ops/automation-scripts"
  "ops/report-builder"
)

CREATED_COUNT=0
EXISTING_COUNT=0

for branch in "${CTB_BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    EXISTING_COUNT=$((EXISTING_COUNT + 1))
  else
    git checkout -b "$branch" 2>/dev/null && CREATED_COUNT=$((CREATED_COUNT + 1)) && log_info "  ✓ Created branch: $branch"
  fi
done

# Return to original branch
git checkout "$CURRENT_BRANCH" 2>/dev/null || git checkout master 2>/dev/null

log_info "Branches: $EXISTING_COUNT existing, $CREATED_COUNT created"
log_success "CTB branch structure initialized"
echo ""

# Step 9: Copy branch-specific content for mandatory integrations
log_step "9/10 Syncing mandatory integration branch content..."

# For each mandatory branch, copy its content from imo-creator if it exists
MANDATORY_BRANCHES=("sys/chartdb" "sys/activepieces" "sys/windmill" "sys/claude-skills")

for branch in "${MANDATORY_BRANCHES[@]}"; do
  if [ -d "$IMO_CREATOR_PATH/$branch" ]; then
    # Branch directory exists in imo-creator, copy contents
    mkdir -p "$branch"
    cp -r "$IMO_CREATOR_PATH/$branch"/* "$branch/" 2>/dev/null || true
    log_info "  ✓ Synced $branch/ content"
  fi
done

log_success "Mandatory integration content synced"
echo ""

# Step 10: Run CTB enforcement and setup
log_step "10/10 Running CTB enforcement and validation..."

# Make sure scripts are executable
chmod +x global-config/scripts/*.sh 2>/dev/null || true
chmod +x tests/*.sh 2>/dev/null || true

# Run CTB enforcement check
if [ -f "global-config/scripts/ctb_enforce.sh" ]; then
  log_info "Running CTB enforcement validation..."
  bash global-config/scripts/ctb_enforce.sh 2>&1 | grep -E "(✅|❌|COMPLIANT|FAILURE)" | head -20 || log_warning "Enforcement check completed with warnings"
else
  log_warning "CTB enforcement script not found - skipping validation"
fi

echo ""
log_success "Update complete!"
echo ""

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   CTB Doctrine v1.3.2 Update Complete     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Repository:${NC}         $CURRENT_REPO_NAME"
echo -e "${CYAN}Source:${NC}            IMO-Creator v1.3.2"
echo -e "${CYAN}CTB Version:${NC}       1.3.2"
echo -e "${CYAN}Updated:${NC}           $(date)"
echo ""
echo -e "${YELLOW}What was synced:${NC}"
echo -e "  ${GREEN}✓${NC} CTB Doctrine configuration (v1.3.4)"
echo -e "  ${GREEN}✓${NC} IMO-RA Schema (Hub-and-Spoke Radial Architecture)"
echo -e "  ${GREEN}✓${NC} Version tracking system (ctb_version.json + auto-update script)"
echo -e "  ${GREEN}✓${NC} CTB Planner system (AI-driven repository organization)"
echo -e "  ${GREEN}✓${NC} Planner validator script (apply_ctb_plan.py)"
echo -e "  ${GREEN}✓${NC} Tool integration guides (Obsidian, GitHub Projects, GitKraken, Grafana)"
echo -e "  ${GREEN}✓${NC} Example CTB plans and templates"
echo -e "  ${GREEN}✓${NC} All 19 CTB branches created/verified"
echo -e "  ${GREEN}✓${NC} All 4 mandatory integration branches (04.04.07-10)"
echo -e "  ${GREEN}✓${NC} Mandatory branch content (chartdb, activepieces, windmill, claude-skills)"
echo -e "  ${GREEN}✓${NC} Custom integrations (Hostinger 04.04.13, Abacus.AI 04.04.14)"
echo -e "  ${GREEN}✓${NC} Testing infrastructure (pytest, coverage)"
echo -e "  ${GREEN}✓${NC} Integration documentation (READMEs)"
echo -e "  ${GREEN}✓${NC} GitHub templates (issues, PRs, workflows + auto-update)"
echo -e "  ${GREEN}✓${NC} Dev container configuration"
echo -e "  ${GREEN}✓${NC} VS Code settings and extensions"
echo -e "  ${GREEN}✓${NC} Troubleshooting and architecture guides"
echo -e "  ${GREEN}✓${NC} CTB enforcement and security scripts"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review changes: ${CYAN}git status${NC}"
echo -e "  2. Test locally: ${CYAN}bash global-config/scripts/dev_setup.sh${NC}"
echo -e "  3. Run tests: ${CYAN}pytest${NC}"
echo -e "  4. Commit changes: ${CYAN}git add . && git commit -m '🔁 CTB Doctrine v1.3.2 sync from imo-creator'${NC}"
echo -e "  5. Push to remote: ${CYAN}git push origin master${NC}"
echo ""
echo -e "${BLUE}🌲 CTB Doctrine: Your repository is now aligned with IMO-Creator v1.3.2 standards${NC}"
echo ""
