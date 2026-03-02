#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# FLEET SECRETS SYNC — Push Secrets from Sovereign Vault to Child Projects
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign CC-01)
# Purpose: Read FLEET_SECRETS_MANIFEST.yaml, compare vault vs child, sync drift
# Usage: ./scripts/fleet-secrets-sync.sh [--dry-run] [--apply] [--verbose] [--child=NAME]
# Exit: 0 = all synced/current, 1 = drift detected (dry-run) or sync errors, 2 = fatal
# ═══════════════════════════════════════════════════════════════════════════════
#
# MODES:
#   --dry-run   (default)  Report what would sync, no writes
#   --apply                Execute doppler secrets set to push from vault to children
#   --verbose              Show each secret name during comparison
#   --child=NAME           Sync only one child (e.g. --child=barton-outreach-core)
#
# SAFETY:
#   - Default is dry-run. Must explicitly pass --apply to write.
#   - Never touches sovereign-only secrets.
#   - Validates manifest + Doppler CLI before running.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

MODE="dry-run"
VERBOSE=false
CHILD_FILTER=""

for arg in "$@"; do
    case "$arg" in
        --dry-run) MODE="dry-run" ;;
        --apply) MODE="apply" ;;
        --verbose) VERBOSE=true ;;
        --child=*) CHILD_FILTER="${arg#--child=}" ;;
        *) echo -e "${RED}[ERROR]${NC} Unknown argument: $arg"; exit 2 ;;
    esac
done

# ───────────────────────────────────────────────────────────────────
# LOCATE FILES
# ───────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

MANIFEST="$REPO_ROOT/FLEET_SECRETS_MANIFEST.yaml"

if [ ! -f "$MANIFEST" ]; then
    echo -e "${RED}[ERROR]${NC} FLEET_SECRETS_MANIFEST.yaml not found at $MANIFEST"
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

if ! command -v doppler &>/dev/null; then
    echo -e "${RED}[ERROR]${NC} Doppler CLI is required but not installed"
    exit 2
fi

# ───────────────────────────────────────────────────────────────────
# NORMALIZE VERBOSE FOR PYTHON
# ───────────────────────────────────────────────────────────────────
if [ "$VERBOSE" = "true" ]; then
    VERBOSE_PY="True"
else
    VERBOSE_PY="False"
fi

# ───────────────────────────────────────────────────────────────────
# RUN VIA PYTHON (reliable YAML parsing + Doppler CLI calls)
# ───────────────────────────────────────────────────────────────────
$PYTHON_CMD - "$MANIFEST" "$MODE" "$VERBOSE_PY" "$CHILD_FILTER" << 'PYTHON_SCRIPT'
import sys
import yaml
import subprocess
import json
from datetime import datetime, timezone

manifest_path = sys.argv[1]
mode = sys.argv[2]
verbose = sys.argv[3] == 'True'
child_filter = sys.argv[4] if len(sys.argv) > 4 else ""

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
CYAN = '\033[0;36m'
BOLD = '\033[1m'
NC = '\033[0m'

# ─── Load manifest ──────────────────────────────────────────────────────────
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = yaml.safe_load(f)

vault_project = manifest.get('vault', {}).get('doppler_project', 'imo-creator')
children = manifest.get('children', {})
global_secrets = manifest.get('global', {}).get('secrets', [])

