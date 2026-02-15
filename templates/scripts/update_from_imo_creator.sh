#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# UPDATE FROM IMO-CREATOR — Manifest-Driven Doctrine Sync
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Sync child repo doctrine with parent imo-creator using manifest rules
# Usage: ./scripts/update_from_imo_creator.sh [/path/to/imo-creator] [--force]
# Exit: 0 = success, 1 = error, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script runs FROM a child repo and syncs it with imo-creator.
# It reads TEMPLATES_MANIFEST.yaml to determine what to sync, ensuring
# the manifest is the single source of truth — not hardcoded file lists.
#
# Sync rules (from manifest update_manifest section):
#   always_sync    → OVERWRITE (law — child doesn't customize)
#   sync_if_missing → COPY only if not exists (templates that get customized)
#   never_sync     → SKIP (child-specific files)
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SYNCED_COUNT=0
CREATED_COUNT=0
SKIPPED_COUNT=0
NEW_FILES=()
FORCE=false

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  UPDATE FROM IMO-CREATOR"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ───────────────────────────────────────────────────────────────────
# GUARD: Do not run from imo-creator itself
# ───────────────────────────────────────────────────────────────────
REPO_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")
if [ "$REPO_NAME" = "imo-creator" ]; then
    echo -e "${RED}[ERROR]${NC} This script runs FROM a child repo, not from imo-creator"
    echo "        Navigate to a child repo first, then run this script."
    exit 1
fi

# ───────────────────────────────────────────────────────────────────
# PARSE ARGUMENTS
# ───────────────────────────────────────────────────────────────────
IMO_ARG=""
for arg in "$@"; do
    case "$arg" in
        --force) FORCE=true ;;
        *) IMO_ARG="$arg" ;;
    esac
done

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ───────────────────────────────────────────────────────────────────
if ! command -v yq &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} yq is required but not installed"
    echo "        Install: https://github.com/mikefarah/yq"
    exit 2
fi

# ───────────────────────────────────────────────────────────────────
# STEP 1: Locate imo-creator
# ───────────────────────────────────────────────────────────────────
echo "─── Step 1: Locate imo-creator ────────────────────────────────"

IMO_CREATOR_PATH=""

# Check argument first
if [ -n "$IMO_ARG" ]; then
    if [ -d "$IMO_ARG/templates/doctrine" ]; then
        IMO_CREATOR_PATH="$IMO_ARG"
    else
        echo -e "${RED}[ERROR]${NC} Specified path does not contain templates/doctrine/"
        echo "        Path: $IMO_ARG"
        exit 1
    fi
fi

# Search common locations
if [ -z "$IMO_CREATOR_PATH" ]; then
    SEARCH_PATHS=(
        "../imo-creator"
        "../../imo-creator"
        "$HOME/Desktop/Cursor Builds/imo-creator"
        "/c/Users/CUSTOM PC/Desktop/Cursor Builds/imo-creator"
    )

    for path in "${SEARCH_PATHS[@]}"; do
        if [ -d "$path/templates/doctrine" ]; then
            IMO_CREATOR_PATH="$path"
            break
        fi
    done
fi

if [ -z "$IMO_CREATOR_PATH" ]; then
    echo -e "${RED}[ERROR]${NC} Cannot find imo-creator"
    echo "        Searched: ../imo-creator"
    echo "        Searched: ../../imo-creator"
    echo "        Searched: ~/Desktop/Cursor Builds/imo-creator"
    echo ""
    echo "        Usage: ./scripts/update_from_imo_creator.sh /path/to/imo-creator"
    exit 1
fi

MANIFEST="$IMO_CREATOR_PATH/templates/TEMPLATES_MANIFEST.yaml"

if [ ! -f "$MANIFEST" ]; then
    echo -e "${RED}[ERROR]${NC} TEMPLATES_MANIFEST.yaml not found in imo-creator"
    echo "        Expected: $MANIFEST"
    exit 1
fi

