#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# DETECT BANNED DB CLIENTS — Direct Database Access Detection
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Detect direct database client imports that bypass the Gatekeeper
# Doctrine: CTB_REGISTRY_ENFORCEMENT.md §5.3
# Usage: ./scripts/detect-banned-db-clients.sh
# Exit: 0 = no violations, 1 = banned patterns found, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  BANNED DB CLIENT DETECTION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK: src/ directory exists
# ───────────────────────────────────────────────────────────────────
if [ ! -d "src" ]; then
    echo -e "  ${YELLOW}[SKIP]${NC} src/ directory not found — nothing to scan"
    exit 0
fi

# ───────────────────────────────────────────────────────────────────
# BANNED PATTERNS
# Direct database client usage that bypasses the Gatekeeper module.
# ───────────────────────────────────────────────────────────────────

# Pattern format: "REGEX|DESCRIPTION"
BANNED_PATTERNS=(
    'from\s+["\x27]pg["\x27]|Node.js pg client import'
    'require\s*\(\s*["\x27]pg["\x27]\s*\)|Node.js pg client require'
    'from\s+["\x27]mysql2["\x27]|MySQL2 client import'
    'require\s*\(\s*["\x27]mysql2["\x27]\s*\)|MySQL2 client require'
    'import\s+psycopg2|Python psycopg2 import'
    'import\s+asyncpg|Python asyncpg import'
    'from\s+sqlalchemy|Python SQLAlchemy import'
    'import\s+sqlalchemy|Python SQLAlchemy import'
    'new\s+Pool\s*\(|Direct connection pool creation'
    'new\s+Client\s*\(|Direct database client creation'
    'createConnection\s*\(|Direct connection creation'
    'createPool\s*\(|Direct pool creation'
    'postgres://[^\s]+|PostgreSQL connection string literal'
    'postgresql://[^\s]+|PostgreSQL connection string literal'
    'mysql://[^\s]+|MySQL connection string literal'
)

# Directories to skip
SKIP_DIRS=(
    "node_modules"
    "generated"
    "gatekeeper"
    ".git"
    "dist"
    "build"
    "__pycache__"
)

# Build find exclusion args
EXCLUDE_ARGS=""
for dir in "${SKIP_DIRS[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS -not -path '*/\${dir}/*'"
done

# File extensions to scan
FILE_PATTERN="-name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.py' -o -name '*.mjs' -o -name '*.cjs'"

echo "  Scanning src/ for banned database client patterns..."
echo ""

# ───────────────────────────────────────────────────────────────────
# SCAN
# ───────────────────────────────────────────────────────────────────
for entry in "${BANNED_PATTERNS[@]}"; do
    PATTERN="${entry%%|*}"
    DESC="${entry##*|}"

    # Search for pattern in src/ files
    MATCHES=$(eval "find src -type f \\( $FILE_PATTERN \\) $EXCLUDE_ARGS" 2>/dev/null \
        | xargs grep -lE "$PATTERN" 2>/dev/null || true)

    if [ -n "$MATCHES" ]; then
        echo "$MATCHES" | while IFS= read -r file; do
            echo -e "  ${RED}[VIOLATION]${NC} $DESC"
            echo "              File: $file"
            echo "              Pattern: $PATTERN"

            # Show matching line(s) for context
            grep -nE "$PATTERN" "$file" 2>/dev/null | head -3 | while IFS= read -r line; do
                echo "              Line: $line"
            done
            echo ""
        done
        # Count unique files with violations
        MATCH_COUNT=$(echo "$MATCHES" | wc -l | tr -d ' ')
        VIOLATIONS=$((VIOLATIONS + MATCH_COUNT))
    fi
done

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════"

if [ "$VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}FAILED${NC}: $VIOLATIONS file(s) with banned database client patterns"
    echo ""
    echo "All database writes MUST go through the Gatekeeper module."
    echo "Direct database client imports are BANNED."
    echo ""
    echo "Fix: Replace direct DB access with Gatekeeper methods:"
    echo "  import { Gatekeeper } from './modules/gatekeeper/index.ts';"
    echo ""
    echo "Doctrine: CTB_REGISTRY_ENFORCEMENT.md §5.3"
    echo ""
    exit 1
else
    echo -e "${GREEN}PASSED${NC}: No banned database client patterns found"
    echo ""
    exit 0
fi
