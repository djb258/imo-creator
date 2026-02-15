# ═══════════════════════════════════════════════════════════════════════════════
# DETECT STALENESS — Governance Artifact Freshness Audit (Windows)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Detect when governance artifacts are stale relative to code changes
# Usage: .\scripts\detect-staleness.ps1 [-Verbose] [-Json]
# Exit: 0 = no CRITICAL/HIGH staleness, 1 = CRITICAL/HIGH staleness found
# ═══════════════════════════════════════════════════════════════════════════════
#
# This is a PERIODIC audit script, NOT a pre-commit hook.
# Run as part of the quarterly hygiene audit or on-demand.
#
# ═══════════════════════════════════════════════════════════════════════════════

param(
    [switch]$Json
)

$ErrorActionPreference = "Stop"

# ───────────────────────────────────────────────────────────────────
# CONFIGURABLE THRESHOLDS (days)
# ───────────────────────────────────────────────────────────────────
$THRESHOLD_PRD = 30
$THRESHOLD_ERD = 14
$THRESHOLD_OSAM = 30
$THRESHOLD_REGISTRY = 7
$THRESHOLD_CHECKPOINT = 7

# ───────────────────────────────────────────────────────────────────
# STATE
# ───────────────────────────────────────────────────────────────────
$CriticalCount = 0
$HighCount = 0
$MediumCount = 0
$Findings = @()

# ───────────────────────────────────────────────────────────────────
# HELPERS
# ───────────────────────────────────────────────────────────────────
function Get-GitLastModifiedEpoch {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return $null }
    $date = git log -1 --format="%ct" -- $FilePath 2>$null
    if ($date) { return [long]$date }
    # Fallback to filesystem
    return [long](Get-Item $FilePath).LastWriteTimeUtc.Subtract([datetime]'1970-01-01').TotalSeconds
}

function Get-GitDirLastModifiedEpoch {
    param([string]$DirPath, [string]$Pattern = "")
    if (-not (Test-Path $DirPath)) { return $null }
    if ($Pattern) {
        $date = git log -1 --format="%ct" -- "$DirPath/$Pattern" 2>$null
    } else {
        $date = git log -1 --format="%ct" -- $DirPath 2>$null
    }
    if ($date) { return [long]$date }
    return $null
}

function Get-SqlLastModifiedEpoch {
    $date = git log -1 --format="%ct" -- "*.sql" "**/*.sql" 2>$null
    if ($date) { return [long]$date }
    return $null
}

function Get-DaysBetween {
    param([long]$Older, [long]$Newer)
    $diff = [math]::Floor(($Newer - $Older) / 86400)
    if ($diff -lt 0) { $diff = 0 }
    return $diff
}

$NowEpoch = [long](Get-Date).ToUniversalTime().Subtract([datetime]'1970-01-01').TotalSeconds

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  STALENESS DETECTION AUDIT" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

$repoName = Split-Path -Leaf (git rev-parse --show-toplevel 2>$null) 2>$null
if (-not $repoName) { $repoName = "unknown" }

Write-Host "  Date:       $((Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'))"
Write-Host "  Repository: $repoName"
Write-Host ""
Write-Host "  Thresholds:"
Write-Host "    PRD:              $THRESHOLD_PRD days"
Write-Host "    ERD:              $THRESHOLD_ERD days"
Write-Host "    OSAM:             $THRESHOLD_OSAM days"
Write-Host "    Column Registry:  $THRESHOLD_REGISTRY days"
Write-Host "    Checkpoint:       $THRESHOLD_CHECKPOINT days"
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK 1: PRD Staleness
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Check 1: PRD Staleness ------------------------------------"

$prdFile = $null
foreach ($c in @("PRD.md", "docs\PRD.md", "prd\PRD.md")) {
    if (Test-Path $c) { $prdFile = $c; break }
}

