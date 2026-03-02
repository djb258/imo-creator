# ═══════════════════════════════════════════════════════════════════════════════
# FLEET SECRETS SYNC — Push Secrets from Sovereign Vault to Child Projects (Windows)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign CC-01)
# Purpose: Read FLEET_SECRETS_MANIFEST.yaml, compare vault vs child, sync drift
# Usage: .\scripts\fleet-secrets-sync.ps1 [-DryRun] [-Apply] [-Verbose] [-Child NAME]
# Exit: 0 = all synced/current, 1 = drift detected (dry-run) or sync errors, 2 = fatal
# ═══════════════════════════════════════════════════════════════════════════════

param(
    [switch]$DryRun,
    [switch]$Apply,
    [switch]$VerboseOutput,
    [string]$Child = ""
)

$ErrorActionPreference = "Stop"

# Default to dry-run if neither flag set
if (-not $Apply) { $DryRun = $true }
$modeStr = if ($Apply) { "apply" } else { "dry-run" }

$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Manifest = Join-Path $RepoRoot "FLEET_SECRETS_MANIFEST.yaml"

if (-not (Test-Path $Manifest)) {
    Write-Host "[ERROR] FLEET_SECRETS_MANIFEST.yaml not found at $Manifest" -ForegroundColor Red
    exit 2
}

# Dependency check
$pythonCmd = $null
if (Get-Command python3 -ErrorAction SilentlyContinue) { $pythonCmd = "python3" }
elseif (Get-Command python -ErrorAction SilentlyContinue) { $pythonCmd = "python" }
else {
    Write-Host "[ERROR] python3 is required but not installed" -ForegroundColor Red
    exit 2
}

$yamlTest = & $pythonCmd -c "import yaml; print('ok')" 2>&1
if ($yamlTest -ne "ok") {
    Write-Host "[ERROR] PyYAML is required. Install: pip install pyyaml" -ForegroundColor Red
    exit 2
}

