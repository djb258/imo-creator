# ═══════════════════════════════════════════════════════════════════════════════
# ADR CHECK — ADR Index Audit (Windows)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign)
# Purpose: Compare ADR_INDEX.md against actual ADR files in fleet repos
# Usage: .\scripts\adr-check.ps1 [-Verbose]
# Exit: 0 = in sync, 1 = drift detected
# ═══════════════════════════════════════════════════════════════════════════════

param(
    [switch]$VerboseOutput
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$IndexFile = Join-Path $RepoRoot "ADR_INDEX.md"
$Registry = Join-Path $RepoRoot "FLEET_REGISTRY.yaml"

if (-not (Test-Path $IndexFile)) {
    Write-Host "[ERROR] ADR_INDEX.md not found at $IndexFile" -ForegroundColor Red
    exit 2
}

if (-not (Test-Path $Registry)) {
    Write-Host "[ERROR] FLEET_REGISTRY.yaml not found at $Registry" -ForegroundColor Red
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
import glob

repo_root = sys.argv[1]
index_path = sys.argv[2]
registry_path = sys.argv[3]
verbose = sys.argv[4] == 'True'

indexed_adrs = {}

with open(index_path, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.startswith('| ADR-'):
            parts = [p.strip() for p in line.split('|')]
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

with open(registry_path, 'r', encoding='utf-8') as f:
    registry = yaml.safe_load(f)

repos = registry.get('fleet', {}).get('repos', [])
all_repos = [{'name': 'imo-creator', 'path': '.'}] + repos

found_adrs = {}

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
        continue
    adr_patterns = [
        os.path.join(child_path, 'docs', 'adr', 'ADR-*.md'),
        os.path.join(child_path, 'docs', 'adr', 'adr-*.md'),
        os.path.join(child_path, 'adr', 'ADR-*.md'),
        os.path.join(child_path, 'templates', 'adr', 'ADR-*-*.md'),
    ]
    for pattern in adr_patterns:
        for filepath in glob.glob(pattern):
            filename = os.path.basename(filepath)
            match = re.match(r'(ADR-\d+)', filename, re.IGNORECASE)
            if match:
                adr_num = match.group(1).upper()
                rel_file = os.path.relpath(filepath, child_path)
                found_adrs[adr_num] = {
                    'repo': name,
                    'path': rel_file,
                    'full_path': filepath
                }

missing_from_index = []
missing_from_repos = []

for adr_num, info in sorted(found_adrs.items()):
    if adr_num not in indexed_adrs:
        missing_from_index.append((adr_num, info['repo'], info['path']))

for adr_num, info in sorted(indexed_adrs.items()):
    if adr_num not in found_adrs:
        if info['status'] not in ('REJECTED', 'SUPERSEDED'):
            missing_from_repos.append((adr_num, info['repo'], info['title']))

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
    print("  MISSING FROM INDEX (found in repos, not in ADR_INDEX.md):")
    for adr_num, repo, path in missing_from_index:
        print(f"    - {repo}: {adr_num} ({path})")
    print()

if missing_from_repos:
    print("  MISSING FROM REPOS (in ADR_INDEX.md, file not found):")
    for adr_num, repo, title in missing_from_repos:
        print(f"    - {adr_num}: declared in {repo}, file not found")
    print()

if not missing_from_index and not missing_from_repos:
    print("  INDEX STATUS: IN SYNC")
    print()
    sys.exit(0)
else:
    drift_count = len(missing_from_index) + len(missing_from_repos)
    print(f"  INDEX STATUS: DRIFT DETECTED ({drift_count} discrepancies)")
    print()
    sys.exit(1)
"@

$tempFile = [System.IO.Path]::GetTempFileName() + ".py"
$pythonScript | Out-File -FilePath $tempFile -Encoding utf8

try {
    & $pythonCmd $tempFile $RepoRoot $IndexFile $Registry $verboseStr
    $exitCode = $LASTEXITCODE
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

exit $exitCode
