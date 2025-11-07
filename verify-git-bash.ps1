# Git Bash Configuration Verification Script
# Run this script to verify Git Bash is properly configured for Claude Code

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Bash Configuration Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if bash.exe exists
Write-Host "[TEST 1] Checking if bash.exe exists..." -ForegroundColor Yellow
$bashPath = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $bashPath) {
    Write-Host "[PASS] bash.exe found at: $bashPath" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] bash.exe not found" -ForegroundColor Red
    exit 1
}

# Test 2: Check CLAUDE_CODE_GIT_BASH_PATH environment variable
Write-Host ""
Write-Host "[TEST 2] Checking CLAUDE_CODE_GIT_BASH_PATH..." -ForegroundColor Yellow
$envVar = [System.Environment]::GetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", [System.EnvironmentVariableTarget]::User)
if ($envVar -eq $bashPath) {
    Write-Host "[PASS] Environment variable correctly set" -ForegroundColor Green
    Write-Host "  Value: $envVar" -ForegroundColor Gray
}
else {
    Write-Host "[FAIL] Environment variable not set correctly" -ForegroundColor Red
    Write-Host "  Expected: $bashPath" -ForegroundColor Gray
    Write-Host "  Actual: $envVar" -ForegroundColor Gray
}

# Test 3: Check if Git is in PATH
Write-Host ""
Write-Host "[TEST 3] Checking if Git is in PATH..." -ForegroundColor Yellow
$userPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
if ($userPath -like "*Git\bin*" -or $userPath -like "*Git\cmd*") {
    Write-Host "[PASS] Git directories found in PATH" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] Git directories not in PATH" -ForegroundColor Yellow
}

# Test 4: Test bash command
Write-Host ""
Write-Host "[TEST 4] Testing bash command..." -ForegroundColor Yellow
try {
    $bashVersion = & $bashPath --version 2>&1 | Select-Object -First 1
    Write-Host "[PASS] bash command works" -ForegroundColor Green
    Write-Host "  $bashVersion" -ForegroundColor Gray
}
catch {
    Write-Host "[FAIL] bash command failed: $_" -ForegroundColor Red
}

# Test 5: Test git command
Write-Host ""
Write-Host "[TEST 5] Testing git command..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[PASS] git command works" -ForegroundColor Green
        Write-Host "  $gitVersion" -ForegroundColor Gray
    }
    else {
        Write-Host "[WARNING] git command not working" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "[WARNING] git command not found" -ForegroundColor Yellow
}

# Test 6: where bash
Write-Host ""
Write-Host "[TEST 6] Running 'where bash'..." -ForegroundColor Yellow
try {
    $whereBash = where.exe bash 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[PASS] bash found in system" -ForegroundColor Green
        $whereBash | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    }
    else {
        Write-Host "[WARNING] bash not found in system PATH" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "[WARNING] Could not run 'where bash'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration Summary:" -ForegroundColor Cyan
Write-Host "  Git Bash Path: $bashPath" -ForegroundColor White
Write-Host "  Environment Variable: CLAUDE_CODE_GIT_BASH_PATH=$envVar" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Restart your terminal or IDE" -ForegroundColor White
Write-Host "  2. Test Claude Code: claude version" -ForegroundColor White
Write-Host "  3. Update Claude: claude update" -ForegroundColor White
Write-Host ""
