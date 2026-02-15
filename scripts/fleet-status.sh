#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# FLEET STATUS — Child Repo Doctrine Health Check
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign)
# Purpose: Walk FLEET_REGISTRY.yaml and report doctrine version status per repo
# Usage: ./scripts/fleet-status.sh [--verbose]
# Exit: 0 = all repos CURRENT, 1 = STALE or MISSING repos found
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script runs FROM imo-creator and checks each child repo listed in
# FLEET_REGISTRY.yaml. It reads each child's DOCTRINE.md to get its version
# and compares against the parent manifest version.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

VERBOSE=false
for arg in "$@"; do
    case "$arg" in
        --verbose) VERBOSE=true ;;
        *) echo -e "${RED}[ERROR]${NC} Unknown argument: $arg"; exit 2 ;;
    esac
done

# ───────────────────────────────────────────────────────────────────
# LOCATE FILES
# ───────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

REGISTRY="$REPO_ROOT/FLEET_REGISTRY.yaml"
MANIFEST="$REPO_ROOT/templates/TEMPLATES_MANIFEST.yaml"

if [ ! -f "$REGISTRY" ]; then
    echo -e "${RED}[ERROR]${NC} FLEET_REGISTRY.yaml not found at $REGISTRY"
    exit 2
fi

if [ ! -f "$MANIFEST" ]; then
    echo -e "${RED}[ERROR]${NC} TEMPLATES_MANIFEST.yaml not found at $MANIFEST"
    exit 2
fi

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ───────────────────────────────────────────────────────────────────
PYTHON_CMD=""
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo -e "${RED}[ERROR]${NC} python3 is required but not installed"
    exit 2
fi

# Verify PyYAML
if ! $PYTHON_CMD -c "import yaml" 2>/dev/null; then
    echo -e "${RED}[ERROR]${NC} PyYAML is required. Install: pip install pyyaml"
    exit 2
fi

# ───────────────────────────────────────────────────────────────────
# RUN VIA PYTHON (reliable YAML parsing)
# ───────────────────────────────────────────────────────────────────
$PYTHON_CMD - "$REPO_ROOT" "$REGISTRY" "$MANIFEST" "$VERBOSE" << 'PYTHON_SCRIPT'
import sys
import yaml
import os
import re
from datetime import datetime, timezone

repo_root = sys.argv[1]
registry_path = sys.argv[2]
manifest_path = sys.argv[3]
verbose = sys.argv[4] == 'True'

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
CYAN = '\033[0;36m'
BOLD = '\033[1m'
NC = '\033[0m'

# Load files
with open(registry_path, 'r', encoding='utf-8') as f:
    registry = yaml.safe_load(f)

with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = yaml.safe_load(f)

parent_version = manifest.get('manifest', {}).get('version', 'unknown')
repos = registry.get('fleet', {}).get('repos', [])

print()
print("=" * 67)
print("  FLEET STATUS REPORT")
print("=" * 67)
print()
print(f"  Date:             {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}")
print(f"  Parent doctrine:  v{parent_version}")
print(f"  Fleet size:       {len(repos)} repos")
print()
print("-" * 67)

# Results storage
results = []
current_count = 0
stale_count = 0
missing_count = 0
archived_count = 0
actions = []

fmt = "  {:<22} {:<10} {:<10} {:<13} {}"

print(fmt.format("REPO", "CHILD", "PARENT", "LAST SYNCED", "STATUS"))
print(fmt.format("-" * 22, "-" * 10, "-" * 10, "-" * 13, "-" * 10))

for repo in repos:
    name = repo.get('name', 'unknown')
    rel_path = repo.get('path', '')
    repo_status = repo.get('status', 'ACTIVE')

    # Skip archived repos
    if repo_status == 'ARCHIVED':
        archived_count += 1
        print(fmt.format(name, "---", "---", "---", f"{CYAN}ARCHIVED{NC}"))
        continue

    # Resolve path relative to imo-creator root
    if os.path.isabs(rel_path):
        child_path = rel_path
    else:
        child_path = os.path.normpath(os.path.join(repo_root, rel_path))

    # Check if repo exists
    doctrine_path = os.path.join(child_path, 'DOCTRINE.md')
    if not os.path.isdir(child_path):
        missing_count += 1
        print(fmt.format(name, "[N/A]", parent_version, "[NEVER]", f"{RED}MISSING{NC}"))
        actions.append(f"{name}: Verify path or update FLEET_REGISTRY.yaml (path: {rel_path})")
        continue

    # Read child doctrine version
    child_version = "unknown"
    last_synced = repo.get('last_synced', '[NEVER]')

    if os.path.isfile(doctrine_path):
        with open(doctrine_path, 'r', encoding='utf-8') as f:
            for line in f:
                if 'Doctrine Version' in line:
                    parts = line.split('|')
                    if len(parts) >= 3:
                        child_version = parts[2].strip().replace('*', '').strip()
                    break

    # Determine status
    if child_version == parent_version:
        current_count += 1
        status_str = f"{GREEN}CURRENT{NC}"
    elif child_version == "unknown" or child_version.startswith('['):
        stale_count += 1
        status_str = f"{RED}UNKNOWN{NC}"
        actions.append(f"{name}: Run update_from_imo_creator.sh (version unknown)")
    else:
        stale_count += 1
        status_str = f"{YELLOW}STALE{NC}"
        actions.append(f"{name}: Run update_from_imo_creator.sh ({child_version} -> {parent_version})")

    # Format last_synced
    if last_synced.startswith('['):
        last_synced_display = "[NEVER]"
    else:
        last_synced_display = last_synced[:10] if len(last_synced) >= 10 else last_synced

    print(fmt.format(name, child_version, parent_version, last_synced_display, status_str))

    if verbose and child_version != parent_version:
        print(f"         Path: {child_path}")

print()
print("-" * 67)
print(f"  CURRENT:  {current_count} repos up to date")
print(f"  STALE:    {stale_count} repos behind current doctrine")
print(f"  MISSING:  {missing_count} repos not found at declared path")
if archived_count > 0:
    print(f"  ARCHIVED: {archived_count} repos (skipped)")
print()

if actions:
    print("  RECOMMENDED ACTIONS:")
    for i, action in enumerate(actions, 1):
        print(f"  {i}. {action}")
    print()

if stale_count > 0 or missing_count > 0:
    print(f"  {RED}{BOLD}FLEET STATUS: ATTENTION REQUIRED{NC}")
    print()
    sys.exit(1)
else:
    print(f"  {GREEN}FLEET STATUS: ALL CURRENT{NC}")
    print()
    sys.exit(0)
PYTHON_SCRIPT
