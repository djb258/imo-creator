# ═══════════════════════════════════════════════════════════════════════════════
# UPDATE FROM IMO-CREATOR — Manifest-Driven Doctrine Sync (Windows)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Sync child repo doctrine with parent imo-creator using manifest rules
# Usage: .\scripts\update_from_imo_creator.ps1 [-Path C:\path\to\imo-creator] [-Force]
# Exit: 0 = success, 1 = error, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════

param(
    [string]$Path = "",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==================================================================="
Write-Host "  UPDATE FROM IMO-CREATOR"
Write-Host "==================================================================="
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# GUARD: Do not run from imo-creator itself
# ───────────────────────────────────────────────────────────────────
$RepoName = Split-Path -Leaf (git rev-parse --show-toplevel 2>$null)
if ($RepoName -eq "imo-creator") {
    Write-Host "[ERROR] This script runs FROM a child repo, not from imo-creator" -ForegroundColor Red
    Write-Host "        Navigate to a child repo first, then run this script."
    exit 1
}

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK — requires python3 with PyYAML
# ───────────────────────────────────────────────────────────────────
$pythonCmd = $null
if (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} else {
    Write-Host "[ERROR] python3 is required but not installed" -ForegroundColor Red
    Write-Host "        Install: https://www.python.org/downloads/"
    exit 2
}

$yamlTest = & $pythonCmd -c "import yaml; print('ok')" 2>&1
if ($yamlTest -ne "ok") {
    Write-Host "[ERROR] PyYAML is required but not installed" -ForegroundColor Red
    Write-Host "        Install: pip install pyyaml"
    exit 2
}

# ───────────────────────────────────────────────────────────────────
# STEP 1: Locate imo-creator
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Step 1: Locate imo-creator --------------------------------"

$ImoPath = $null

if ($Path -and (Test-Path "$Path\templates\doctrine")) {
    $ImoPath = $Path
}

if (-not $ImoPath) {
    $SearchPaths = @(
        "..\imo-creator",
        "..\..\imo-creator",
        "$env:USERPROFILE\Desktop\Cursor Builds\imo-creator"
    )

    foreach ($sp in $SearchPaths) {
        if (Test-Path "$sp\templates\doctrine") {
            $ImoPath = (Resolve-Path $sp).Path
            break
        }
    }
}

if (-not $ImoPath) {
    Write-Host "[ERROR] Cannot find imo-creator" -ForegroundColor Red
    Write-Host "        Usage: .\scripts\update_from_imo_creator.ps1 -Path C:\path\to\imo-creator"
    exit 1
}

$Manifest = Join-Path $ImoPath "templates\TEMPLATES_MANIFEST.yaml"
if (-not (Test-Path $Manifest)) {
    Write-Host "[ERROR] TEMPLATES_MANIFEST.yaml not found in imo-creator" -ForegroundColor Red
    exit 1
}

Write-Host "  [OK] imo-creator: $ImoPath" -ForegroundColor Green
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# RUN SYNC VIA PYTHON
# ───────────────────────────────────────────────────────────────────
# Delegate to Python for reliable YAML parsing and sync logic.

$pythonScript = @"
import sys
import yaml
import os
import shutil
import re
from datetime import datetime, timezone

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
CYAN = '\033[0;36m'
NC = '\033[0m'

imo_path = sys.argv[1]
manifest_path = sys.argv[2]
force = sys.argv[3] == 'true'
child_root = os.getcwd()

synced = 0
created = 0
skipped = 0
new_files = []

with open(manifest_path, 'r', encoding='utf-8') as f:
    data = yaml.safe_load(f)

parent_version = data.get('manifest', {}).get('version', 'unknown')
print(f'--- Step 2: Version comparison --------------------------------')
print(f'  Parent version: {parent_version}')

child_version = 'unknown'
doctrine_path = os.path.join(child_root, 'DOCTRINE.md')
if os.path.isfile(doctrine_path):
    with open(doctrine_path, 'r', encoding='utf-8') as f:
        for line in f:
            if 'Doctrine Version' in line:
                parts = line.split('|')
                if len(parts) >= 3:
                    child_version = parts[2].strip().replace('*', '').strip()
                break

print(f'  Child version:  {child_version}')

if parent_version == child_version and not force:
    print(f'\n  {GREEN}[OK]{NC} Already current (v{parent_version})')
    print('       Use -Force to sync anyway')
    sys.exit(0)

if force and parent_version == child_version:
    print(f'  {YELLOW}[FORCE]{NC} Versions match but -Force specified')

print()

update = data.get('update_manifest', {})

# Step 3: always_sync
print('--- Step 3: Sync always_sync files (overwrite) ----------------')
always_files = update.get('always_sync', {}).get('files', []) or []
for entry in always_files:
    if not isinstance(entry, dict):
        continue
    src_rel = entry.get('source', '')
    dst_rel = entry.get('destination', '')
    src_full = os.path.join(imo_path, src_rel)
    dst_full = os.path.join(child_root, dst_rel)

    if not os.path.isfile(src_full):
        print(f'  {YELLOW}[SKIP]{NC} Source missing: {src_rel}')
        continue

    if not os.path.isfile(dst_full):
        new_files.append(dst_rel)

    dst_dir = os.path.dirname(dst_full)
    if dst_dir and not os.path.isdir(dst_dir):
        os.makedirs(dst_dir, exist_ok=True)

    shutil.copy2(src_full, dst_full)
    synced += 1
    print(f'  {GREEN}[SYNC]{NC} {dst_rel}')

print()

# Step 4: sync_if_missing
print('--- Step 4: Sync sync_if_missing files ------------------------')
missing_files = update.get('sync_if_missing', {}).get('files', []) or []
for entry in missing_files:
    if not isinstance(entry, dict):
        continue
    src_rel = entry.get('source', '')
    dst_rel = entry.get('destination', '')
    src_full = os.path.join(imo_path, src_rel)
    dst_full = os.path.join(child_root, dst_rel)

    if not os.path.isfile(src_full):
        print(f'  {YELLOW}[SKIP]{NC} Source missing: {src_rel}')
        continue

    if os.path.isfile(dst_full):
        skipped += 1
        print(f'  {CYAN}[EXISTS]{NC} {dst_rel} (preserved)')
    else:
        dst_dir = os.path.dirname(dst_full)
        if dst_dir and not os.path.isdir(dst_dir):
            os.makedirs(dst_dir, exist_ok=True)
        shutil.copy2(src_full, dst_full)
        created += 1
        new_files.append(dst_rel)
        print(f'  {GREEN}[CREATE]{NC} {dst_rel}')

print()

# Step 5: Update DOCTRINE.md
print('--- Step 5: Update DOCTRINE.md --------------------------------')
if os.path.isfile(doctrine_path):
    with open(doctrine_path, 'r', encoding='utf-8') as f:
        content = f.read()
    updated = re.sub(
        r'\|\s*\*\*Doctrine Version\*\*\s*\|[^|]*\|',
        f'| **Doctrine Version** | {parent_version} |',
        content
    )
    if updated != content:
        with open(doctrine_path, 'w', encoding='utf-8') as f:
            f.write(updated)
        print(f'  {GREEN}[OK]{NC} DOCTRINE.md: version updated to {parent_version}')
    else:
        print(f'  {YELLOW}[SKIP]{NC} DOCTRINE.md: no Doctrine Version field found')
else:
    print(f'  {YELLOW}[SKIP]{NC} DOCTRINE.md not found')

print()

# Step 6: Verify
print('--- Step 6: Verify --------------------------------------------')
total = synced + created + skipped
print(f'  Files processed: {total}')

critical_missing = 0
for cf in ['DOCTRINE.md', 'CC_OPERATIONAL_DIGEST.md']:
    if not os.path.isfile(os.path.join(child_root, cf)):
        print(f'  {RED}[MISSING]{NC} Critical file: {cf}')
        critical_missing += 1

if critical_missing > 0:
    print(f'  {RED}[WARN]{NC} {critical_missing} critical file(s) missing')
else:
    print(f'  {GREEN}[OK]{NC} All critical files present')

hook_path = os.path.join(child_root, '.git', 'hooks', 'pre-commit')
if os.path.isfile(hook_path):
    print(f'  {GREEN}[OK]{NC} Pre-commit hook installed')
elif os.path.isdir(os.path.join(child_root, '.git')):
    print(f'  {YELLOW}[WARN]{NC} Pre-commit hook not installed')

print()

# Summary
now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
print('===================================================================')
print('  IMO-CREATOR SYNC COMPLETE')
print('===================================================================')
print()
print(f'  Source:   imo-creator v{parent_version}')
print(f'  Previous: v{child_version}')
print(f'  Updated:  {now}')
print()
print(f'  SYNCED (always_sync):      {synced} files')
print(f'  CREATED (sync_if_missing): {created} files')
print(f'  SKIPPED (exists/never):    {skipped} files')

if new_files:
    print()
    print('  New files added:')
    for nf in new_files:
        print(f'    - {nf}')

print()
print(f'  DOCTRINE.md updated: v{child_version} -> v{parent_version}')
if os.path.isfile(hook_path):
    print('  Pre-commit hook: UPDATED')
print()
print("  Next: Review changes with 'git status', then commit.")
print()
"@

$tempFile = [System.IO.Path]::GetTempFileName() + ".py"
$pythonScript | Out-File -FilePath $tempFile -Encoding utf8

$forceStr = if ($Force) { "true" } else { "false" }

try {
    & $pythonCmd $tempFile $ImoPath $Manifest $forceStr
    $exitCode = $LASTEXITCODE
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

exit $exitCode
