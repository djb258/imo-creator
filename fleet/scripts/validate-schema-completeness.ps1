# ═══════════════════════════════════════════════════════════════════════════════
# VALIDATE SCHEMA COMPLETENESS — DBA Enforcement Gate (Windows)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Validate every table and column in column_registry.yml has complete metadata
# Doctrine: DBA_ENFORCEMENT_DOCTRINE.md Gate B, DOCUMENTATION_ERD_DOCTRINE.md
# Usage: .\scripts\validate-schema-completeness.ps1
# Exit: 0 = complete, 1 = violations found, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

$Violations = 0
$Warnings = 0
$TablesChecked = 0
$ColumnsChecked = 0

Write-Host ""
Write-Host "==================================================================="
Write-Host "  SCHEMA COMPLETENESS VALIDATION"
Write-Host "==================================================================="
Write-Host ""

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

# Test PyYAML availability
$yamlTest = & $pythonCmd -c "import yaml; print('ok')" 2>&1
if ($yamlTest -ne "ok") {
    Write-Host "[ERROR] PyYAML is required but not installed" -ForegroundColor Red
    Write-Host "        Install: pip install pyyaml"
    exit 2
}

# ───────────────────────────────────────────────────────────────────
# LOCATE REGISTRY
# ───────────────────────────────────────────────────────────────────
$RegistryFile = $null
if (Test-Path "column_registry.yml") {
    $RegistryFile = "column_registry.yml"
} elseif (Test-Path "src\data\db\registry\column_registry.yml") {
    $RegistryFile = "src\data\db\registry\column_registry.yml"
} else {
    Write-Host "[ERROR] column_registry.yml not found" -ForegroundColor Red
    Write-Host "        Searched: .\column_registry.yml"
    Write-Host "        Searched: .\src\data\db\registry\column_registry.yml"
    exit 1
}

Write-Host "  Registry: $RegistryFile"
Write-Host ""

# ───────────────────────────────────────────────────────────────────
# RUN VALIDATION VIA PYTHON
# ───────────────────────────────────────────────────────────────────
# Delegate to Python for reliable YAML parsing. Output is captured and displayed.

$pythonScript = @'
import sys
import yaml
import os

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
NC = '\033[0m'

VALID_SEMANTIC_ROLES = {'identifier', 'foreign_key', 'attribute', 'metric'}
VALID_FORMATS = {'UUID', 'ISO-8601', 'USD_CENTS', 'EMAIL', 'ENUM', 'JSON', 'BOOLEAN', 'STRING', 'INTEGER'}
VALID_LEAF_TYPES = {'CANONICAL', 'ERROR'}
VALID_STRATEGIES = {'UUID', 'SERIAL', 'COMPOSITE'}
VALID_DB_TYPES = {
    'UUID', 'TEXT', 'VARCHAR', 'CHAR',
    'INTEGER', 'INT', 'BIGINT', 'SMALLINT', 'SERIAL', 'BIGSERIAL',
    'BOOLEAN', 'BOOL',
    'TIMESTAMP', 'TIMESTAMPTZ', 'DATE', 'TIME', 'TIMETZ',
    'NUMERIC', 'DECIMAL', 'FLOAT', 'REAL',
    'JSON', 'JSONB', 'BYTEA', 'ARRAY', 'INTERVAL', 'MONEY', 'INET',
}

violations = []
warnings = []
tables_checked = 0
columns_checked = 0

def is_placeholder(val):
    if val is None:
        return True
    s = str(val).strip()
    return not s or s == 'null' or (s.startswith('[') and s.endswith(']'))

def validate_column(table_name, col):
    global columns_checked
    columns_checked += 1
    col_name = col.get('name', '???')
    prefix = f"Table '{table_name}', Column '{col_name}'"

    if is_placeholder(col.get('name')):
        violations.append(f"{prefix}: 'name' is missing or placeholder")
    desc = col.get('description', '')
    if is_placeholder(desc):
        violations.append(f"{prefix}: 'description' is missing or placeholder")
    elif len(str(desc).strip()) < 10:
        violations.append(f"{prefix}: 'description' too short ({len(str(desc).strip())} chars, min 10)")
    col_type = col.get('type', '')
    if is_placeholder(col_type):
        violations.append(f"{prefix}: 'type' is missing or placeholder")
    elif str(col_type).upper() not in VALID_DB_TYPES:
        warnings.append(f"{prefix}: 'type' = '{col_type}' not in standard list (may be valid)")
    nullable = col.get('nullable')
    if nullable is None or is_placeholder(nullable):
        violations.append(f"{prefix}: 'nullable' must be explicitly true or false")
    elif str(nullable).lower() not in ('true', 'false'):
        violations.append(f"{prefix}: 'nullable' = '{nullable}' (must be true or false)")
    role = col.get('semantic_role', '')
    if is_placeholder(role):
        violations.append(f"{prefix}: 'semantic_role' is missing or placeholder")
    elif str(role).lower() not in VALID_SEMANTIC_ROLES:
        violations.append(f"{prefix}: 'semantic_role' = '{role}' (must be: {', '.join(sorted(VALID_SEMANTIC_ROLES))})")
    fmt = col.get('format', '')
    if is_placeholder(fmt):
        violations.append(f"{prefix}: 'format' is missing or placeholder")
    elif str(fmt).upper() not in VALID_FORMATS:
        warnings.append(f"{prefix}: 'format' = '{fmt}' not in standard list (may be valid)")

