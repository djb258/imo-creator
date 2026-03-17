#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# DETECT STALENESS — Governance Artifact Freshness Audit
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Detect when governance artifacts are stale relative to code changes
# Usage: ./scripts/detect-staleness.sh [--verbose] [--json]
# Exit: 0 = no CRITICAL/HIGH staleness, 1 = CRITICAL/HIGH staleness found
# ═══════════════════════════════════════════════════════════════════════════════
#
# This is a PERIODIC audit script, NOT a pre-commit hook.
# Run as part of the quarterly hygiene audit or on-demand.
#
# What "stale" means:
#   A governance artifact is STALE when code has changed significantly
#   since the artifact was last updated. This means the artifact may
#   no longer accurately describe the system it governs.
#
# What "stale" does NOT mean:
#   - MISSING artifacts (caught by existing checks)
#   - INVALID artifacts (caught by validation scripts)
#   - DRAFT artifacts (caught by checkpoint system)
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ───────────────────────────────────────────────────────────────────
# CONFIGURABLE THRESHOLDS (days)
# Tune these to match your team's cadence.
# ───────────────────────────────────────────────────────────────────
THRESHOLD_PRD=30          # src/ modified >30 days after PRD
THRESHOLD_ERD=14          # column_registry modified >14 days after ERD
THRESHOLD_OSAM=30         # src/data/ modified >30 days after OSAM
THRESHOLD_REGISTRY=7      # SQL changes >7 days after column_registry
THRESHOLD_CHECKPOINT=7    # last_verified >7 days AND src/ modified since

# ───────────────────────────────────────────────────────────────────
# COLORS & FORMATTING
# ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ───────────────────────────────────────────────────────────────────
# STATE
# ───────────────────────────────────────────────────────────────────
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
FINDINGS=()
VERBOSE=false
JSON_OUTPUT=false

# ───────────────────────────────────────────────────────────────────
# PARSE ARGUMENTS
# ───────────────────────────────────────────────────────────────────
for arg in "$@"; do
    case "$arg" in
        --verbose) VERBOSE=true ;;
        --json) JSON_OUTPUT=true ;;
        *) echo -e "${RED}[ERROR]${NC} Unknown argument: $arg"; exit 2 ;;
    esac
done

# ───────────────────────────────────────────────────────────────────
# HELPER: Get last modified date of a file via git log (epoch)
# Falls back to file system date if not tracked by git.
# Returns empty string if file does not exist.
# ───────────────────────────────────────────────────────────────────
get_last_modified_epoch() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo ""
        return
    fi

    # Try git log first (more reliable than filesystem after git ops)
    local git_date
    git_date=$(git log -1 --format="%ct" -- "$file" 2>/dev/null || echo "")

    if [ -n "$git_date" ] && [ "$git_date" != "" ]; then
        echo "$git_date"
    else
        # Fallback: filesystem date (stat is platform-dependent)
        if stat --version &>/dev/null 2>&1; then
            # GNU stat (Linux)
            stat -c "%Y" "$file" 2>/dev/null || echo ""
        else
            # BSD stat (macOS)
            stat -f "%m" "$file" 2>/dev/null || echo ""
        fi
    fi
}

# ───────────────────────────────────────────────────────────────────
# HELPER: Get newest commit epoch for any file under a directory
# Returns empty string if no tracked files found.
# ───────────────────────────────────────────────────────────────────
get_dir_last_modified_epoch() {
    local dir="$1"
    local pattern="${2:-}"

    if [ ! -d "$dir" ]; then
        echo ""
        return
    fi

    local git_date
    if [ -n "$pattern" ]; then
        git_date=$(git log -1 --format="%ct" -- "$dir"/$pattern 2>/dev/null || echo "")
    else
        git_date=$(git log -1 --format="%ct" -- "$dir" 2>/dev/null || echo "")
    fi

    echo "$git_date"
}