echo -e "  ${GREEN}[OK]${NC} imo-creator: $IMO_CREATOR_PATH"
echo ""

# ───────────────────────────────────────────────────────────────────
# STEP 2: Version comparison
# ───────────────────────────────────────────────────────────────────
echo "─── Step 2: Version comparison ────────────────────────────────"

PARENT_VERSION=$(yq '.manifest.version' "$MANIFEST")
echo "  Parent version: $PARENT_VERSION"

CHILD_VERSION="unknown"
if [ -f "DOCTRINE.md" ]; then
    CHILD_VERSION=$(grep "Doctrine Version" "DOCTRINE.md" 2>/dev/null \
        | head -1 \
        | awk -F'|' '{print $3}' \
        | tr -d ' *' \
        || echo "unknown")
    # Clean up empty result
    if [ -z "$CHILD_VERSION" ]; then
        CHILD_VERSION="unknown"
    fi
fi

echo "  Child version:  $CHILD_VERSION"

if [ "$PARENT_VERSION" = "$CHILD_VERSION" ] && [ "$FORCE" != "true" ]; then
    echo ""
    echo -e "  ${GREEN}[OK]${NC} Already current (v$PARENT_VERSION)"
    echo "       Use --force to sync anyway"
    echo ""
    exit 0
fi

if [ "$FORCE" = "true" ] && [ "$PARENT_VERSION" = "$CHILD_VERSION" ]; then
    echo -e "  ${YELLOW}[FORCE]${NC} Versions match but --force specified"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# STEP 3: Sync always_sync files (OVERWRITE)
# ───────────────────────────────────────────────────────────────────
echo "─── Step 3: Sync always_sync files (overwrite) ────────────────"

ALWAYS_COUNT=$(yq '.update_manifest.always_sync.files | length' "$MANIFEST")

if [ "$ALWAYS_COUNT" = "0" ] || [ "$ALWAYS_COUNT" = "null" ]; then
    echo -e "  ${YELLOW}[SKIP]${NC} No always_sync files declared in manifest"