if (-not (Get-Command doppler -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Doppler CLI is required but not installed" -ForegroundColor Red
    exit 2
}

$verboseStr = if ($VerboseOutput) { "True" } else { "False" }

$pythonScript = @"
import sys
import yaml
import subprocess
import json
from datetime import datetime, timezone

manifest_path = sys.argv[1]
mode = sys.argv[2]
verbose = sys.argv[3] == 'True'
child_filter = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else ""

with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = yaml.safe_load(f)

vault_project = manifest.get('vault', {}).get('doppler_project', 'imo-creator')
children = manifest.get('children', {})
global_secrets = manifest.get('global', {}).get('secrets', [])

def doppler_get_all(project, config):
    try:
        result = subprocess.run(
            ['doppler', 'secrets', '--json', '--project', project, '--config', config],
            capture_output=True, text=True, timeout=60
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            return {k: v.get('computed', '') for k, v in data.items()}
        return {}
    except Exception:
        return {}

def doppler_set_secret(project, config, name, value):
    try:
        result = subprocess.run(
            ['doppler', 'secrets', 'set', f'{name}={value}', '--project', project, '--config', config],
            capture_output=True, text=True, timeout=30
        )
        return result.returncode == 0
    except Exception:
        return False

print()
print("=" * 67)
if mode == "apply":
    print("  FLEET SECRETS SYNC - APPLY MODE")
else:
    print("  FLEET SECRETS SYNC - DRY RUN")
print("=" * 67)
print()
print(f"  Date:             {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}")
print(f"  Vault project:    {vault_project}")
print(f"  Mode:             {mode}")
if child_filter:
    print(f"  Filter:           {child_filter}")
print()

print(f"  Loading vault secrets from {vault_project}/dev...")
vault_secrets = doppler_get_all(vault_project, 'dev')
if not vault_secrets:
    print("  [ERROR] Could not load vault secrets")
    sys.exit(2)
print(f"  Loaded {len(vault_secrets)} vault secrets")
print()

total_synced = 0
total_current = 0
total_missing = 0
total_errors = 0
child_results = []

for child_name, child_conf in children.items():
    if child_filter and child_name != child_filter:
        continue

    child_project = child_conf.get('doppler_project', child_name)
    prefix = child_conf.get('prefix', '')
    child_secrets = child_conf.get('secrets', [])
    status = child_conf.get('status', 'ACTIVE')

    if status != 'ACTIVE':
        print(f"  [SKIP] {child_name} (status: {status})")
        continue

    print("-" * 67)
    print(f"  {child_name}")
    print(f"  project: {child_project}  prefix: {prefix}")
    print()

    child_current_secrets = doppler_get_all(child_project, 'dev')
    if not child_current_secrets:
        print(f"  [WARN] Could not load secrets from {child_project}/dev")

    child_synced = 0
    child_current_count = 0
    child_missing_count = 0
    child_error_count = 0

    for gs in global_secrets:
        push_to = gs.get('push_to', [])
        if child_name not in push_to:
            continue
        vault_name = gs.get('vault_name', '')
        child_key = gs.get('child_name', '')
        vault_val = vault_secrets.get(vault_name, '')
        child_val = child_current_secrets.get(child_key, '')

        if not vault_val:
            child_missing_count += 1
            if verbose:
                print(f"    [VAULT EMPTY]  {vault_name} -> {child_key}")
            continue

        if vault_val == child_val:
            child_current_count += 1
            if verbose:
                print(f"    [CURRENT]      {vault_name} -> {child_key}")
        else:
            if mode == "apply":
                ok = doppler_set_secret(child_project, 'dev', child_key, vault_val)
                if ok:
                    child_synced += 1
                    print(f"    [SYNCED]       {vault_name} -> {child_key}")
                else:
                    child_error_count += 1
                    print(f"    [ERROR]        {vault_name} -> {child_key}")
            else:
                child_synced += 1
                drift_type = "NEW" if not child_val else "DRIFT"
                print(f"    [{drift_type}]        {vault_name} -> {child_key}")

    for cs in child_secrets:
        vault_name = cs.get('vault_name', '')
        child_key = cs.get('child_name', '')
        vault_val = vault_secrets.get(vault_name, '')
        child_val = child_current_secrets.get(child_key, '')

        if not vault_val:
            child_missing_count += 1
            if verbose:
                print(f"    [VAULT EMPTY]  {vault_name} -> {child_key}")
            continue

        if vault_val == child_val:
            child_current_count += 1
            if verbose:
                print(f"    [CURRENT]      {vault_name} -> {child_key}")
        else:
            if mode == "apply":
                ok = doppler_set_secret(child_project, 'dev', child_key, vault_val)
                if ok:
                    child_synced += 1
                    print(f"    [SYNCED]       {vault_name} -> {child_key}")
                else:
                    child_error_count += 1
                    print(f"    [ERROR]        {vault_name} -> {child_key}")
            else:
                child_synced += 1
                drift_type = "NEW" if not child_val else "DRIFT"
                print(f"    [{drift_type}]        {vault_name} -> {child_key}")

    print()
    verb = "synced" if mode == "apply" else "would sync"
    print(f"    CURRENT: {child_current_count}  {verb.upper()}: {child_synced}  VAULT EMPTY: {child_missing_count}  ERRORS: {child_error_count}")

    total_synced += child_synced
    total_current += child_current_count
    total_missing += child_missing_count
    total_errors += child_error_count
    child_results.append({
        'name': child_name,
        'synced': child_synced,
        'current': child_current_count,
        'missing': child_missing_count,
        'errors': child_error_count
    })

print()
print("=" * 67)
print("  SUMMARY")
print("=" * 67)
print()

fmt = "  {:<22} {:>8} {:>8} {:>12} {:>8}"
print(fmt.format("CHILD", "CURRENT", "SYNC", "VAULT EMPTY", "ERRORS"))
print(fmt.format("-" * 22, "-" * 8, "-" * 8, "-" * 12, "-" * 8))

for r in child_results:
    print(fmt.format(r['name'], str(r['current']), str(r['synced']), str(r['missing']), str(r['errors'])))

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
    print("  SYNC STATUS: ERRORS DETECTED")
    sys.exit(1)
elif total_synced > 0 and mode == "dry-run":
    print("  SYNC STATUS: DRIFT DETECTED -- run with --apply to sync")
    sys.exit(1)
elif total_synced > 0 and mode == "apply":
    print("  SYNC STATUS: SECRETS PUSHED SUCCESSFULLY")
    sys.exit(0)
else:
    print("  SYNC STATUS: ALL CURRENT")
    sys.exit(0)
"@

$tempFile = [System.IO.Path]::GetTempFileName() + ".py"
$pythonScript | Out-File -FilePath $tempFile -Encoding utf8

try {
    & $pythonCmd $tempFile $Manifest $modeStr $verboseStr $Child
    $exitCode = $LASTEXITCODE
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

exit $exitCode