# ───────────────────────────────────────────────────────────────────
# HELPER: Get newest commit epoch for SQL files (*.sql) anywhere
# ───────────────────────────────────────────────────────────────────
get_sql_last_modified_epoch() {
    local git_date
    git_date=$(git log -1 --format="%ct" -- "*.sql" "**/*.sql" 2>/dev/null || echo "")
    echo "$git_date"
}

# ───────────────────────────────────────────────────────────────────
# HELPER: Calculate days between two epochs
# ───────────────────────────────────────────────────────────────────
days_between() {
    local epoch1="$1"  # older
    local epoch2="$2"  # newer

    if [ -z "$epoch1" ] || [ -z "$epoch2" ]; then
        echo "0"
        return
    fi

    local diff=$(( (epoch2 - epoch1) / 86400 ))
    if [ "$diff" -lt 0 ]; then
        diff=0
    fi
    echo "$diff"
}

# ───────────────────────────────────────────────────────────────────
# HELPER: Record a finding
# ───────────────────────────────────────────────────────────────────
record_finding() {
    local artifact="$1"
    local severity="$2"
    local detail="$3"
    local days_stale="${4:-n/a}"

    FINDINGS+=("${severity}|${artifact}|${detail}|${days_stale}")

    case "$severity" in
        CRITICAL) ((CRITICAL_COUNT++)) ;;
        HIGH)     ((HIGH_COUNT++)) ;;
        MEDIUM)   ((MEDIUM_COUNT++)) ;;
    esac
}

# ───────────────────────────────────────────────────────────────────
# HELPER: Current epoch
# ───────────────────────────────────────────────────────────────────
NOW_EPOCH=$(date +%s)

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  STALENESS DETECTION AUDIT"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Date:       $(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date)"
echo "  Repository: $(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")"
echo ""
echo "  Thresholds:"
echo "    PRD:              ${THRESHOLD_PRD} days"
echo "    ERD:              ${THRESHOLD_ERD} days"
echo "    OSAM:             ${THRESHOLD_OSAM} days"
echo "    Column Registry:  ${THRESHOLD_REGISTRY} days"
echo "    Checkpoint:       ${THRESHOLD_CHECKPOINT} days"
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 1: PRD Staleness
# If src/ has been modified >THRESHOLD_PRD days after PRD → STALE
# ───────────────────────────────────────────────────────────────────
echo "─── Check 1: PRD Staleness ────────────────────────────────────"

PRD_FILE=""
for candidate in "PRD.md" "docs/PRD.md" "prd/PRD.md"; do
    if [ -f "$candidate" ]; then
        PRD_FILE="$candidate"
        break
    fi
done

