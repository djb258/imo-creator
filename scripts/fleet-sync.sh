#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# FLEET SYNC — Push imo-creator Templates to All Child Repos
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign)
# Purpose: Clone each child repo from GitHub, overlay templates, commit, push
# Usage: ./scripts/fleet-sync.sh [OPTIONS]
# Exit: 0 = all repos synced, 1 = one or more repos failed
# ═══════════════════════════════════════════════════════════════════════════════
#
# OPTIONS:
#   --dry-run       Show what would happen without making changes (DEFAULT)
#   --apply         Actually clone, copy, commit, and push
#   --repo=NAME     Sync only this repo (by alias from FLEET_REGISTRY.yaml)
#   --branch=NAME   Push to this branch instead of default_branch
#   --no-push       Clone, copy, commit — but do NOT push to GitHub
#   --verbose       Show detailed output
#   --help          Show this help
#
# WHAT IT DOES:
#   1. Reads FLEET_REGISTRY.yaml + repo_registry.json for repo list
#   2. Clones each child repo into a temp directory
#   3. Copies all 152 template files from imo-creator templates/
#   4. Commits with doctrine version in message
#   5. Pushes to child repo on GitHub
#   6. Prints summary report
#
# SAFETY:
#   - Dry-run by default. You must pass --apply to make changes.
#   - Works in /tmp scratch space — never touches your local child repos.
#   - Each repo is independent — one failure doesn't block others.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─────────────────────────────────────────────────────────────────
# COLORS
# ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─────────────────────────────────────────────────────────────────
# DEFAULTS
# ─────────────────────────────────────────────────────────────────
DRY_RUN=true
VERBOSE=false
NO_PUSH=false
TARGET_REPO=""
OVERRIDE_BRANCH=""

# ─────────────────────────────────────────────────────────────────
# PARSE ARGS
# ─────────────────────────────────────────────────────────────────
for arg in "$@"; do
    case "$arg" in
        --dry-run)    DRY_RUN=true ;;
        --apply)      DRY_RUN=false ;;
        --no-push)    NO_PUSH=true ;;
        --verbose)    VERBOSE=true ;;
        --repo=*)     TARGET_REPO="${arg#--repo=}" ;;
        --branch=*)   OVERRIDE_BRANCH="${arg#--branch=}" ;;
        --help)
            head -35 "$0" | tail -30
            exit 0
            ;;
        *) echo -e "${RED}[ERROR]${NC} Unknown argument: $arg"; exit 2 ;;
    esac
done

# ─────────────────────────────────────────────────────────────────
# LOCATE FILES
# ─────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES_DIR="$REPO_ROOT/templates"
REGISTRY="$REPO_ROOT/FLEET_REGISTRY.yaml"
REPO_JSON="$REPO_ROOT/sys/registry/repo_registry.json"
MANIFEST="$REPO_ROOT/templates/TEMPLATES_MANIFEST.yaml"

for f in "$REGISTRY" "$REPO_JSON" "$MANIFEST"; do
    if [ ! -f "$f" ]; then
        echo -e "${RED}[ERROR]${NC} Required file not found: $f"
        exit 2
    fi
done

if [ ! -d "$TEMPLATES_DIR" ]; then
    echo -e "${RED}[ERROR]${NC} Templates directory not found: $TEMPLATES_DIR"
    exit 2
fi

# ─────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ─────────────────────────────────────────────────────────────────
PYTHON_CMD=""
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo -e "${RED}[ERROR]${NC} python3 is required but not installed"
    exit 2
fi

if ! $PYTHON_CMD -c "import yaml" 2>/dev/null; then
    echo -e "${RED}[ERROR]${NC} PyYAML is required. Install: pip install pyyaml"
    exit 2
fi

if ! command -v git &>/dev/null; then
    echo -e "${RED}[ERROR]${NC} git is required but not installed"
    exit 2
fi

