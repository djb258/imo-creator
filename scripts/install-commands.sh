#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# INSTALL COMMANDS — Deploy Global Commands from IMO-Creator
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Sovereign)
# Purpose: Copy command files from commands/ to ~/.claude/commands/ on any machine
# Usage: ./scripts/install-commands.sh [--dry-run] [--force]
# Exit: 0 = success
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script deploys doctrine-native global commands from the canonical source
# in imo-creator to the user's local ~/.claude/commands/ directory.
#
# Flags:
#   --dry-run   Preview what would be installed without writing
#   --force     Overwrite without diff check
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

DRY_RUN=false
FORCE=false

for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=true ;;
        --force) FORCE=true ;;
        *) echo -e "${RED}[ERROR]${NC} Unknown argument: $arg"; echo "Usage: ./scripts/install-commands.sh [--dry-run] [--force]"; exit 2 ;;
    esac
done

# ───────────────────────────────────────────────────────────────────
# LOCATE FILES
# ───────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SOURCE_DIR="$REPO_ROOT/commands"
TARGET_DIR="$HOME/.claude/commands"

if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}[ERROR]${NC} Source directory not found: $SOURCE_DIR"
    exit 1
fi

# ───────────────────────────────────────────────────────────────────
# HEADER
# ───────────────────────────────────────────────────────────────────
echo -e "${BOLD}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  IMO-Creator — Global Command Installer${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Source: ${CYAN}$SOURCE_DIR${NC}"
echo -e "  Target: ${CYAN}$TARGET_DIR${NC}"
if $DRY_RUN; then
    echo -e "  Mode:   ${YELLOW}DRY RUN (no files will be written)${NC}"
elif $FORCE; then
    echo -e "  Mode:   ${YELLOW}FORCE (overwrite without diff check)${NC}"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# INSTALL
# ───────────────────────────────────────────────────────────────────
INSTALLED=0
UPDATED=0
UNCHANGED=0

for src_file in "$SOURCE_DIR"/*.md; do
    [ -f "$src_file" ] || continue

    filename="$(basename "$src_file")"
    target_file="$TARGET_DIR/$filename"

    if [ -f "$target_file" ]; then
        if diff -q "$src_file" "$target_file" > /dev/null 2>&1; then
            echo -e "  ${CYAN}[UNCHANGED]${NC} $filename"
            UNCHANGED=$((UNCHANGED + 1))
        else
            if $DRY_RUN; then
                echo -e "  ${YELLOW}[WOULD UPDATE]${NC} $filename"
            else
                cp "$src_file" "$target_file"
                echo -e "  ${YELLOW}[UPDATED]${NC} $filename"
            fi
            UPDATED=$((UPDATED + 1))
        fi
    else
        if $DRY_RUN; then
            echo -e "  ${GREEN}[WOULD INSTALL]${NC} $filename"
        else
            mkdir -p "$TARGET_DIR"
            cp "$src_file" "$target_file"
            echo -e "  ${GREEN}[INSTALLED]${NC} $filename"
        fi
        INSTALLED=$((INSTALLED + 1))
    fi
done

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
TOTAL=$((INSTALLED + UPDATED + UNCHANGED))
echo ""
echo -e "${BOLD}───────────────────────────────────────────────────────────────${NC}"
echo -e "  Total: ${BOLD}$TOTAL${NC} commands"
echo -e "  ${GREEN}Installed: $INSTALLED${NC}  ${YELLOW}Updated: $UPDATED${NC}  ${CYAN}Unchanged: $UNCHANGED${NC}"
if $DRY_RUN; then
    echo -e "  ${YELLOW}(dry run — no files were written)${NC}"
fi
echo -e "${BOLD}───────────────────────────────────────────────────────────────${NC}"

exit 0