else
    for (( i=0; i<ALWAYS_COUNT; i++ )); do
        SRC=$(yq ".update_manifest.always_sync.files[$i].source" "$MANIFEST")
        DST=$(yq ".update_manifest.always_sync.files[$i].destination" "$MANIFEST")

        SRC_FULL="$IMO_CREATOR_PATH/$SRC"

        if [ ! -f "$SRC_FULL" ]; then
            echo -e "  ${YELLOW}[SKIP]${NC} Source missing: $SRC"
            continue
        fi

        # Track new files
        if [ ! -f "$DST" ]; then
            NEW_FILES+=("$DST")
        fi

        # Create destination directory
        DST_DIR=$(dirname "$DST")
        if [ "$DST_DIR" != "." ]; then
            mkdir -p "$DST_DIR"
        fi

        cp "$SRC_FULL" "$DST"

        # Make scripts and hooks executable
        case "$DST" in
            *.sh|.git/hooks/*) chmod +x "$DST" 2>/dev/null || true ;;
        esac

        ((SYNCED_COUNT++))
        echo -e "  ${GREEN}[SYNC]${NC} $DST"
    done
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# STEP 4: Sync sync_if_missing files (COPY only if not exists)
# ───────────────────────────────────────────────────────────────────
echo "─── Step 4: Sync sync_if_missing files ────────────────────────"

MISSING_COUNT=$(yq '.update_manifest.sync_if_missing.files | length' "$MANIFEST")

if [ "$MISSING_COUNT" = "0" ] || [ "$MISSING_COUNT" = "null" ]; then
    echo -e "  ${YELLOW}[SKIP]${NC} No sync_if_missing files declared in manifest"
else
    for (( i=0; i<MISSING_COUNT; i++ )); do
        SRC=$(yq ".update_manifest.sync_if_missing.files[$i].source" "$MANIFEST")
        DST=$(yq ".update_manifest.sync_if_missing.files[$i].destination" "$MANIFEST")

        SRC_FULL="$IMO_CREATOR_PATH/$SRC"

        if [ ! -f "$SRC_FULL" ]; then
            echo -e "  ${YELLOW}[SKIP]${NC} Source missing: $SRC"
            continue
        fi

        if [ -f "$DST" ]; then
            ((SKIPPED_COUNT++))
            echo -e "  ${CYAN}[EXISTS]${NC} $DST (preserved)"
        else
            DST_DIR=$(dirname "$DST")
            if [ "$DST_DIR" != "." ]; then
                mkdir -p "$DST_DIR"
            fi

            cp "$SRC_FULL" "$DST"
            ((CREATED_COUNT++))
            NEW_FILES+=("$DST")
            echo -e "  ${GREEN}[CREATE]${NC} $DST"
        fi
    done
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# STEP 5: Update DOCTRINE.md
# ───────────────────────────────────────────────────────────────────
echo "─── Step 5: Update DOCTRINE.md ────────────────────────────────"

if [ -f "DOCTRINE.md" ]; then
    if grep -q "Doctrine Version" "DOCTRINE.md"; then
        # Portable sed: write to temp file, then move
        TMP_FILE=$(mktemp)
        sed "s/| *\*\*Doctrine Version\*\* *|[^|]*|/| **Doctrine Version** | $PARENT_VERSION |/" "DOCTRINE.md" > "$TMP_FILE"
        mv "$TMP_FILE" "DOCTRINE.md"
        echo -e "  ${GREEN}[OK]${NC} DOCTRINE.md: version updated to $PARENT_VERSION"
    else
        echo -e "  ${YELLOW}[SKIP]${NC} DOCTRINE.md: no Doctrine Version field found"
    fi
else
    echo -e "  ${YELLOW}[SKIP]${NC} DOCTRINE.md not found — create from template first"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# STEP 6: Verify
# ───────────────────────────────────────────────────────────────────
echo "─── Step 6: Verify ────────────────────────────────────────────"

TOTAL=$((SYNCED_COUNT + CREATED_COUNT + SKIPPED_COUNT))
echo "  Files processed: $TOTAL"

# Verify critical files exist
CRITICAL_MISSING=0
CRITICAL_FILES=("DOCTRINE.md" "CC_OPERATIONAL_DIGEST.md")
for cf in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$cf" ]; then
        echo -e "  ${RED}[MISSING]${NC} Critical file: $cf"
        ((CRITICAL_MISSING++))
    fi
done

if [ "$CRITICAL_MISSING" -gt 0 ]; then
    echo -e "  ${RED}[WARN]${NC} $CRITICAL_MISSING critical file(s) missing"
else
    echo -e "  ${GREEN}[OK]${NC} All critical files present"
fi

# Verify pre-commit hook
if [ -f ".git/hooks/pre-commit" ]; then
    echo -e "  ${GREEN}[OK]${NC} Pre-commit hook installed"
elif [ -d ".git" ]; then
    echo -e "  ${YELLOW}[WARN]${NC} Pre-commit hook not installed — run install-hooks.sh"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════"
echo "  IMO-CREATOR SYNC COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Source:   imo-creator v$PARENT_VERSION"
echo "  Previous: v$CHILD_VERSION"
echo "  Updated:  $(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date)"
echo ""
echo "  SYNCED (always_sync):      $SYNCED_COUNT files"
echo "  CREATED (sync_if_missing): $CREATED_COUNT files"
echo "  SKIPPED (exists/never):    $SKIPPED_COUNT files"

if [ ${#NEW_FILES[@]} -gt 0 ]; then
    echo ""
    echo "  New files added:"
    for nf in "${NEW_FILES[@]}"; do
        echo "    - $nf"
    done
fi

echo ""
echo "  DOCTRINE.md updated: v$CHILD_VERSION → v$PARENT_VERSION"
if [ -f ".git/hooks/pre-commit" ]; then
    echo "  Pre-commit hook: UPDATED"
fi
echo ""
echo "  Next: Review changes with 'git status', then commit."
echo ""