if ! command -v gh &>/dev/null; then
    echo -e "${YELLOW}[WARN]${NC} gh CLI not found — using git clone with HTTPS"
fi

# ─────────────────────────────────────────────────────────────────
# BUILD REPO LIST VIA PYTHON
# ─────────────────────────────────────────────────────────────────
WORK_DIR=$(mktemp -d "/tmp/fleet-sync-XXXXXX")
REPO_LIST="$WORK_DIR/repos.txt"

$PYTHON_CMD - "$REGISTRY" "$REPO_JSON" "$TARGET_REPO" "$REPO_LIST" << 'PYBLOCK'
import sys, yaml, json

registry_path = sys.argv[1]
repo_json_path = sys.argv[2]
target_repo = sys.argv[3]
output_path = sys.argv[4]

with open(registry_path, 'r', encoding='utf-8') as f:
    registry = yaml.safe_load(f)

with open(repo_json_path, 'r', encoding='utf-8') as f:
    repo_json = json.load(f)

# Build lookup from repo_registry.json
json_lookup = {}
for r in repo_json.get('repos', []):
    alias = r.get('repo_alias', '')
    json_lookup[alias] = {
        'github_url': r.get('github_url', ''),
        'default_branch': r.get('default_branch', 'main'),
        'enabled': r.get('enabled', True)
    }

repos = registry.get('fleet', {}).get('repos', [])
parent_version = registry.get('fleet', {}).get('parent', {}).get('current_doctrine_version', 'unknown')

lines = []
for repo in repos:
    name = repo.get('name', '')
    status = repo.get('status', 'ACTIVE')
    github_slug = repo.get('github', '')

    # Skip non-active
    if status != 'ACTIVE':
        continue

    # Filter if --repo specified
    if target_repo and name != target_repo:
        continue

    # Get details from repo_registry.json
    info = json_lookup.get(name, {})
    github_url = info.get('github_url', '')
    default_branch = info.get('default_branch', 'main')
    enabled = info.get('enabled', True)

    if not enabled:
        continue

    # Fall back to constructing URL from github slug
    if not github_url and github_slug:
        github_url = f"https://github.com/{github_slug}.git"

    if not github_url:
        continue

    # Output: name|github_url|default_branch|github_slug
    lines.append(f"{name}|{github_url}|{default_branch}|{github_slug}")

# Write parent version as first line
with open(output_path, 'w') as f:
    f.write(f"PARENT_VERSION={parent_version}\n")
    for line in lines:
        f.write(line + "\n")
PYBLOCK

if [ ! -f "$REPO_LIST" ]; then
    echo -e "${RED}[ERROR]${NC} Failed to build repo list"
    rm -rf "$WORK_DIR"
    exit 2
fi

PARENT_VERSION=$(head -1 "$REPO_LIST" | cut -d= -f2)
REPO_COUNT=$(tail -n +2 "$REPO_LIST" | wc -l | tr -d ' ')

# Count template files
TEMPLATE_COUNT=$(find "$TEMPLATES_DIR" -type f | wc -l | tr -d ' ')

# ─────────────────────────────────────────────────────────────────
# HEADER
# ─────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
if $DRY_RUN; then
    echo -e "  FLEET SYNC — ${YELLOW}DRY RUN${NC}"
else
    echo -e "  FLEET SYNC — ${GREEN}APPLY MODE${NC}"
fi
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Parent doctrine:  v${PARENT_VERSION}"
echo "  Template files:   ${TEMPLATE_COUNT}"
echo "  Repos to sync:    ${REPO_COUNT}"
echo "  Working dir:      ${WORK_DIR}"
if [ -n "$OVERRIDE_BRANCH" ]; then
    echo "  Override branch:  ${OVERRIDE_BRANCH}"
fi
if $NO_PUSH; then
    echo -e "  Push:             ${YELLOW}DISABLED (--no-push)${NC}"
