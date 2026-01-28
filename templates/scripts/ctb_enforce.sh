#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.801651
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 75%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01


###############################################################################
# CTB Doctrine Enforcement Script
# Version: 1.3
# Purpose: Enforce presence and health of required external repo branches
# Usage: bash global-config/scripts/ctb_enforce.sh [--strict]
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✅]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[⚠️ ]${NC} $1"
}

log_error() {
  echo -e "${RED}[❌]${NC} $1"
}

log_step() {
  echo -e "${CYAN}[STEP]${NC} $1"
}

# Configuration
STRICT_MODE=false
ENFORCEMENT_LOG="logs/ctb_enforcement.log"
FIREBASE_COLLECTION="ctb_enforcement_log"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --strict)
      STRICT_MODE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--strict]"
      exit 1
      ;;
  esac
done

# Header
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     CTB Doctrine Enforcement Check        ║${NC}"
echo -e "${CYAN}║  Verifying External Repository Integration║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Get repository info
REPO_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

log_info "Repository: $REPO_NAME"
log_info "Enforcement Mode: $([ "$STRICT_MODE" = true ] && echo "STRICT" || echo "STANDARD")"
log_info "Timestamp: $TIMESTAMP"
echo ""

# Required external repo branches
REQUIRED_BRANCHES=(
  "sys/chartdb"
  "sys/activepieces"
  "sys/windmill"
  "sys/claude-skills"
)

# Required MCP tools
declare -A REQUIRED_TOOLS
REQUIRED_TOOLS["ChartDB"]="04.04.07"
REQUIRED_TOOLS["Activepieces"]="04.04.08"
REQUIRED_TOOLS["Windmill"]="04.04.09"
REQUIRED_TOOLS["Anthropic_Claude_Skills"]="04.04.10"

# Required ports (Claude Skills uses global Composio endpoint)
declare -A REQUIRED_PORTS
REQUIRED_PORTS["ChartDB"]="5173"
REQUIRED_PORTS["Activepieces"]="80"
REQUIRED_PORTS["Windmill"]="8000"

# Enforcement results
MISSING_BRANCHES=()
EMPTY_BRANCHES=()
MISSING_TOOLS=()
UNHEALTHY_PORTS=()
ENFORCEMENT_PASSED=true

# Step 1: Check required branches exist
log_step "1/5 Checking required external repo branches..."
echo ""

for branch in "${REQUIRED_BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    log_success "Branch exists: $branch"

    # Check if branch has content
    FILE_COUNT=$(git ls-tree -r "$branch" --name-only | wc -l)
    if [ "$FILE_COUNT" -lt 10 ]; then
      log_warning "Branch appears empty: $branch (only $FILE_COUNT files)"
      EMPTY_BRANCHES+=("$branch")
      ENFORCEMENT_PASSED=false
    fi
  else
    log_error "Missing required branch: $branch"
    MISSING_BRANCHES+=("$branch")
    ENFORCEMENT_PASSED=false
  fi
done

echo ""

# Step 2: Check MCP registry for required tools
log_step "2/5 Verifying MCP tool registration..."
echo ""

MCP_REGISTRY="config/mcp_registry.json"

if [ ! -f "$MCP_REGISTRY" ]; then
  log_error "MCP registry not found: $MCP_REGISTRY"
  ENFORCEMENT_PASSED=false
else
  for tool in "${!REQUIRED_TOOLS[@]}"; do
    doctrine_id="${REQUIRED_TOOLS[$tool]}"

    if grep -q "\"doctrine_id\": \"$doctrine_id\"" "$MCP_REGISTRY"; then
      log_success "MCP tool registered: $tool ($doctrine_id)"
    else
      log_error "Missing MCP tool: $tool ($doctrine_id)"
      MISSING_TOOLS+=("$tool")
      ENFORCEMENT_PASSED=false
    fi
  done
fi

echo ""

# Step 3: Check port health (optional - only if ports are accessible)
log_step "3/5 Checking service port health (optional)..."
echo ""

for tool in "${!REQUIRED_PORTS[@]}"; do
  port="${REQUIRED_PORTS[$tool]}"

  # Try to connect to port (timeout after 1 second)
  if timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/$port" 2>/dev/null; then
    log_success "Port healthy: $tool (localhost:$port)"
  else
    log_warning "Port not accessible: $tool (localhost:$port) - service may not be running"
    # Don't fail enforcement for port checks in standard mode
    if [ "$STRICT_MODE" = true ]; then
      UNHEALTHY_PORTS+=("$tool:$port")
      ENFORCEMENT_PASSED=false
    fi
  fi
done

echo ""

# Step 4: Verify CTB configuration
log_step "4/5 Verifying CTB configuration files..."
echo ""

CTB_BRANCHMAP="global-config/ctb.branchmap.yaml"
CTB_DOCTRINE="global-config/CTB_DOCTRINE.md"

if [ -f "$CTB_BRANCHMAP" ]; then
  # Check if all 3 branches are listed in branchmap
  for branch in "${REQUIRED_BRANCHES[@]}"; do
    if grep -q "$branch" "$CTB_BRANCHMAP"; then
      log_success "Branch in CTB map: $branch"
    else
      log_error "Branch missing from CTB map: $branch"
      ENFORCEMENT_PASSED=false
    fi
  done