if (-not $prdFile) {
    Write-Host "  [SKIP] PRD not found (not a staleness issue)" -ForegroundColor Cyan
} else {
    $prdEpoch = Get-GitLastModifiedEpoch $prdFile
    $srcEpoch = Get-GitDirLastModifiedEpoch "src"

    if (-not $srcEpoch -or -not $prdEpoch) {
        Write-Host "  [SKIP] Cannot determine dates (no git history)" -ForegroundColor Cyan
    } else {
        $days = Get-DaysBetween $prdEpoch $srcEpoch
        if ($days -gt $THRESHOLD_PRD) {
            Write-Host "  [STALE] $prdFile - src/ modified $days days after PRD (threshold: $THRESHOLD_PRD)" -ForegroundColor Red
            $Findings += [PSCustomObject]@{Severity="HIGH"; Artifact="PRD ($prdFile)"; Detail="src/ modified ${days}d after PRD last update"; Days=$days}
            $HighCount++
        } else {
            Write-Host "  [OK] $prdFile - current (src/ ${days}d ahead, threshold: $THRESHOLD_PRD)" -ForegroundColor Green
        }
    }
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK 2: ERD Staleness
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Check 2: ERD Staleness ------------------------------------"

$erdFile = $null
foreach ($c in @("SCHEMA.md", "docs\SCHEMA.md", "data\SCHEMA.md", "ERD.md", "docs\ERD.md")) {
    if (Test-Path $c) { $erdFile = $c; break }
}

$registryFile = $null
foreach ($c in @("column_registry.yml", "data\column_registry.yml", "docs\column_registry.yml")) {
    if (Test-Path $c) { $registryFile = $c; break }
}

if (-not $erdFile) {
    Write-Host "  [SKIP] ERD/SCHEMA.md not found (not a staleness issue)" -ForegroundColor Cyan
} elseif (-not $registryFile) {
    Write-Host "  [SKIP] column_registry.yml not found (not a staleness issue)" -ForegroundColor Cyan
} else {
    $erdEpoch = Get-GitLastModifiedEpoch $erdFile
    $regEpoch = Get-GitLastModifiedEpoch $registryFile

    if (-not $erdEpoch -or -not $regEpoch) {
        Write-Host "  [SKIP] Cannot determine dates (no git history)" -ForegroundColor Cyan
    } else {
        $days = Get-DaysBetween $erdEpoch $regEpoch
        if ($days -gt $THRESHOLD_ERD) {
            Write-Host "  [STALE] $erdFile - registry modified $days days after ERD (threshold: $THRESHOLD_ERD)" -ForegroundColor Red
            $Findings += [PSCustomObject]@{Severity="HIGH"; Artifact="ERD ($erdFile)"; Detail="column_registry modified ${days}d after ERD last update"; Days=$days}
            $HighCount++
        } else {
            Write-Host "  [OK] $erdFile - current (registry ${days}d ahead, threshold: $THRESHOLD_ERD)" -ForegroundColor Green
        }
    }
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK 3: OSAM Staleness
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Check 3: OSAM Staleness -----------------------------------"

$osamFile = $null
foreach ($c in @("OSAM.md", "docs\OSAM.md", "semantic\OSAM.md")) {
    if (Test-Path $c) { $osamFile = $c; break }
}

if (-not $osamFile) {
    Write-Host "  [SKIP] OSAM.md not found (not a staleness issue)" -ForegroundColor Cyan
} else {
    $osamEpoch = Get-GitLastModifiedEpoch $osamFile
    $dataEpoch = $null
    foreach ($d in @("src\data", "data", "src")) {
        if (Test-Path $d) {
            $dataEpoch = Get-GitDirLastModifiedEpoch $d
            if ($dataEpoch) { break }
        }
    }

    if (-not $dataEpoch -or -not $osamEpoch) {
        Write-Host "  [SKIP] Cannot determine dates (no git history)" -ForegroundColor Cyan
    } else {
        $days = Get-DaysBetween $osamEpoch $dataEpoch
        if ($days -gt $THRESHOLD_OSAM) {
            Write-Host "  [STALE] $osamFile - data layer modified $days days after OSAM (threshold: $THRESHOLD_OSAM)" -ForegroundColor Red
            $Findings += [PSCustomObject]@{Severity="HIGH"; Artifact="OSAM ($osamFile)"; Detail="Data layer modified ${days}d after OSAM last update"; Days=$days}
            $HighCount++
        } else {
            Write-Host "  [OK] $osamFile - current (data ${days}d ahead, threshold: $THRESHOLD_OSAM)" -ForegroundColor Green
        }
    }
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK 4: Column Registry Staleness
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Check 4: Column Registry Staleness ------------------------"

if (-not $registryFile) {
    foreach ($c in @("column_registry.yml", "data\column_registry.yml", "docs\column_registry.yml")) {
        if (Test-Path $c) { $registryFile = $c; break }
    }
}

if (-not $registryFile) {
    Write-Host "  [SKIP] column_registry.yml not found (not a staleness issue)" -ForegroundColor Cyan
} else {
    $regEpoch = Get-GitLastModifiedEpoch $registryFile
    $sqlEpoch = Get-SqlLastModifiedEpoch

    if (-not $sqlEpoch) {
        Write-Host "  [SKIP] No SQL files tracked in git" -ForegroundColor Cyan
    } elseif (-not $regEpoch) {
        Write-Host "  [SKIP] Cannot determine registry date" -ForegroundColor Cyan
    } else {
        $days = Get-DaysBetween $regEpoch $sqlEpoch
        if ($days -gt $THRESHOLD_REGISTRY) {
            Write-Host "  [STALE] $registryFile - SQL modified $days days after registry (threshold: $THRESHOLD_REGISTRY)" -ForegroundColor Red
            $Findings += [PSCustomObject]@{Severity="CRITICAL"; Artifact="Column Registry ($registryFile)"; Detail="SQL files modified ${days}d after registry last update"; Days=$days}
            $CriticalCount++
        } else {
            Write-Host "  [OK] $registryFile - current (SQL ${days}d ahead, threshold: $THRESHOLD_REGISTRY)" -ForegroundColor Green
        }
    }
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK 5: Data Dictionary Staleness
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Check 5: Data Dictionary Staleness ------------------------"

$dictFile = $null
foreach ($c in @("DATA_DICTIONARY.md", "docs\DATA_DICTIONARY.md", "data\DATA_DICTIONARY.md")) {
    if (Test-Path $c) { $dictFile = $c; break }
}

if (-not $dictFile) {
    Write-Host "  [SKIP] DATA_DICTIONARY.md not found (not a staleness issue)" -ForegroundColor Cyan
} elseif (-not $registryFile) {
    Write-Host "  [SKIP] column_registry.yml not found (cannot compare)" -ForegroundColor Cyan
} else {
    $dictEpoch = Get-GitLastModifiedEpoch $dictFile
    $regEpoch = Get-GitLastModifiedEpoch $registryFile

    if (-not $dictEpoch -or -not $regEpoch) {
        Write-Host "  [SKIP] Cannot determine dates" -ForegroundColor Cyan
    } else {
        if ($regEpoch -gt $dictEpoch) {
            $days = Get-DaysBetween $dictEpoch $regEpoch
            Write-Host "  [STALE] $dictFile - registry is $days days newer" -ForegroundColor Yellow
            Write-Host "         Regenerate with: .\scripts\generate-data-dictionary.sh"
            $Findings += [PSCustomObject]@{Severity="MEDIUM"; Artifact="Data Dictionary ($dictFile)"; Detail="Registry is ${days}d newer than dictionary (regenerate)"; Days=$days}
            $MediumCount++
        } else {
            Write-Host "  [OK] $dictFile - current (dictionary is up to date with registry)" -ForegroundColor Green
        }
    }
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK 6: Doctrine Checkpoint Staleness
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Check 6: Doctrine Checkpoint Staleness --------------------"

$checkpointFile = $null
foreach ($c in @("DOCTRINE_CHECKPOINT.yaml", "DOCTRINE_CHECKPOINT.yml")) {
    if (Test-Path $c) { $checkpointFile = $c; break }
}

if (-not $checkpointFile) {
    Write-Host "  [SKIP] DOCTRINE_CHECKPOINT.yaml not found (not a staleness issue)" -ForegroundColor Cyan
} else {
    $lastVerified = $null
    $content = Get-Content $checkpointFile -Raw
    if ($content -match 'last_verified:\s*(.+)') {
        $lastVerified = $Matches[1].Trim().Trim('"').Trim("'")
    }

    if (-not $lastVerified -or $lastVerified -match '\[') {
        Write-Host "  [STALE] $checkpointFile - last_verified is empty or placeholder" -ForegroundColor Yellow
        $Findings += [PSCustomObject]@{Severity="MEDIUM"; Artifact="Doctrine Checkpoint"; Detail="last_verified is empty or has placeholder value"; Days="n/a"}
        $MediumCount++
    } else {
        try {
            $verifiedDate = [datetime]::Parse($lastVerified).ToUniversalTime()
            $checkpointEpoch = [long]$verifiedDate.Subtract([datetime]'1970-01-01').TotalSeconds
            $daysSince = Get-DaysBetween $checkpointEpoch $NowEpoch
            $srcEpoch = Get-GitDirLastModifiedEpoch "src"

            if ($daysSince -gt $THRESHOLD_CHECKPOINT) {
                if ($srcEpoch -and $srcEpoch -gt $checkpointEpoch) {
                    Write-Host "  [STALE] $checkpointFile - $daysSince days since verified AND src/ modified since" -ForegroundColor Yellow
                    $Findings += [PSCustomObject]@{Severity="MEDIUM"; Artifact="Doctrine Checkpoint"; Detail="Checkpoint ${daysSince}d stale, src/ modified since last verification"; Days=$daysSince}
                    $MediumCount++
                } else {
                    Write-Host "  [OK] $checkpointFile - ${daysSince}d old but no src/ changes since" -ForegroundColor Green
                }
            } else {
                Write-Host "  [OK] $checkpointFile - verified $daysSince days ago (threshold: $THRESHOLD_CHECKPOINT)" -ForegroundColor Green
            }
        } catch {
            Write-Host "  [WARN] Cannot parse last_verified date: $lastVerified" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# CHECK 7: Doctrine Version Staleness
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Check 7: Doctrine Version Staleness -----------------------"

if (-not (Test-Path "DOCTRINE.md")) {
    Write-Host "  [SKIP] DOCTRINE.md not found (not a staleness issue)" -ForegroundColor Cyan
} else {
    $childVersion = "unknown"
    $docContent = Get-Content "DOCTRINE.md" -Raw
    if ($docContent -match 'Doctrine Version[^|]*\|\s*([^|]+)\|') {
        $childVersion = $Matches[1].Trim().Replace('*','').Trim()
    }

    $parentVersion = $null
    $searchPaths = @(
        "..\imo-creator",
        "..\..\imo-creator",
        "$env:USERPROFILE\Desktop\Cursor Builds\imo-creator"
    )

    foreach ($sp in $searchPaths) {
        $mf = Join-Path $sp "templates\TEMPLATES_MANIFEST.yaml"
        if (Test-Path $mf) {
            $mfContent = Get-Content $mf -Raw
            if ($mfContent -match '^\s+version:\s*(.+)$') {
                $parentVersion = $Matches[1].Trim().Trim('"').Trim("'")
            }
            break
        }
    }

    if (-not $parentVersion) {
        Write-Host "  [SKIP] imo-creator not accessible (cannot compare versions)" -ForegroundColor Cyan
        Write-Host "         Child version: $childVersion"
    } elseif ($childVersion -eq $parentVersion) {
        Write-Host "  [OK] Doctrine version current (v$childVersion)" -ForegroundColor Green
    } elseif ($childVersion -eq "unknown") {
        Write-Host "  [STALE] Child version unknown, parent is v$parentVersion" -ForegroundColor Red
        $Findings += [PSCustomObject]@{Severity="HIGH"; Artifact="Doctrine Version"; Detail="Child version unknown, parent is v$parentVersion"; Days="n/a"}
        $HighCount++
    } else {
        Write-Host "  [STALE] Child v$childVersion behind parent v$parentVersion" -ForegroundColor Red
        Write-Host "         Run: .\scripts\update_from_imo_creator.ps1"
        $Findings += [PSCustomObject]@{Severity="HIGH"; Artifact="Doctrine Version"; Detail="Child v$childVersion behind parent v$parentVersion"; Days="n/a"}
        $HighCount++
    }
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  STALENESS AUDIT RESULTS" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

$totalFindings = $Findings.Count

if ($totalFindings -eq 0) {
    Write-Host "  [PASS] No staleness detected" -ForegroundColor Green
    Write-Host ""
    Write-Host "  All governance artifacts are current relative to code changes."
    Write-Host ""
    exit 0
}

# Print findings table
$fmt = "  {0,-10} {1,-28} {2,-45} {3}"
Write-Host ($fmt -f "SEVERITY", "ARTIFACT", "DETAIL", "DAYS")
Write-Host ($fmt -f "--------", "----------------------------", "---------------------------------------------", "----")

foreach ($f in $Findings) {
    $color = switch ($f.Severity) {
        "CRITICAL" { "Red" }
        "HIGH"     { "Red" }
        "MEDIUM"   { "Yellow" }
        default    { "White" }
    }
    Write-Host ($fmt -f $f.Severity, $f.Artifact, $f.Detail, $f.Days) -ForegroundColor $color
}

Write-Host ""
Write-Host "  -----------------------------------------------------------------"
Write-Host "  CRITICAL: $CriticalCount  HIGH: $HighCount  MEDIUM: $MediumCount"
Write-Host ""

if ($CriticalCount -gt 0 -or $HighCount -gt 0) {
    Write-Host "  VERDICT: STALE - CRITICAL/HIGH staleness found" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Remediation required before audit can pass."

    if ($CriticalCount -gt 0) {
        Write-Host "  CRITICAL items must be fixed immediately."
    }
    if ($HighCount -gt 0) {
        Write-Host "  HIGH items block compliance."
    }

    Write-Host ""
    exit 1
} else {
    Write-Host "  VERDICT: PASS WITH WARNINGS - MEDIUM staleness only" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Medium staleness items should be addressed but do not block compliance."
    Write-Host ""
    exit 0
}