fi
echo ""
echo "───────────────────────────────────────────────────────────────"

if [ "$REPO_COUNT" -eq 0 ]; then
    echo -e "  ${YELLOW}No repos to sync.${NC}"
    if [ -n "$TARGET_REPO" ]; then
        echo "  (--repo=$TARGET_REPO did not match any ACTIVE repo)"
    fi
    rm -rf "$WORK_DIR"
    exit 0
fi

# ─────────────────────────────────────────────────────────────────
# SYNC EACH REPO
# ─────────────────────────────────────────────────────────────────
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
declare -a RESULTS=()

sync_repo() {
    local NAME="$1"
    local GITHUB_URL="$2"
    local DEFAULT_BRANCH="$3"
    local GITHUB_SLUG="$4"
    local BRANCH="${OVERRIDE_BRANCH:-$DEFAULT_BRANCH}"
    local CLONE_DIR="$WORK_DIR/$NAME"
    local COMMIT_MSG="ops: fleet-sync doctrine v${PARENT_VERSION}

Synced ${TEMPLATE_COUNT} template files from imo-creator.
Parent doctrine version: ${PARENT_VERSION}
Synced by: scripts/fleet-sync.sh"

    echo ""
    echo -e "  ${BOLD}[$NAME]${NC} ($GITHUB_SLUG)"
    echo "  URL:    $GITHUB_URL"
    echo "  Branch: $BRANCH"

    if $DRY_RUN; then
        echo -e "  Action: ${YELLOW}SKIP (dry-run)${NC} — would clone, copy ${TEMPLATE_COUNT} files, commit, push"
        RESULTS+=("$NAME|DRY-RUN|Would sync ${TEMPLATE_COUNT} files to $BRANCH")
        return 0
    fi

    # Clone
    echo -n "  Cloning... "
    if ! git clone --depth 1 --branch "$BRANCH" "$GITHUB_URL" "$CLONE_DIR" 2>/dev/null; then
        # Branch might not exist yet — try default then create
        if ! git clone --depth 1 "$GITHUB_URL" "$CLONE_DIR" 2>/dev/null; then
            echo -e "${RED}FAILED${NC}"
            RESULTS+=("$NAME|FAILED|Clone failed")
            return 1
        fi
        # Create the target branch if it differs
        if [ "$BRANCH" != "$(git -C "$CLONE_DIR" rev-parse --abbrev-ref HEAD)" ]; then
            git -C "$CLONE_DIR" checkout -b "$BRANCH" 2>/dev/null
        fi
    fi
    echo -e "${GREEN}OK${NC}"

    # Copy templates
    echo -n "  Copying templates... "
    # Ensure templates/ directory exists in child
    mkdir -p "$CLONE_DIR/templates"
    # rsync-style copy: mirror the entire templates directory
    if command -v rsync &>/dev/null; then
        rsync -a --delete "$TEMPLATES_DIR/" "$CLONE_DIR/templates/"
    else
        rm -rf "$CLONE_DIR/templates"
        cp -a "$TEMPLATES_DIR" "$CLONE_DIR/templates"
    fi
    echo -e "${GREEN}OK${NC} (${TEMPLATE_COUNT} files)"

    # Check for changes
    local CHANGED_COUNT
    CHANGED_COUNT=$(git -C "$CLONE_DIR" status --porcelain | wc -l | tr -d ' ')

    if [ "$CHANGED_COUNT" -eq 0 ]; then
        echo -e "  Changes: ${CYAN}NONE${NC} — already up to date"
        RESULTS+=("$NAME|CURRENT|No changes needed")
        return 0
    fi

    echo "  Changes: ${CHANGED_COUNT} files modified/added"

    if $VERBOSE; then
        git -C "$CLONE_DIR" status --short | head -20
        if [ "$CHANGED_COUNT" -gt 20 ]; then
            echo "  ... and $((CHANGED_COUNT - 20)) more"
        fi
    fi

    # Commit
    echo -n "  Committing... "
    git -C "$CLONE_DIR" add templates/
    git -C "$CLONE_DIR" commit -m "$COMMIT_MSG" --quiet
    echo -e "${GREEN}OK${NC}"

    # Push
    if $NO_PUSH; then
        echo -e "  Push: ${YELLOW}SKIPPED (--no-push)${NC}"
        RESULTS+=("$NAME|COMMITTED|${CHANGED_COUNT} files updated, not pushed")
        return 0
    fi

    echo -n "  Pushing to $BRANCH... "
    local RETRY=0
    local MAX_RETRIES=4
    local WAIT=2
    while [ $RETRY -lt $MAX_RETRIES ]; do
        if git -C "$CLONE_DIR" push -u origin "$BRANCH" --quiet 2>/dev/null; then
            echo -e "${GREEN}OK${NC}"
            RESULTS+=("$NAME|SYNCED|${CHANGED_COUNT} files pushed to $BRANCH")
            return 0
        fi
        RETRY=$((RETRY + 1))
        if [ $RETRY -lt $MAX_RETRIES ]; then
            echo -n "retry ${RETRY}... "
            sleep $WAIT
            WAIT=$((WAIT * 2))
        fi
    done

    echo -e "${RED}FAILED${NC} (after ${MAX_RETRIES} retries)"
    RESULTS+=("$NAME|PUSH_FAILED|Committed but push failed after retries")
    return 1
}

