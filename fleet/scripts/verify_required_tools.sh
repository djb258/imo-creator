#!/bin/bash

###############################################################################
# CTB Doctrine v1.3.2 - Required Tools Verification Script
# Version: 1.0.0
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     CTB Doctrine v1.3.2 - Required Tools Verification         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

TOOLS_INSTALLED=0
TOOLS_MISSING=0

# Check Grafana
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Checking: Grafana${NC}"
if command -v grafana-server &> /dev/null || command -v grafana &> /dev/null; then
  log_success "Grafana installed"
  TOOLS_INSTALLED=$((TOOLS_INSTALLED + 1))
else
  log_error "Grafana NOT installed (Required - Doctrine ID: 04.05.01)"
  log_info "  Install: winget install GrafanaLabs.Grafana.OSS (Windows)"
  TOOLS_MISSING=$((TOOLS_MISSING + 1))
fi
echo ""

# Check GitHub CLI
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Checking: GitHub CLI${NC}"
if command -v gh &> /dev/null; then
  log_success "GitHub CLI installed"
  gh auth status &> /dev/null && log_success "GitHub CLI authenticated" && TOOLS_INSTALLED=$((TOOLS_INSTALLED + 1)) || log_warning "Not authenticated - run: gh auth login"
else
  log_error "GitHub CLI NOT installed (Required - Doctrine ID: 04.05.02)"
  TOOLS_MISSING=$((TOOLS_MISSING + 1))
fi
echo ""

# Check GitKraken
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Checking: GitKraken${NC}"
if command -v gitkraken &> /dev/null || [ -d "/Applications/GitKraken.app" ]; then
  log_success "GitKraken installed"
  TOOLS_INSTALLED=$((TOOLS_INSTALLED + 1))
else
  log_warning "GitKraken NOT detected (Recommended - Doctrine ID: 04.05.03)"
fi
echo ""

# Check Obsidian
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Checking: Obsidian${NC}"
if command -v obsidian &> /dev/null || [ -d "/Applications/Obsidian.app" ]; then
  log_success "Obsidian installed"
  TOOLS_INSTALLED=$((TOOLS_INSTALLED + 1))
else
  log_warning "Obsidian NOT detected (Recommended - Doctrine ID: 04.05.04)"
fi
echo ""

# Check Eraser.io diagrams
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Checking: Eraser.io${NC}"
if [ -d "docs/diagrams" ] && ls docs/diagrams/*.eraserdiagram &> /dev/null; then
  DIAGRAM_COUNT=$(ls docs/diagrams/*.eraserdiagram 2>/dev/null | wc -l)
  log_success "Eraser.io diagrams found: $DIAGRAM_COUNT diagram(s)"
  TOOLS_INSTALLED=$((TOOLS_INSTALLED + 1))
else
  log_warning "No Eraser.io diagrams found (Doctrine ID: 04.05.05)"
  log_info "  Create diagrams at: https://app.eraser.io"
fi
echo ""

echo -e "${GREEN}✓ Installed:${NC} $TOOLS_INSTALLED / 5"
echo -e "${RED}✗ Missing:${NC}   $TOOLS_MISSING / 5"
echo ""

[ $TOOLS_MISSING -eq 0 ] && exit 0 || exit 1
