# push-doctrine-update.ps1
# Commits and pushes doctrine updates to GitHub
# Run from imo-creator root: .\scripts\push-doctrine-update.ps1

param(
    [string]$Message = "Update doctrine: Add REPO_REFACTOR_PROTOCOL.md"
)

$ErrorActionPreference = "Stop"

$RepoPath = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoPath

Write-Host "[GIT] Repository: $RepoPath" -ForegroundColor Cyan
Write-Host "[GIT] Checking status..." -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "[GIT] Adding doctrine files..." -ForegroundColor Cyan
git add templates/doctrine/

Write-Host "[GIT] Committing: $Message" -ForegroundColor Cyan
git commit -m $Message

Write-Host "[GIT] Pushing to origin..." -ForegroundColor Cyan
git push origin master

Write-Host ""
Write-Host "[DONE] Doctrine updated on GitHub" -ForegroundColor Green