# ─── Helpers ────────────────────────────────────────────────────────────────
def doppler_get_secret(project, config, name):
    """Get a single secret value from Doppler. Returns None if not found."""
    try:
        result = subprocess.run(
            ['doppler', 'secrets', 'get', name, '--plain',
             '--project', project, '--config', config],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            return result.stdout.strip()
        return None
    except (subprocess.TimeoutExpired, Exception):
        return None

def doppler_set_secret(project, config, name, value):
    """Set a single secret in Doppler. Returns True on success."""
    try:
        result = subprocess.run(
            ['doppler', 'secrets', 'set', f'{name}={value}',
             '--project', project, '--config', config],
            capture_output=True, text=True, timeout=30
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, Exception):
        return False

def doppler_get_all(project, config):
    """Get all secrets from a Doppler project/config as dict."""
    try:
        result = subprocess.run(
            ['doppler', 'secrets', '--json',
             '--project', project, '--config', config],
            capture_output=True, text=True, timeout=60
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            return {k: v.get('computed', '') for k, v in data.items()}
        return {}
    except (subprocess.TimeoutExpired, json.JSONDecodeError, Exception):
        return {}

# ─── Header ─────────────────────────────────────────────────────────────────
print()
print("=" * 67)
if mode == "apply":
    print(f"  FLEET SECRETS SYNC — {RED}APPLY MODE{NC}")
else:
    print(f"  FLEET SECRETS SYNC — {CYAN}DRY RUN{NC}")
print("=" * 67)
print()
print(f"  Date:             {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}")
print(f"  Vault project:    {vault_project}")
print(f"  Mode:             {mode}")
if child_filter:
    print(f"  Filter:           {child_filter}")
print()

# ─── Load vault secrets ─────────────────────────────────────────────────────
print(f"  Loading vault secrets from {vault_project}/dev...")
vault_secrets = doppler_get_all(vault_project, 'dev')
if not vault_secrets:
    print(f"  {RED}[ERROR]{NC} Could not load vault secrets")
    sys.exit(2)
print(f"  Loaded {len(vault_secrets)} vault secrets")
print()

# ─── Counters ───────────────────────────────────────────────────────────────
total_synced = 0
total_current = 0
total_missing = 0
total_errors = 0
child_results = []

# ─── Process each child ────────────────────────────────────────────────────
for child_name, child_conf in children.items():
    if child_filter and child_name != child_filter:
        continue

    child_project = child_conf.get('doppler_project', child_name)
    prefix = child_conf.get('prefix', '')
    child_secrets = child_conf.get('secrets', [])
    status = child_conf.get('status', 'ACTIVE')

    if status != 'ACTIVE':
        print(f"  {CYAN}[SKIP]{NC} {child_name} (status: {status})")
        continue

    print("-" * 67)
    print(f"  {BOLD}{child_name}{NC}")
    print(f"  project: {child_project}  prefix: {prefix}")
    print()

    # Load child's current secrets
    child_current = doppler_get_all(child_project, 'dev')
    if not child_current:
        print(f"  {YELLOW}[WARN]{NC} Could not load secrets from {child_project}/dev")

    child_synced = 0
    child_current_count = 0
    child_missing = 0
    child_errors = 0

    # ─── Global secrets for this child ──────────────────────────────────
    for gs in global_secrets:
        push_to = gs.get('push_to', [])
        if child_name not in push_to:
            continue

        vault_name = gs.get('vault_name', '')
        child_key = gs.get('child_name', '')
        vault_val = vault_secrets.get(vault_name, '')
        child_val = child_current.get(child_key, '')

        if not vault_val:
            child_missing += 1
            if verbose:
                print(f"    {YELLOW}[VAULT EMPTY]{NC}  {vault_name} -> {child_key}")
            continue

        if vault_val == child_val:
            child_current_count += 1
            if verbose:
                print(f"    {GREEN}[CURRENT]{NC}      {vault_name} -> {child_key}")
        else:
            if mode == "apply":
                ok = doppler_set_secret(child_project, 'dev', child_key, vault_val)
                if ok:
                    child_synced += 1
                    print(f"    {GREEN}[SYNCED]{NC}       {vault_name} -> {child_key}")
                else:
                    child_errors += 1
                    print(f"    {RED}[ERROR]{NC}        {vault_name} -> {child_key}")
            else:
                child_synced += 1
                drift_type = "NEW" if not child_val else "DRIFT"
                print(f"    {YELLOW}[{drift_type}]{NC}        {vault_name} -> {child_key}")

    # ─── Child-scoped secrets ───────────────────────────────────────────
    for cs in child_secrets:
        vault_name = cs.get('vault_name', '')
        child_key = cs.get('child_name', '')
        vault_val = vault_secrets.get(vault_name, '')
        child_val = child_current.get(child_key, '')

        if not vault_val:
            child_missing += 1
            if verbose:
                print(f"    {YELLOW}[VAULT EMPTY]{NC}  {vault_name} -> {child_key}")
            continue

        if vault_val == child_val:
            child_current_count += 1
            if verbose:
                print(f"    {GREEN}[CURRENT]{NC}      {vault_name} -> {child_key}")
        else:
            if mode == "apply":
                ok = doppler_set_secret(child_project, 'dev', child_key, vault_val)
                if ok:
                    child_synced += 1
                    print(f"    {GREEN}[SYNCED]{NC}       {vault_name} -> {child_key}")
                else:
                    child_errors += 1
                    print(f"    {RED}[ERROR]{NC}        {vault_name} -> {child_key}")
            else:
                child_synced += 1
                drift_type = "NEW" if not child_val else "DRIFT"
                print(f"    {YELLOW}[{drift_type}]{NC}        {vault_name} -> {child_key}")

    # Child summary
    print()
    verb = "synced" if mode == "apply" else "would sync"
    print(f"    CURRENT: {child_current_count}  {verb.upper()}: {child_synced}  VAULT EMPTY: {child_missing}  ERRORS: {child_errors}")

    total_synced += child_synced
    total_current += child_current_count
    total_missing += child_missing
    total_errors += child_errors
    child_results.append({
        'name': child_name,
        'synced': child_synced,
        'current': child_current_count,
        'missing': child_missing,
        'errors': child_errors
    })

# ─── Summary ────────────────────────────────────────────────────────────────
print()
print("=" * 67)
print("  SUMMARY")
print("=" * 67)
print()

fmt = "  {:<22} {:>8} {:>8} {:>12} {:>8}"
print(fmt.format("CHILD", "CURRENT", "SYNC", "VAULT EMPTY", "ERRORS"))
print(fmt.format("-" * 22, "-" * 8, "-" * 8, "-" * 12, "-" * 8))

for r in child_results:
    sync_label = str(r['synced'])
    print(fmt.format(r['name'], str(r['current']), sync_label, str(r['missing']), str(r['errors'])))

print()
print(f"  Total current:    {total_current}")
if mode == "apply":
    print(f"  Total synced:     {total_synced}")
else:
    print(f"  Total would sync: {total_synced}")
print(f"  Total vault empty:{total_missing}")
print(f"  Total errors:     {total_errors}")
print()

if total_errors > 0:
    print(f"  {RED}{BOLD}SYNC STATUS: ERRORS DETECTED{NC}")
    print()
    sys.exit(1)
elif total_synced > 0 and mode == "dry-run":
    print(f"  {YELLOW}{BOLD}SYNC STATUS: DRIFT DETECTED — run with --apply to sync{NC}")
    print()
    sys.exit(1)
elif total_synced > 0 and mode == "apply":
    print(f"  {GREEN}{BOLD}SYNC STATUS: SECRETS PUSHED SUCCESSFULLY{NC}")
    print()
    sys.exit(0)
else:
    print(f"  {GREEN}SYNC STATUS: ALL CURRENT{NC}")
    print()
    sys.exit(0)
PYTHON_SCRIPT
