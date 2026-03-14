# ═══════════════════════════════════════════════════════════════════════════════
# CTB REGISTRY GATE — Build-Time Registry Enforcement (Windows)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Validate migrations vs column_registry.yml + sub-hub cardinality
# Doctrine: CTB_REGISTRY_ENFORCEMENT.md §3, ARCHITECTURE.md Part X §3
# Usage: powershell -ExecutionPolicy Bypass -File scripts/ctb-registry-gate.ps1
# Exit: 0 = pass, 1 = violations found, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

$Violations = 0
$Warnings = 0
$TablesInMigrations = @()
$TablesInRegistry = @()

Write-Host ""
Write-Host "==================================================================="
Write-Host "  CTB REGISTRY GATE"
Write-Host "==================================================================="
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ───────────────────────────────────────────────────────────────────
$yqPath = Get-Command yq -ErrorAction SilentlyContinue
if (-not $yqPath) {
    Write-Host "[ERROR] yq is required but not installed" -ForegroundColor Red
    Write-Host "        Install: https://github.com/mikefarah/yq"
    exit 2
}

# ───────────────────────────────────────────────────────────────────
# LOCATE ARTIFACTS
# ───────────────────────────────────────────────────────────────────
$RegistryFile = $null
if (Test-Path "column_registry.yml") {
    $RegistryFile = "column_registry.yml"
} elseif (Test-Path "src/data/db/registry/column_registry.yml") {
    $RegistryFile = "src/data/db/registry/column_registry.yml"
} else {
    Write-Host "[ERROR] column_registry.yml not found" -ForegroundColor Red
    exit 1
}

$MigrationsDir = $null
if (Test-Path "migrations" -PathType Container) {
    $MigrationsDir = "migrations"
} elseif (Test-Path "src/data/db/migrations" -PathType Container) {
    $MigrationsDir = "src/data/db/migrations"
} else {
    Write-Host "[WARNING] migrations/ directory not found" -ForegroundColor Yellow
}

Write-Host "  Registry:   $RegistryFile"
Write-Host "  Migrations: $($MigrationsDir ?? '<not found>')"
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# GATE 1: Extract tables from migrations
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Gate 1: Migration Table Discovery -------------------------"

