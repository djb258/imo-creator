# Git Bash Setup for Claude Code on Windows
# This script detects, installs, and configures Git Bash for Claude Code

Write-Host "========================================"
Write-Host "Git Bash Setup for Claude Code"
Write-Host "========================================"
Write-Host ""

# Function to find bash.exe
function Find-BashExe {
    $commonPaths = @(
        "C:\Program Files\Git\bin\bash.exe",
        "C:\Program Files\Git\usr\bin\bash.exe",
        "C:\Program Files (x86)\Git\bin\bash.exe",
        "C:\Program Files (x86)\Git\usr\bin\bash.exe"
    )

    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            Write-Host "[OK] Found bash.exe at: $path"
            return $path
        }
    }

    return $null
}

# Function to download and install Git
function Install-GitBash {
    Write-Host "[INFO] Git Bash not found. Installing..."
    Write-Host ""

    $gitUrl = "https://github.com/git-for-windows/git/releases/latest/download/Git-2.47.1-64-bit.exe"
    $installerPath = "$env:TEMP\GitInstaller.exe"

    Write-Host "[INFO] Downloading Git for Windows..."
    Write-Host "URL: $gitUrl"

    try {
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $gitUrl -OutFile $installerPath -UseBasicParsing
        $ProgressPreference = 'Continue'
        Write-Host "[OK] Download complete"
    }
    catch {
        Write-Host "[ERROR] Failed to download Git installer"
        Write-Host "Error: $_"
        Write-Host ""
        Write-Host "Please download manually from: https://git-scm.com/downloads/win"
        return $false
    }

    Write-Host ""
    Write-Host "[INFO] Installing Git for Windows (this may take a few minutes)..."

    try {
        $installArgs = @(
            "/VERYSILENT",
            "/NORESTART",
            "/NOCANCEL",
            "/SP-",
            "/CLOSEAPPLICATIONS",
            "/RESTARTAPPLICATIONS"
        )

        $process = Start-Process -FilePath $installerPath -ArgumentList $installArgs -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            Write-Host "[OK] Git for Windows installed successfully"
            Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 3
            return $true
        }
        else {
            Write-Host "[ERROR] Installation failed with exit code: $($process.ExitCode)"
            return $false
        }
    }
    catch {
        Write-Host "[ERROR] Installation error: $_"
        return $false
    }
}

# Function to set environment variable
function Set-ClaudeCodeGitBashPath {
    param([string]$BashPath)

    Write-Host ""
    Write-Host "[INFO] Setting CLAUDE_CODE_GIT_BASH_PATH environment variable..."

    try {
        $env:CLAUDE_CODE_GIT_BASH_PATH = $BashPath
        [System.Environment]::SetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", $BashPath, [System.EnvironmentVariableTarget]::User)

        Write-Host "[OK] Environment variable set:"
        Write-Host "CLAUDE_CODE_GIT_BASH_PATH=$BashPath"
        return $true
    }
    catch {
        Write-Host "[ERROR] Failed to set environment variable: $_"
        return $false
    }
}

# Function to add Git to PATH
function Add-GitToPath {
    param([string]$BashPath)

    $gitBinDir = Split-Path $BashPath -Parent
    $gitRootDir = Split-Path $gitBinDir -Parent
    $gitCmdDir = Join-Path $gitRootDir "cmd"

    Write-Host ""
    Write-Host "[INFO] Checking PATH variable..."

    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)

    $pathsToAdd = @()

    if ($currentPath -notlike "*$gitCmdDir*") {
        $pathsToAdd += $gitCmdDir
    }

    if ($currentPath -notlike "*$gitBinDir*") {
        $pathsToAdd += $gitBinDir
    }

    if ($pathsToAdd.Count -gt 0) {
        Write-Host "[INFO] Adding Git directories to PATH..."

        $newPath = $currentPath
        foreach ($pathToAdd in $pathsToAdd) {
            if (-not $newPath.EndsWith(";")) {
                $newPath += ";"
            }
            $newPath += $pathToAdd
            Write-Host "  + $pathToAdd"
        }

        try {
            [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::User)
            $env:Path = $newPath
            Write-Host "[OK] PATH updated successfully"
        }
        catch {
            Write-Host "[ERROR] Failed to update PATH: $_"
            return $false
        }
    }
    else {
        Write-Host "[OK] Git directories already in PATH"
    }

    return $true
}

