# ═══════════════════════════════════════════════════════════════════════════════
# FLEET STATUS — Child Repo Doctrine Health Check (Windows)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign)
# Purpose: Walk FLEET_REGISTRY.yaml and report doctrine version status per repo
# Usage: .\scripts\fleet-status.ps1 [-Verbose]
# Exit: 0 = all repos CURRENT, 1 = STALE or MISSING repos found
# ═══════════════════════════════════════════════════════════════════════════════

param(
    [switch]$VerboseOutput
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Registry = Join-Path $RepoRoot "FLEET_REGISTRY.yaml"
$Manifest = Join-Path $RepoRoot "templates\TEMPLATES_MANIFEST.yaml"

if (-not (Test-Path $Registry)) {
    Write-Host "[ERROR] FLEET_REGISTRY.yaml not found at $Registry" -ForegroundColor Red
    exit 2
}

if (-not (Test-Path $Manifest)) {
    Write-Host "[ERROR] TEMPLATES_MANIFEST.yaml not found at $Manifest" -ForegroundColor Red
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

$verboseStr = if ($VerboseOutput) { "True" } else { "False" }

$pythonScript = @"
import sys
import yaml
import os
import re
from datetime import datetime, timezone

repo_root = sys.argv[1]
registry_path = sys.argv[2]
manifest_path = sys.argv[3]
verbose = sys.argv[4] == 'True'

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

    if repo_status == 'ARCHIVED':
        archived_count += 1
        print(fmt.format(name, "---", "---", "---", "ARCHIVED"))
        continue

    if os.path.isabs(rel_path):
        child_path = rel_path
    else:
        child_path = os.path.normpath(os.path.join(repo_root, rel_path))

    doctrine_path = os.path.join(child_path, 'DOCTRINE.md')
    if not os.path.isdir(child_path):
        missing_count += 1
        print(fmt.format(name, "[N/A]", parent_version, "[NEVER]", "MISSING"))
        actions.append(f"{name}: Verify path or update FLEET_REGISTRY.yaml (path: {rel_path})")
        continue

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

    if child_version == parent_version:
        current_count += 1
        status_str = "CURRENT"
    elif child_version == "unknown" or child_version.startswith('['):
        stale_count += 1
        status_str = "UNKNOWN"
        actions.append(f"{name}: Run update_from_imo_creator.ps1 (version unknown)")
    else:
        stale_count += 1
        status_str = "STALE"
        actions.append(f"{name}: Run update_from_imo_creator.ps1 ({child_version} -> {parent_version})")

    last_synced_display = "[NEVER]" if last_synced.startswith('[') else last_synced[:10]
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
    print("  FLEET STATUS: ATTENTION REQUIRED")
    sys.exit(1)
else:
    print("  FLEET STATUS: ALL CURRENT")
    sys.exit(0)
"@

$tempFile = [System.IO.Path]::GetTempFileName() + ".py"
$pythonScript | Out-File -FilePath $tempFile -Encoding utf8

try {
    & $pythonCmd $tempFile $RepoRoot $Registry $Manifest $verboseStr
    $exitCode = $LASTEXITCODE
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

exit $exitCode