def validate_table(table, is_spine=False):
    global tables_checked
    tables_checked += 1
    table_name = table.get('name', '???')
    prefix = f"Table '{table_name}'"

    if is_placeholder(table.get('name')):
        violations.append(f"{prefix}: 'name' is missing or placeholder")
    desc = table.get('description', '')
    if is_placeholder(desc):
        violations.append(f"{prefix}: 'description' is missing or placeholder")
    elif len(str(desc).strip()) < 10:
        violations.append(f"{prefix}: 'description' too short ({len(str(desc).strip())} chars, min 10)")
    leaf = table.get('leaf_type', '')
    if is_placeholder(leaf):
        violations.append(f"{prefix}: 'leaf_type' is missing or placeholder")
    elif str(leaf).upper() not in VALID_LEAF_TYPES:
        warnings.append(f"{prefix}: 'leaf_type' = '{leaf}' (not CANONICAL/ERROR - ADR required)")
    sot = table.get('source_of_truth')
    if sot is None or is_placeholder(sot):
        violations.append(f"{prefix}: 'source_of_truth' must be explicitly true or false")
    elif str(sot).lower() not in ('true', 'false'):
        violations.append(f"{prefix}: 'source_of_truth' = '{sot}' (must be true or false)")
    ris = table.get('row_identity_strategy', '')
    if is_placeholder(ris):
        violations.append(f"{prefix}: 'row_identity_strategy' is missing or placeholder")
    elif str(ris).upper() not in VALID_STRATEGIES:
        violations.append(f"{prefix}: 'row_identity_strategy' = '{ris}' (must be: {', '.join(sorted(VALID_STRATEGIES))})")

    columns = table.get('columns', []) or []
    if not columns:
        violations.append(f"{prefix}: No columns declared")
    else:
        for col in columns:
            if isinstance(col, dict):
                validate_column(table_name, col)

def main():
    registry_path = sys.argv[1]
    with open(registry_path, 'r') as f:
        data = yaml.safe_load(f)
    if not data:
        print(f"{RED}[VIOLATION]{NC} column_registry.yml is empty or invalid")
        sys.exit(1)

    spine = data.get('spine_table')
    if spine and isinstance(spine, dict) and not is_placeholder(spine.get('name')):
        print("--- Spine Table ---")
        validate_table(spine, is_spine=True)
        print(f"  {GREEN}[CHECKED]{NC} Spine: {spine.get('name')}")

    subhubs = data.get('subhubs', []) or []
    if subhubs:
        print("\n--- Sub-Hub Tables ---")
        for sh in subhubs:
            if not isinstance(sh, dict):
                continue
            sh_id = sh.get('subhub_id', '???')
            sh_name = sh.get('name', '???')
            if is_placeholder(sh_id):
                violations.append(f"Sub-hub: 'subhub_id' is missing or placeholder")
            if is_placeholder(sh_name):
                violations.append(f"Sub-hub: 'name' is missing or placeholder")
            print(f"\n  Sub-hub: {sh_name} ({sh_id})")
            tables = sh.get('tables', []) or []
            for table in tables:
                if isinstance(table, dict):
                    validate_table(table)
                    print(f"    {GREEN}[CHECKED]{NC} {table.get('name', '???')}")

    print(f"\n---")
    print(f"  Tables checked:  {tables_checked}")
    print(f"  Columns checked: {columns_checked}")
    print()

    if violations:
        for v in violations:
            print(f"{RED}[VIOLATION]{NC} {v}")
    if warnings:
        for w in warnings:
            print(f"{YELLOW}[WARNING]{NC} {w}")
    print()

    if violations:
        print(f"{RED}FAILED{NC}: {len(violations)} violation(s), {len(warnings)} warning(s)")
        sys.exit(1)
    elif warnings:
        print(f"{YELLOW}PASSED WITH WARNINGS{NC}: {len(warnings)} warning(s)")
        sys.exit(0)
    else:
        print(f"{GREEN}PASSED{NC}: Schema metadata complete")
        sys.exit(0)

if __name__ == '__main__':
    main()
'@

$tempFile = [System.IO.Path]::GetTempFileName() + ".py"
$pythonScript | Out-File -FilePath $tempFile -Encoding utf8

try {
    & $pythonCmd $tempFile $RegistryFile
    $exitCode = $LASTEXITCODE
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

exit $exitCode
