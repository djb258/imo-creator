#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# ADR CHECK — ADR Index Audit
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign)
# Purpose: Compare ADR_INDEX.md against actual ADR files in fleet repos
# Usage: ./scripts/adr-check.sh [--verbose]
# Exit: 0 = in sync, 1 = drift detected
# ═══════════════════════════════════════════════════════════════════════════════
#
# This is an AUDIT tool, not enforcement. It reports discrepancies between
# the ADR_INDEX.md and actual ADR files found in repos. It does not block
# anything or auto-fix.
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

INDEX_FILE="$REPO_ROOT/ADR_INDEX.md"
REGISTRY="$REPO_ROOT/FLEET_REGISTRY.yaml"

if [ ! -f "$INDEX_FILE" ]; then
    echo -e "${RED}[ERROR]${NC} ADR_INDEX.md not found at $INDEX_FILE"
    exit 2
fi

if [ ! -f "$REGISTRY" ]; then
    echo -e "${RED}[ERROR]${NC} FLEET_REGISTRY.yaml not found at $REGISTRY"
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

if ! $PYTHON_CMD -c "import yaml" 2>/dev/null; then
    echo -e "${RED}[ERROR]${NC} PyYAML is required. Install: pip install pyyaml"
    exit 2
fi

# ───────────────────────────────────────────────────────────────────
# RUN VIA PYTHON
# ───────────────────────────────────────────────────────────────────
$PYTHON_CMD - "$REPO_ROOT" "$INDEX_FILE" "$REGISTRY" "$VERBOSE" << 'PYTHON_SCRIPT'
import sys
import yaml
import os
import re
import glob

repo_root = sys.argv[1]
index_path = sys.argv[2]
registry_path = sys.argv[3]
verbose = sys.argv[4] == 'True'

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
CYAN = '\033[0;36m'
BOLD = '\033[1m'
NC = '\033[0m'

# ───────────────────────────────────────────────────────────────────
# Parse ADR_INDEX.md — extract ADR entries from the markdown table
# ───────────────────────────────────────────────────────────────────
indexed_adrs = {}  # { "ADR-001": {"repo": "imo-creator", "title": "...", "status": "..."} }

with open(index_path, 'r', encoding='utf-8') as f:
    in_table = False
    for line in f:
        line = line.strip()
        # Detect table rows (starts with | ADR-)
        if line.startswith('| ADR-'):
            parts = [p.strip() for p in line.split('|')]
            # parts[0] is empty (before first |), parts[1] is ADR #, etc.
            if len(parts) >= 7:
                adr_num = parts[1]
                adr_repo = parts[2]
                adr_title = parts[4]
                adr_status = parts[5]
                indexed_adrs[adr_num] = {
                    'repo': adr_repo,
                    'title': adr_title,
                    'status': adr_status
                }

# ───────────────────────────────────────────────────────────────────
# Load fleet registry
# ───────────────────────────────────────────────────────────────────
with open(registry_path, 'r', encoding='utf-8') as f:
    registry = yaml.safe_load(f)

repos = registry.get('fleet', {}).get('repos', [])

# Always include imo-creator itself
all_repos = [{'name': 'imo-creator', 'path': '.'}] + repos

# ───────────────────────────────────────────────────────────────────
# Scan repos for ADR files
# ───────────────────────────────────────────────────────────────────
found_adrs = {}  # { "ADR-001": {"repo": "imo-creator", "path": "templates/adr/ADR-001-..."} }

for repo_entry in all_repos:
    name = repo_entry.get('name', '')
    rel_path = repo_entry.get('path', '')
    status = repo_entry.get('status', 'ACTIVE')

    if status == 'ARCHIVED':
        continue

    if os.path.isabs(rel_path):
        child_path = rel_path
    else:
        child_path = os.path.normpath(os.path.join(repo_root, rel_path))

    if not os.path.isdir(child_path):
        if verbose:
            print(f"  {YELLOW}[SKIP]{NC} {name}: path not found ({child_path})")
        continue

    # Search common ADR locations
    adr_patterns = [
        os.path.join(child_path, 'docs', 'adr', 'ADR-*.md'),
        os.path.join(child_path, 'docs', 'adr', 'adr-*.md'),
        os.path.join(child_path, 'adr', 'ADR-*.md'),
        os.path.join(child_path, 'templates', 'adr', 'ADR-*-*.md'),  # imo-creator pattern
    ]

    for pattern in adr_patterns:
        for filepath in glob.glob(pattern):
            filename = os.path.basename(filepath)
            # Extract ADR number (ADR-001, ADR-002, etc.)
            match = re.match(r'(ADR-\d+)', filename, re.IGNORECASE)
            if match:
                adr_num = match.group(1).upper()
                rel_file = os.path.relpath(filepath, child_path)
                found_adrs[adr_num] = {
                    'repo': name,
                    'path': rel_file,
                    'full_path': filepath
                }

# ───────────────────────────────────────────────────────────────────
# Compare
# ───────────────────────────────────────────────────────────────────
missing_from_index = []  # Found in repos but not in ADR_INDEX.md
missing_from_repos = []  # In ADR_INDEX.md but file not found

for adr_num, info in sorted(found_adrs.items()):
    if adr_num not in indexed_adrs:
        missing_from_index.append((adr_num, info['repo'], info['path']))

for adr_num, info in sorted(indexed_adrs.items()):
    if adr_num not in found_adrs:
        # Only flag if status is not REJECTED or SUPERSEDED (those might have been removed)
        if info['status'] not in ('REJECTED', 'SUPERSEDED'):
            missing_from_repos.append((adr_num, info['repo'], info['title']))

# ───────────────────────────────────────────────────────────────────
# Report
# ───────────────────────────────────────────────────────────────────
print()
print("=" * 60)
print("  ADR INDEX AUDIT")
print("=" * 60)
print()
print(f"  Total indexed:         {len(indexed_adrs)}")
print(f"  Total found in repos:  {len(found_adrs)}")
print(f"  Repos scanned:         {len(all_repos)}")
print()

if missing_from_index:
    print(f"  {YELLOW}MISSING FROM INDEX{NC} (found in repos, not in ADR_INDEX.md):")
    for adr_num, repo, path in missing_from_index:
        print(f"    - {repo}: {adr_num} ({path})")
    print()

if missing_from_repos:
    print(f"  {YELLOW}MISSING FROM REPOS{NC} (in ADR_INDEX.md, file not found):")
    for adr_num, repo, title in missing_from_repos:
        print(f"    - {adr_num}: declared in {repo}, file not found")
        if verbose:
            print(f"      Title: {title}")
    print()

if not missing_from_index and not missing_from_repos:
    print(f"  {GREEN}INDEX STATUS: IN SYNC{NC}")
    print()
    print("  All indexed ADRs have corresponding files.")
    print("  All ADR files found in repos are indexed.")
    print()
    sys.exit(0)
else:
    drift_count = len(missing_from_index) + len(missing_from_repos)
    print(f"  {YELLOW}INDEX STATUS: DRIFT DETECTED ({drift_count} discrepancies){NC}")
    print()
    print("  Update ADR_INDEX.md to match reality.")
    print()
    sys.exit(1)
PYTHON_SCRIPT