if [ -z "$PRD_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} PRD not found (not a staleness issue)"
    if [ "$VERBOSE" = true ]; then
        echo "         Searched: PRD.md, docs/PRD.md, prd/PRD.md"
    fi
else
    PRD_EPOCH=$(get_last_modified_epoch "$PRD_FILE")
    SRC_EPOCH=$(get_dir_last_modified_epoch "src")

    if [ -z "$SRC_EPOCH" ] || [ -z "$PRD_EPOCH" ]; then
        echo -e "  ${CYAN}[SKIP]${NC} Cannot determine dates (no git history for src/ or PRD)"
    else
        DAYS=$(days_between "$PRD_EPOCH" "$SRC_EPOCH")
        if [ "$DAYS" -gt "$THRESHOLD_PRD" ]; then
            echo -e "  ${RED}[STALE]${NC} $PRD_FILE — src/ modified ${DAYS} days after PRD (threshold: ${THRESHOLD_PRD})"
            record_finding "PRD ($PRD_FILE)" "HIGH" "src/ modified ${DAYS}d after PRD last update" "$DAYS"
        else
            echo -e "  ${GREEN}[OK]${NC} $PRD_FILE — current (src/ ${DAYS}d ahead, threshold: ${THRESHOLD_PRD})"
        fi
    fi
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 2: ERD Staleness
# If column_registry.yml modified >THRESHOLD_ERD days after ERD
# ───────────────────────────────────────────────────────────────────
echo "─── Check 2: ERD Staleness ────────────────────────────────────"

ERD_FILE=""
for candidate in "SCHEMA.md" "docs/SCHEMA.md" "data/SCHEMA.md" "ERD.md" "docs/ERD.md"; do
    if [ -f "$candidate" ]; then
        ERD_FILE="$candidate"
        break
    fi
done

REGISTRY_FILE=""
for candidate in "column_registry.yml" "data/column_registry.yml" "docs/column_registry.yml"; do
    if [ -f "$candidate" ]; then
        REGISTRY_FILE="$candidate"
        break
    fi
done

if [ -z "$ERD_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} ERD/SCHEMA.md not found (not a staleness issue)"
elif [ -z "$REGISTRY_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} column_registry.yml not found (not a staleness issue)"
else
    ERD_EPOCH=$(get_last_modified_epoch "$ERD_FILE")
    REG_EPOCH=$(get_last_modified_epoch "$REGISTRY_FILE")

    if [ -z "$ERD_EPOCH" ] || [ -z "$REG_EPOCH" ]; then
        echo -e "  ${CYAN}[SKIP]${NC} Cannot determine dates (no git history)"
    else
        DAYS=$(days_between "$ERD_EPOCH" "$REG_EPOCH")
        if [ "$DAYS" -gt "$THRESHOLD_ERD" ]; then
            echo -e "  ${RED}[STALE]${NC} $ERD_FILE — registry modified ${DAYS} days after ERD (threshold: ${THRESHOLD_ERD})"
            record_finding "ERD ($ERD_FILE)" "HIGH" "column_registry modified ${DAYS}d after ERD last update" "$DAYS"
        else
            echo -e "  ${GREEN}[OK]${NC} $ERD_FILE — current (registry ${DAYS}d ahead, threshold: ${THRESHOLD_ERD})"
        fi
    fi
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 3: OSAM Staleness
# If src/data/ modified >THRESHOLD_OSAM days after OSAM
# ───────────────────────────────────────────────────────────────────
echo "─── Check 3: OSAM Staleness ───────────────────────────────────"

OSAM_FILE=""
for candidate in "OSAM.md" "docs/OSAM.md" "semantic/OSAM.md"; do
    if [ -f "$candidate" ]; then
        OSAM_FILE="$candidate"
        break
    fi
done

if [ -z "$OSAM_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} OSAM.md not found (not a staleness issue)"
else
    OSAM_EPOCH=$(get_last_modified_epoch "$OSAM_FILE")

    # Check src/data/ first, fall back to data/ or src/
    DATA_EPOCH=""
    for data_dir in "src/data" "data" "src"; do
        if [ -d "$data_dir" ]; then
            DATA_EPOCH=$(get_dir_last_modified_epoch "$data_dir")
            if [ -n "$DATA_EPOCH" ]; then
                break
            fi
        fi
    done

    if [ -z "$DATA_EPOCH" ] || [ -z "$OSAM_EPOCH" ]; then
        echo -e "  ${CYAN}[SKIP]${NC} Cannot determine dates (no git history for data dirs or OSAM)"
    else
        DAYS=$(days_between "$OSAM_EPOCH" "$DATA_EPOCH")
        if [ "$DAYS" -gt "$THRESHOLD_OSAM" ]; then
            echo -e "  ${RED}[STALE]${NC} $OSAM_FILE — data layer modified ${DAYS} days after OSAM (threshold: ${THRESHOLD_OSAM})"
            record_finding "OSAM ($OSAM_FILE)" "HIGH" "Data layer modified ${DAYS}d after OSAM last update" "$DAYS"
        else
            echo -e "  ${GREEN}[OK]${NC} $OSAM_FILE — current (data ${DAYS}d ahead, threshold: ${THRESHOLD_OSAM})"
        fi
    fi
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 4: Column Registry Staleness
# SQL changes >THRESHOLD_REGISTRY days after column_registry → CRITICAL
# ───────────────────────────────────────────────────────────────────
echo "─── Check 4: Column Registry Staleness ─────────────────────────"

if [ -z "$REGISTRY_FILE" ]; then
    # Already searched above
    for candidate in "column_registry.yml" "data/column_registry.yml" "docs/column_registry.yml"; do
        if [ -f "$candidate" ]; then
            REGISTRY_FILE="$candidate"
            break
        fi
    done
fi

if [ -z "$REGISTRY_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} column_registry.yml not found (not a staleness issue)"
else
    REG_EPOCH=$(get_last_modified_epoch "$REGISTRY_FILE")
    SQL_EPOCH=$(get_sql_last_modified_epoch)

    if [ -z "$SQL_EPOCH" ]; then
        echo -e "  ${CYAN}[SKIP]${NC} No SQL files tracked in git"
    elif [ -z "$REG_EPOCH" ]; then
        echo -e "  ${CYAN}[SKIP]${NC} Cannot determine registry date"
    else
        DAYS=$(days_between "$REG_EPOCH" "$SQL_EPOCH")
        if [ "$DAYS" -gt "$THRESHOLD_REGISTRY" ]; then
            echo -e "  ${RED}[STALE]${NC} $REGISTRY_FILE — SQL modified ${DAYS} days after registry (threshold: ${THRESHOLD_REGISTRY})"
            record_finding "Column Registry ($REGISTRY_FILE)" "CRITICAL" "SQL files modified ${DAYS}d after registry last update" "$DAYS"
        else
            echo -e "  ${GREEN}[OK]${NC} $REGISTRY_FILE — current (SQL ${DAYS}d ahead, threshold: ${THRESHOLD_REGISTRY})"
        fi
    fi
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 5: Data Dictionary Staleness
# If column_registry.yml is newer than data dictionary → STALE
# The dictionary is a generated projection; it must stay current.
# ───────────────────────────────────────────────────────────────────
echo "─── Check 5: Data Dictionary Staleness ─────────────────────────"

DICT_FILE=""
for candidate in "DATA_DICTIONARY.md" "docs/DATA_DICTIONARY.md" "data/DATA_DICTIONARY.md"; do
    if [ -f "$candidate" ]; then
        DICT_FILE="$candidate"
        break
    fi
done

if [ -z "$DICT_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} DATA_DICTIONARY.md not found (not a staleness issue)"
elif [ -z "$REGISTRY_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} column_registry.yml not found (cannot compare)"
else
    DICT_EPOCH=$(get_last_modified_epoch "$DICT_FILE")
    REG_EPOCH=$(get_last_modified_epoch "$REGISTRY_FILE")

    if [ -z "$DICT_EPOCH" ] || [ -z "$REG_EPOCH" ]; then
        echo -e "  ${CYAN}[SKIP]${NC} Cannot determine dates"
    else
        if [ "$REG_EPOCH" -gt "$DICT_EPOCH" ]; then
            DAYS=$(days_between "$DICT_EPOCH" "$REG_EPOCH")
            echo -e "  ${YELLOW}[STALE]${NC} $DICT_FILE — registry is ${DAYS} days newer"
            echo "         Regenerate with: ./scripts/generate-data-dictionary.sh"
            record_finding "Data Dictionary ($DICT_FILE)" "MEDIUM" "Registry is ${DAYS}d newer than dictionary (regenerate)" "$DAYS"
        else
            echo -e "  ${GREEN}[OK]${NC} $DICT_FILE — current (dictionary is up to date with registry)"
        fi
    fi
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 6: Doctrine Checkpoint Staleness
# last_verified >THRESHOLD_CHECKPOINT days AND src/ modified since
# ───────────────────────────────────────────────────────────────────
echo "─── Check 6: Doctrine Checkpoint Staleness ─────────────────────"

CHECKPOINT_FILE=""
for candidate in "DOCTRINE_CHECKPOINT.yaml" "DOCTRINE_CHECKPOINT.yml"; do
    if [ -f "$candidate" ]; then
        CHECKPOINT_FILE="$candidate"
        break
    fi
done

if [ -z "$CHECKPOINT_FILE" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} DOCTRINE_CHECKPOINT.yaml not found (not a staleness issue)"
else
    # Extract last_verified from YAML (simple grep — no yq dependency for this)
    LAST_VERIFIED=$(grep "last_verified:" "$CHECKPOINT_FILE" 2>/dev/null \
        | head -1 \
        | sed 's/.*last_verified:[[:space:]]*//' \
        | tr -d '"' \
        | tr -d "'" \
        || echo "")

    # Check for placeholder values
    if [ -z "$LAST_VERIFIED" ] || echo "$LAST_VERIFIED" | grep -q '\[' 2>/dev/null; then
        echo -e "  ${YELLOW}[STALE]${NC} $CHECKPOINT_FILE — last_verified is empty or placeholder"
        record_finding "Doctrine Checkpoint" "MEDIUM" "last_verified is empty or has placeholder value" "n/a"
    else
        # Try to parse date to epoch
        CHECKPOINT_EPOCH=$(date -d "$LAST_VERIFIED" +%s 2>/dev/null || \
                          date -jf "%Y-%m-%dT%H:%M:%SZ" "$LAST_VERIFIED" +%s 2>/dev/null || \
                          date -jf "%Y-%m-%d" "$LAST_VERIFIED" +%s 2>/dev/null || \
                          echo "")

        if [ -z "$CHECKPOINT_EPOCH" ]; then
            echo -e "  ${YELLOW}[WARN]${NC} Cannot parse last_verified date: $LAST_VERIFIED"
        else
            DAYS_SINCE=$(days_between "$CHECKPOINT_EPOCH" "$NOW_EPOCH")
            SRC_EPOCH=$(get_dir_last_modified_epoch "src")

            if [ "$DAYS_SINCE" -gt "$THRESHOLD_CHECKPOINT" ]; then
                if [ -n "$SRC_EPOCH" ] && [ "$SRC_EPOCH" -gt "$CHECKPOINT_EPOCH" ]; then
                    echo -e "  ${YELLOW}[STALE]${NC} $CHECKPOINT_FILE — ${DAYS_SINCE} days since verified AND src/ modified since"
                    record_finding "Doctrine Checkpoint" "MEDIUM" "Checkpoint ${DAYS_SINCE}d stale, src/ modified since last verification" "$DAYS_SINCE"
                else
                    echo -e "  ${GREEN}[OK]${NC} $CHECKPOINT_FILE — ${DAYS_SINCE}d old but no src/ changes since"
                fi
            else
                echo -e "  ${GREEN}[OK]${NC} $CHECKPOINT_FILE — verified ${DAYS_SINCE} days ago (threshold: ${THRESHOLD_CHECKPOINT})"
            fi
        fi
    fi
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 7: Doctrine Version Staleness
# Child DOCTRINE.md version behind parent imo-creator manifest
# ───────────────────────────────────────────────────────────────────
echo "─── Check 7: Doctrine Version Staleness ────────────────────────"

if [ ! -f "DOCTRINE.md" ]; then
    echo -e "  ${CYAN}[SKIP]${NC} DOCTRINE.md not found (not a staleness issue)"
else
    CHILD_VERSION=$(grep "Doctrine Version" "DOCTRINE.md" 2>/dev/null \
        | head -1 \
        | awk -F'|' '{print $3}' \
        | tr -d ' *' \
        || echo "unknown")

    if [ -z "$CHILD_VERSION" ]; then
        CHILD_VERSION="unknown"
    fi

    # Try to find imo-creator and read parent version
    PARENT_VERSION=""
    IMO_PATHS=(
        "../imo-creator"
        "../../imo-creator"
        "$HOME/Desktop/Cursor Builds/imo-creator"
    )

    for imo_path in "${IMO_PATHS[@]}"; do
        MANIFEST_FILE="$imo_path/templates/TEMPLATES_MANIFEST.yaml"
        if [ -f "$MANIFEST_FILE" ]; then
            # Extract version without yq dependency
            PARENT_VERSION=$(grep "^  version:" "$MANIFEST_FILE" 2>/dev/null \
                | head -1 \
                | sed 's/.*version:[[:space:]]*//' \
                | tr -d '"' \
                | tr -d "'" \
                || echo "")
            break
        fi
    done

    if [ -z "$PARENT_VERSION" ]; then
        echo -e "  ${CYAN}[SKIP]${NC} imo-creator not accessible (cannot compare versions)"
        if [ "$VERBOSE" = true ]; then
            echo "         Searched: ${IMO_PATHS[*]}"
        fi
        echo "         Child version: $CHILD_VERSION"
    elif [ "$CHILD_VERSION" = "$PARENT_VERSION" ]; then
        echo -e "  ${GREEN}[OK]${NC} Doctrine version current (v${CHILD_VERSION})"
    elif [ "$CHILD_VERSION" = "unknown" ]; then
        echo -e "  ${RED}[STALE]${NC} Child version unknown, parent is v${PARENT_VERSION}"
        record_finding "Doctrine Version" "HIGH" "Child version unknown, parent is v${PARENT_VERSION}" "n/a"
    else
        echo -e "  ${RED}[STALE]${NC} Child v${CHILD_VERSION} behind parent v${PARENT_VERSION}"
        echo "         Run: ./scripts/update_from_imo_creator.sh"
        record_finding "Doctrine Version" "HIGH" "Child v${CHILD_VERSION} behind parent v${PARENT_VERSION}" "n/a"
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════
echo "═══════════════════════════════════════════════════════════════"
echo "  STALENESS AUDIT RESULTS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

TOTAL_FINDINGS=${#FINDINGS[@]}

if [ "$TOTAL_FINDINGS" -eq 0 ]; then
    echo -e "  ${GREEN}[PASS]${NC} No staleness detected"
    echo ""
    echo "  All governance artifacts are current relative to code changes."
    echo ""
    exit 0
fi

# Print findings table
printf "  %-10s %-28s %-45s %s\n" "SEVERITY" "ARTIFACT" "DETAIL" "DAYS"
printf "  %-10s %-28s %-45s %s\n" "────────" "────────────────────────────" "─────────────────────────────────────────────" "────"

for finding in "${FINDINGS[@]}"; do
    IFS='|' read -r severity artifact detail days <<< "$finding"

    case "$severity" in
        CRITICAL) color="$RED" ;;
        HIGH)     color="$RED" ;;
        MEDIUM)   color="$YELLOW" ;;
        *)        color="$NC" ;;
    esac

    printf "  ${color}%-10s${NC} %-28s %-45s %s\n" "$severity" "$artifact" "$detail" "$days"
done

echo ""
echo "  ─────────────────────────────────────────────────────────────"
echo -e "  CRITICAL: ${CRITICAL_COUNT}  HIGH: ${HIGH_COUNT}  MEDIUM: ${MEDIUM_COUNT}"
echo ""

if [ "$CRITICAL_COUNT" -gt 0 ] || [ "$HIGH_COUNT" -gt 0 ]; then
    echo -e "  ${RED}${BOLD}VERDICT: STALE — CRITICAL/HIGH staleness found${NC}"
    echo ""
    echo "  Remediation required before audit can pass."

    if [ "$CRITICAL_COUNT" -gt 0 ]; then
        echo "  CRITICAL items must be fixed immediately."
    fi
    if [ "$HIGH_COUNT" -gt 0 ]; then
        echo "  HIGH items block compliance."
    fi

    echo ""
    exit 1
else
    echo -e "  ${YELLOW}VERDICT: PASS WITH WARNINGS — MEDIUM staleness only${NC}"
    echo ""
    echo "  Medium staleness items should be addressed but do not block compliance."
    echo ""
    exit 0
fi
