# ═══════════════════════════════════════════════════════════════════════════════
# INSTALL GIT HOOKS (PowerShell)
# ═══════════════════════════════════════════════════════════════════════════════
# Copies doctrine compliance hooks to .git/hooks/
# Run from repo root: .\scripts\install-hooks.ps1
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$HooksSrc = Join-Path $ScriptDir "hooks"
$HooksDest = Join-Path $RepoRoot ".git\hooks"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  INSTALLING DOCTRINE COMPLIANCE HOOKS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source:      $HooksSrc"
Write-Host "Destination: $HooksDest"
Write-Host ""

# Check if we're in a git repo
if (-not (Test-Path (Join-Path $RepoRoot ".git"))) {
    Write-Host "[ERROR] Not a git repository: $RepoRoot" -ForegroundColor Red
    exit 1
}

# Create hooks directory if missing
if (-not (Test-Path $HooksDest)) {
    New-Item -ItemType Directory -Path $HooksDest -Force | Out-Null
}

# Install pre-commit hook
$PreCommitSrc = Join-Path $HooksSrc "pre-commit"
$PreCommitDest = Join-Path $HooksDest "pre-commit"

if (Test-Path $PreCommitSrc) {
    Copy-Item -Path $PreCommitSrc -Destination $PreCommitDest -Force
    Write-Host "[INSTALLED] pre-commit hook" -ForegroundColor Green
} else {
    Write-Host "[SKIP] pre-commit hook not found in source" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "───────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host "  DONE" -ForegroundColor Cyan
Write-Host "───────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""
Write-Host "Hooks installed. They will run automatically on git commit."
Write-Host "To bypass (not recommended): git commit --no-verify"
Write-Host ""