# Process each repo
while IFS= read -r line; do
    # Skip the header line
    [[ "$line" == PARENT_VERSION=* ]] && continue

    IFS='|' read -r NAME GITHUB_URL DEFAULT_BRANCH GITHUB_SLUG <<< "$line"

    if sync_repo "$NAME" "$GITHUB_URL" "$DEFAULT_BRANCH" "$GITHUB_SLUG"; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
done < "$REPO_LIST"

# ─────────────────────────────────────────────────────────────────
# SUMMARY REPORT
# ─────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  FLEET SYNC REPORT"
echo "═══════════════════════════════════════════════════════════════"
echo ""

FMT="  %-24s %-14s %s\n"
printf "$FMT" "REPO" "STATUS" "DETAIL"
printf "$FMT" "------------------------" "--------------" "-----------------------------"

for result in "${RESULTS[@]}"; do
    IFS='|' read -r R_NAME R_STATUS R_DETAIL <<< "$result"
    case "$R_STATUS" in
        SYNCED)      STATUS_COLOR="${GREEN}${R_STATUS}${NC}" ;;
        CURRENT)     STATUS_COLOR="${CYAN}${R_STATUS}${NC}" ;;
        DRY-RUN)     STATUS_COLOR="${YELLOW}${R_STATUS}${NC}" ;;
        COMMITTED)   STATUS_COLOR="${YELLOW}${R_STATUS}${NC}" ;;
        FAILED|PUSH_FAILED) STATUS_COLOR="${RED}${R_STATUS}${NC}" ;;
        *)           STATUS_COLOR="$R_STATUS" ;;
    esac
    printf "  %-24s " "$R_NAME"
    echo -e "$STATUS_COLOR    $R_DETAIL"
done

echo ""
echo "───────────────────────────────────────────────────────────────"
echo "  Success: ${SUCCESS_COUNT}  |  Failed: ${FAIL_COUNT}"
echo ""

if $DRY_RUN; then
    echo -e "  ${YELLOW}${BOLD}This was a DRY RUN.${NC} To apply changes, run:"
    echo ""
    if [ -n "$TARGET_REPO" ]; then
        echo "    ./scripts/fleet-sync.sh --apply --repo=${TARGET_REPO}"
    else
        echo "    ./scripts/fleet-sync.sh --apply"
    fi
    echo ""
fi

# Cleanup
rm -rf "$WORK_DIR"

if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0