# Function to verify installation
function Test-GitBashInstallation {
    param([string]$BashPath)

    Write-Host ""
    Write-Host "========================================"
    Write-Host "Verification Tests"
    Write-Host "========================================"
    Write-Host ""

    # Test 1: bash.exe exists
    Write-Host "[TEST 1] Checking if bash.exe exists..."
    if (Test-Path $BashPath) {
        Write-Host "[PASS] bash.exe found at $BashPath"
    }
    else {
        Write-Host "[FAIL] bash.exe not found"
        return $false
    }

    # Test 2: Environment variable is set
    Write-Host ""
    Write-Host "[TEST 2] Checking CLAUDE_CODE_GIT_BASH_PATH..."
    $envVar = [System.Environment]::GetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", [System.EnvironmentVariableTarget]::User)
    if ($envVar -eq $BashPath) {
        Write-Host "[PASS] Environment variable correctly set"
        Write-Host "Value: $envVar"
    }
    else {
        Write-Host "[FAIL] Environment variable not set correctly"
        return $false
    }

    # Test 3: bash command works
    Write-Host ""
    Write-Host "[TEST 3] Testing bash command..."
    try {
        $bashVersion = & $BashPath --version 2>&1 | Select-Object -First 1
        Write-Host "[PASS] bash command works"
        Write-Host "$bashVersion"
    }
    catch {
        Write-Host "[FAIL] bash command failed: $_"
        return $false
    }

    # Test 4: where bash
    Write-Host ""
    Write-Host "[TEST 4] Running 'where bash'..."
    try {
        $whereBash = where.exe bash 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[PASS] bash found in PATH"
            $whereBash | ForEach-Object { Write-Host "  $_" }
        }
        else {
            Write-Host "[WARNING] bash not found in PATH (may require restart)"
        }
    }
    catch {
        Write-Host "[WARNING] Could not run 'where bash'"
    }

    # Test 5: Git command
    Write-Host ""
    Write-Host "[TEST 5] Testing git command..."
    try {
        $gitVersion = git --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[PASS] git command works"
            Write-Host "$gitVersion"
        }
        else {
            Write-Host "[WARNING] git command not working (may require restart)"
        }
    }
    catch {
        Write-Host "[WARNING] git command not found (may require restart)"
    }

    return $true
}

# Main Execution
Write-Host "[INFO] Step 1: Detecting Git Bash installation..."
Write-Host ""

$bashPath = Find-BashExe

if (-not $bashPath) {
    Write-Host "[INFO] Git Bash not found on this system"
    Write-Host ""

    $response = Read-Host "Do you want to install Git for Windows? (Y/N)"

    if ($response -eq "Y" -or $response -eq "y") {
        $installed = Install-GitBash

        if ($installed) {
            Start-Sleep -Seconds 2
            $bashPath = Find-BashExe

            if (-not $bashPath) {
                Write-Host ""
                Write-Host "[INFO] Installation completed but bash.exe not found yet"
                Write-Host "Trying default location..."
                $bashPath = "C:\Program Files\Git\bin\bash.exe"

                if (-not (Test-Path $bashPath)) {
                    Write-Host "[ERROR] Could not locate bash.exe after installation"
                    Write-Host "Please restart your terminal and run this script again"
                    exit 1
                }
            }
        }
        else {
            Write-Host ""
            Write-Host "[ERROR] Installation failed"
            Write-Host "Please install Git manually from: https://git-scm.com/downloads/win"
            exit 1
        }
    }
    else {
        Write-Host ""
        Write-Host "[INFO] Installation cancelled by user"
        Write-Host "To install manually, visit: https://git-scm.com/downloads/win"
        exit 0
    }
}

Write-Host ""
Write-Host "[INFO] Step 2: Configuring environment..."

# Set environment variable
$envSet = Set-ClaudeCodeGitBashPath -BashPath $bashPath

if (-not $envSet) {
    Write-Host "[ERROR] Failed to configure environment"
    exit 1
}

# Add to PATH
$pathSet = Add-GitToPath -BashPath $bashPath

# Run verification tests
$verified = Test-GitBashInstallation -BashPath $bashPath

Write-Host ""
Write-Host "========================================"
Write-Host "Setup Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Git Bash has been configured for Claude Code."
Write-Host ""
Write-Host "Next Steps:"
Write-Host "  1. Restart your terminal"
Write-Host "  2. Test with: where bash"
Write-Host "  3. Test Claude Code: claude version"
Write-Host "  4. Update Claude: claude update"
Write-Host ""
Write-Host "Environment Variable Set:"
Write-Host "  CLAUDE_CODE_GIT_BASH_PATH=$bashPath"
Write-Host ""

# Offer to test Claude Code
Write-Host "Would you like to test Claude Code now? (Y/N): " -NoNewline
$testResponse = Read-Host

if ($testResponse -eq "Y" -or $testResponse -eq "y") {
    Write-Host ""
    Write-Host "[INFO] Testing Claude Code..."
    Write-Host ""

    try {
        $claudeVersion = claude version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Claude Code is working!"
            Write-Host "$claudeVersion"
        }
        else {
            Write-Host "[WARNING] Claude Code command not found"
            Write-Host "You may need to install or update Claude Code"
        }
    }
    catch {
        Write-Host "[WARNING] Claude Code not installed or not in PATH"
        Write-Host "Please ensure Claude Code is installed"
    }
}

Write-Host ""
Write-Host "Setup script completed successfully!"
Write-Host ""
