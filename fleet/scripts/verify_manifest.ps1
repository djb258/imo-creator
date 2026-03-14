# ═══════════════════════════════════════════════════════════════════════════════
# VERIFY MANIFEST — Disk vs Manifest Sync Check (PowerShell)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Ensure every file in templates/ is listed in TEMPLATES_MANIFEST.yaml
#          and every manifest entry has a corresponding file on disk
# Usage: .\scripts\verify_manifest.ps1
# Exit: 0 = in sync, 1 = mismatch found
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

$Violations = 0
$Warnings = 0

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  MANIFEST SYNC VERIFICATION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# LOCATE MANIFEST
# ───────────────────────────────────────────────────────────────────
$Manifest = $null
if (Test-Path "templates\TEMPLATES_MANIFEST.yaml") {
    $Manifest = "templates\TEMPLATES_MANIFEST.yaml"
} elseif (Test-Path "TEMPLATES_MANIFEST.yaml") {
    $Manifest = "TEMPLATES_MANIFEST.yaml"
} else {
    Write-Host "[ERROR] TEMPLATES_MANIFEST.yaml not found" -ForegroundColor Red
    exit 1
}

Write-Host "  Manifest: $Manifest"
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# COLLECT: Files on disk (forward slashes to match manifest format)
# ───────────────────────────────────────────────────────────────────
$DiskFiles = Get-ChildItem -Path "templates" -Recurse -File |
    ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/') } |
    Sort-Object

$DiskCount = $DiskFiles.Count

# ───────────────────────────────────────────────────────────────────
# COLLECT: Files in manifest
# ───────────────────────────────────────────────────────────────────
$ManifestContent = Get-Content $Manifest -Raw
$ManifestFiles = [regex]::Matches($ManifestContent, '- path:\s*"([^"]+)"') |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object

$ManifestCount = $ManifestFiles.Count

# ───────────────────────────────────────────────────────────────────
# EXTRACT: total_file_count from manifest header
# ───────────────────────────────────────────────────────────────────
$DeclaredMatch = [regex]::Match($ManifestContent, 'total_file_count:\s*(\d+)')
$DeclaredCount = if ($DeclaredMatch.Success) { [int]$DeclaredMatch.Groups[1].Value } else { 0 }

Write-Host "--- Counts ----------------------------------------------------"
Write-Host "  Files on disk:             $DiskCount"
Write-Host "  Files in manifest:         $ManifestCount"
Write-Host "  Declared total_file_count: $DeclaredCount"
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK: Files on disk but NOT in manifest
# ───────────────────────────────────────────────────────────────────
Write-Host "--- On disk but NOT in manifest ----------------------------"

$MissingFromManifest = $DiskFiles | Where-Object { $ManifestFiles -notcontains $_ }

if ($MissingFromManifest) {
    foreach ($file in $MissingFromManifest) {
        Write-Host "  [VIOLATION] MANIFEST_DRIFT: $file" -ForegroundColor Red
        Write-Host "              File exists on disk but is not listed in manifest"
        $Violations++
    }
} else {
    Write-Host "  [OK] All disk files are in manifest" -ForegroundColor Green
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK: Files in manifest but NOT on disk
# ───────────────────────────────────────────────────────────────────
Write-Host "--- In manifest but NOT on disk ----------------------------"

$MissingFromDisk = $ManifestFiles | Where-Object { $DiskFiles -notcontains $_ }

if ($MissingFromDisk) {
    foreach ($file in $MissingFromDisk) {
        Write-Host "  [VIOLATION] MANIFEST_GHOST: $file" -ForegroundColor Red
        Write-Host "              Listed in manifest but does not exist on disk"
        $Violations++
    }
} else {
    Write-Host "  [OK] All manifest entries exist on disk" -ForegroundColor Green
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK: total_file_count matches actual manifest entries
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Count verification -----------------------------------------"

if ($DeclaredCount -ne $ManifestCount) {
    Write-Host "  [VIOLATION] COUNT_MISMATCH: total_file_count ($DeclaredCount) != manifest entries ($ManifestCount)" -ForegroundColor Red
    Write-Host "              Update total_file_count in manifest header"
    $Violations++
} else {
    Write-Host "  [OK] total_file_count matches manifest entries ($ManifestCount)" -ForegroundColor Green
}

if ($ManifestCount -ne $DiskCount) {
    Write-Host "  [VIOLATION] SYNC_MISMATCH: manifest entries ($ManifestCount) != files on disk ($DiskCount)" -ForegroundColor Red
    Write-Host "              Manifest and disk are out of sync"
    $Violations++
} else {
    Write-Host "  [OK] Manifest entries match files on disk ($DiskCount)" -ForegroundColor Green
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK: Empty directories in templates/
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Empty directories ------------------------------------------"

$EmptyDirs = Get-ChildItem -Path "templates" -Recurse -Directory |
    Where-Object { (Get-ChildItem $_.FullName -Force).Count -eq 0 }

if ($EmptyDirs) {
    foreach ($dir in $EmptyDirs) {
        $RelPath = $dir.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/')
        Write-Host "  [WARNING] EMPTY_DIR: $RelPath" -ForegroundColor Yellow
        Write-Host "              Empty directory - add content or delete"
        $Warnings++
    }
} else {
    Write-Host "  [OK] No empty directories" -ForegroundColor Green
}

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "───────────────────────────────────────────────────────────────"

if ($Violations -gt 0) {
    Write-Host "FAILED: $Violations violation(s) found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manifest is out of sync with disk."
    Write-Host "Action: Update TEMPLATES_MANIFEST.yaml to match reality."
    Write-Host ""
    exit 1
} elseif ($Warnings -gt 0) {
    Write-Host "PASSED WITH WARNINGS: $Warnings warning(s)" -ForegroundColor Yellow
    Write-Host ""
    exit 0
} else {
    Write-Host "PASSED: Manifest in sync with disk" -ForegroundColor Green
    Write-Host ""
    exit 0
}