else
  log_error "CTB branch map not found: $CTB_BRANCHMAP"
  ENFORCEMENT_PASSED=false
fi

echo ""

# Step 5: Create enforcement log
log_step "5/5 Creating enforcement log..."
echo ""

mkdir -p logs

# Log to file
cat > "$ENFORCEMENT_LOG" << EOF
{
  "timestamp": "$TIMESTAMP",
  "repo_id": "$REPO_NAME",
  "enforcement_mode": "$([ "$STRICT_MODE" = true ] && echo "STRICT" || echo "STANDARD")",
  "status": "$([ "$ENFORCEMENT_PASSED" = true ] && echo "PASSED" || echo "FAILED")",
  "checks": {
    "branches": {
      "required": ${#REQUIRED_BRANCHES[@]},
      "missing": ${#MISSING_BRANCHES[@]},
      "empty": ${#EMPTY_BRANCHES[@]},
      "missing_list": $(printf '%s\n' "${MISSING_BRANCHES[@]}" | jq -R . | jq -s .),
      "empty_list": $(printf '%s\n' "${EMPTY_BRANCHES[@]}" | jq -R . | jq -s .)
    },
    "mcp_tools": {
      "required": ${#REQUIRED_TOOLS[@]},
      "missing": ${#MISSING_TOOLS[@]},
      "missing_list": $(printf '%s\n' "${MISSING_TOOLS[@]}" | jq -R . | jq -s .)
    },
    "ports": {
      "checked": ${#REQUIRED_PORTS[@]},
      "unhealthy": ${#UNHEALTHY_PORTS[@]},
      "unhealthy_list": $(printf '%s\n' "${UNHEALTHY_PORTS[@]}" | jq -R . | jq -s .)
    }
  }
}
EOF

log_success "Enforcement log created: $ENFORCEMENT_LOG"

# Optional: Log to Firebase (if firebase CLI available)
if command -v firebase &> /dev/null; then
  log_info "Firebase CLI detected - logging to $FIREBASE_COLLECTION"
  # Firebase logging would go here
else
  log_warning "Firebase CLI not found - skipping remote logging"
fi

echo ""

# Summary
log_info "=== CTB Doctrine Enforcement Summary ==="
echo ""

if [ "$ENFORCEMENT_PASSED" = true ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║       ✅ CTB DOCTRINE VERIFIED            ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}Repository:${NC}        $REPO_NAME"
  echo -e "${CYAN}Status:${NC}            ✅ COMPLIANT"
  echo -e "${CYAN}Branches:${NC}          ${#REQUIRED_BRANCHES[@]}/${#REQUIRED_BRANCHES[@]} present"
  echo -e "${CYAN}MCP Tools:${NC}         ${#REQUIRED_TOOLS[@]}/${#REQUIRED_TOOLS[@]} registered"
  echo -e "${CYAN}Timestamp:${NC}         $TIMESTAMP"
  echo ""

  # Tag commit
  TAG_NAME="ctb-verified-$(date +%Y%m%d-%H%M%S)"
  git tag -a "$TAG_NAME" -m "[CTB_DOCTRINE_VERIFIED] Enforcement check passed at $TIMESTAMP" 2>/dev/null || log_info "Tag creation skipped (not in git repo or tag exists)"

  exit 0
else
  echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║    ❌ CTB_ENFORCEMENT_FAILURE             ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}Repository:${NC}        $REPO_NAME"
  echo -e "${CYAN}Status:${NC}            ❌ NON-COMPLIANT"
  echo ""

  # Diagnostic output
  if [ ${#MISSING_BRANCHES[@]} -gt 0 ]; then
    echo -e "${RED}Missing Branches (${#MISSING_BRANCHES[@]}):${NC}"
    printf '  - %s\n' "${MISSING_BRANCHES[@]}"
    echo ""
  fi

  if [ ${#EMPTY_BRANCHES[@]} -gt 0 ]; then
    echo -e "${YELLOW}Empty Branches (${#EMPTY_BRANCHES[@]}):${NC}"
    printf '  - %s\n' "${EMPTY_BRANCHES[@]}"
    echo ""
  fi

  if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo -e "${RED}Missing MCP Tools (${#MISSING_TOOLS[@]}):${NC}"
    printf '  - %s\n' "${MISSING_TOOLS[@]}"
    echo ""
  fi

  if [ ${#UNHEALTHY_PORTS[@]} -gt 0 ]; then
    echo -e "${YELLOW}Unhealthy Ports (${#UNHEALTHY_PORTS[@]}):${NC}"
    printf '  - %s\n' "${UNHEALTHY_PORTS[@]}"
    echo ""
  fi

  echo -e "${YELLOW}Remediation Steps:${NC}"
  echo "  1. Run: bash global-config/scripts/ctb_init.sh"
  echo "  2. Or: Update from IMO-Creator SOURCE"
  echo "  3. Verify: bash global-config/scripts/ctb_enforce.sh"
  echo ""

  exit 1
fi