if ($MigrationsDir) {
    $sqlFiles = Get-ChildItem -Path $MigrationsDir -Filter "*.sql" -ErrorAction SilentlyContinue
    foreach ($file in $sqlFiles) {
        $content = Get-Content $file.FullName -Raw
        $matches = [regex]::Matches($content, 'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z_][a-zA-Z0-9_.]*)', 'IgnoreCase')
        foreach ($match in $matches) {
            $tableName = $match.Groups[1].Value
            # Skip ctb schema tables
            if ($tableName -match "^ctb\.") { continue }
            $TablesInMigrations += $tableName
        }
    }

    if ($TablesInMigrations.Count -eq 0) {
        Write-Host "  [INFO] No CREATE TABLE statements found" -ForegroundColor Yellow
    } else {
        Write-Host "  Found $($TablesInMigrations.Count) table(s) in migrations:"
        foreach ($t in $TablesInMigrations) { Write-Host "    - $t" }
    }
} else {
    Write-Host "  [SKIP] No migrations directory" -ForegroundColor Yellow
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# GATE 2: Extract tables from column_registry.yml
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Gate 2: Registry Table Discovery --------------------------"

$spineName = & yq '.spine_table.name' $RegistryFile 2>$null
$spineSchema = & yq '.spine_table.schema' $RegistryFile 2>$null

if ($spineName -and $spineName -ne "null" -and $spineName -notmatch '^\[') {
    if ($spineSchema -and $spineSchema -ne "null" -and $spineSchema -notmatch '^\[') {
        $TablesInRegistry += "${spineSchema}.${spineName}"
    } else {
        $TablesInRegistry += $spineName
    }
    Write-Host "  Spine: $spineName"
}

$subhubCount = & yq '.subhubs | length' $RegistryFile 2>$null
if ($subhubCount -and $subhubCount -ne "0" -and $subhubCount -ne "null") {
    for ($s = 0; $s -lt [int]$subhubCount; $s++) {
        $tableCount = & yq ".subhubs[$s].tables | length" $RegistryFile 2>$null
        if ($tableCount -and $tableCount -ne "0" -and $tableCount -ne "null") {
            for ($t = 0; $t -lt [int]$tableCount; $t++) {
                $tName = & yq ".subhubs[$s].tables[$t].name" $RegistryFile 2>$null
                $tSchema = & yq ".subhubs[$s].tables[$t].schema" $RegistryFile 2>$null
                if ($tName -and $tName -ne "null" -and $tName -notmatch '^\[') {
                    if ($tSchema -and $tSchema -ne "null" -and $tSchema -notmatch '^\[') {
                        $TablesInRegistry += "${tSchema}.${tName}"
                    } else {
                        $TablesInRegistry += $tName
                    }
                }
            }
        }
    }
}

Write-Host "  Found $($TablesInRegistry.Count) table(s) in registry"
foreach ($t in $TablesInRegistry) { Write-Host "    - $t" }
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# GATE 3: Orphaned tables
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Gate 3: Orphaned Table Detection --------------------------"

if ($MigrationsDir -and $TablesInMigrations.Count -gt 0) {
    $orphaned = 0
    foreach ($mTable in $TablesInMigrations) {
        $found = $false
        $mBare = ($mTable -split '\.')[-1]
        foreach ($rTable in $TablesInRegistry) {
            $rBare = ($rTable -split '\.')[-1]
            if ($mTable -eq $rTable -or $mBare -eq $rBare) {
                $found = $true
                break
            }
        }
        if (-not $found) {
            Write-Host "[VIOLATION] ORPHANED_TABLE: $mTable in migrations but NOT in column_registry.yml" -ForegroundColor Red
            $Violations++
            $orphaned++
        }
    }
    if ($orphaned -eq 0) {
        Write-Host "  [PASS] All migration tables are registered" -ForegroundColor Green
    }
} else {
    Write-Host "  [SKIP] No migration tables to cross-reference" -ForegroundColor Yellow
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# GATE 4: Phantom tables
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Gate 4: Phantom Table Detection ---------------------------"

if ($MigrationsDir -and $TablesInRegistry.Count -gt 0) {
    $phantoms = 0
    foreach ($rTable in $TablesInRegistry) {
        $found = $false
        $rBare = ($rTable -split '\.')[-1]
        foreach ($mTable in $TablesInMigrations) {
            $mBare = ($mTable -split '\.')[-1]
            if ($rTable -eq $mTable -or $rBare -eq $mBare) {
                $found = $true
                break
            }
        }
        if (-not $found) {
            Write-Host "[WARNING] PHANTOM_TABLE: $rTable in registry but no migration found" -ForegroundColor Yellow
            $Warnings++
            $phantoms++
        }
    }
    if ($phantoms -eq 0) {
        Write-Host "  [PASS] All registry tables have migrations" -ForegroundColor Green
    }
} else {
    Write-Host "  [SKIP] No tables to cross-reference" -ForegroundColor Yellow
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# GATE 5: Sub-hub cardinality
# ───────────────────────────────────────────────────────────────────
Write-Host "--- Gate 5: Sub-Hub Cardinality Enforcement -------------------"

if ($subhubCount -and $subhubCount -ne "0" -and $subhubCount -ne "null") {
    for ($s = 0; $s -lt [int]$subhubCount; $s++) {
        $shId = & yq ".subhubs[$s].subhub_id" $RegistryFile 2>$null
        $shName = & yq ".subhubs[$s].name" $RegistryFile 2>$null
        $tCount = & yq ".subhubs[$s].tables | length" $RegistryFile 2>$null

        $canonical = 0; $error = 0; $supporting = 0

        if ($tCount -and $tCount -ne "0" -and $tCount -ne "null") {
            for ($t = 0; $t -lt [int]$tCount; $t++) {
                $leaf = (& yq ".subhubs[$s].tables[$t].leaf_type" $RegistryFile 2>$null).ToUpper()
                switch ($leaf) {
                    "CANONICAL" { $canonical++ }
                    "ERROR"     { $error++ }
                    { $_ -in "STAGING","MV","REGISTRY" } { $supporting++ }
                }
            }
        }

        Write-Host "  Sub-hub: $shName ($shId)"
        Write-Host "    CANONICAL: $canonical  ERROR: $error  SUPPORTING: $supporting"

        if ($canonical -eq 0 -and $error -eq 0 -and $supporting -eq 0) {
            Write-Host "    [SKIP] Template state" -ForegroundColor Yellow
            continue
        }

        if ($canonical -ne 1) {
            Write-Host "[VIOLATION] Sub-hub $shName ($shId): Must have exactly 1 CANONICAL (found $canonical)" -ForegroundColor Red
            $Violations++
        }
        if ($error -ne 1) {
            Write-Host "[VIOLATION] Sub-hub $shName ($shId): Must have exactly 1 ERROR (found $error)" -ForegroundColor Red
            $Violations++
        }
        if ($supporting -gt 2) {
            Write-Host "[VIOLATION] Sub-hub $shName ($shId): At most 2 SUPPORTING (found $supporting)" -ForegroundColor Red
            $Violations++
        }
        if ($canonical -eq 1 -and $error -eq 1 -and $supporting -le 2) {
            Write-Host "    [PASS] Cardinality OK" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  [SKIP] No sub-hubs declared" -ForegroundColor Yellow
}

Write-Host ""

# ───────────────────────────────────────────────────────────────────
# GENERATE REPORTS
# ───────────────────────────────────────────────────────────────────
$status = if ($Violations -gt 0) { "FAIL" } else { "PASS" }
$timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$jsonReport = @{
    timestamp = $timestamp
    registry_file = $RegistryFile
    migrations_dir = $MigrationsDir
    tables_in_migrations = $TablesInMigrations.Count
    tables_in_registry = $TablesInRegistry.Count
    violations = $Violations
    warnings = $Warnings
    status = $status
} | ConvertTo-Json

$jsonReport | Out-File -FilePath ".ctb-registry-gate-report.json" -Encoding UTF8

Write-Host "  Reports written: .ctb-registry-gate-report.json"

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "==================================================================="

if ($Violations -gt 0) {
    Write-Host "FAILED: $Violations violation(s), $Warnings warning(s)" -ForegroundColor Red
    exit 1
} elseif ($Warnings -gt 0) {
    Write-Host "PASSED WITH WARNINGS: $Warnings warning(s)" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "PASSED: Registry gate clear" -ForegroundColor Green
    exit 0
}
