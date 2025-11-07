#!/bin/bash

###############################################################################
# CTB Doctrine v1.3.2 - Required Tools Installation Helper
# Version: 1.0.0
###############################################################################

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    CTB Doctrine v1.3.2 - Required Tools Installation Helper   ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  OS="mac"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  OS="windows"
else
  echo "Unknown OS: $OSTYPE"
  exit 1
fi

echo "Detected OS: $OS"
echo ""

# Grafana
echo "Tool 1/5: Grafana"
if ! command -v grafana-server &> /dev/null; then
  [ "$OS" == "windows" ] && winget install GrafanaLabs.Grafana.OSS
  [ "$OS" == "mac" ] && brew install grafana
  [ "$OS" == "linux" ] && sudo apt-get install -y grafana
fi

# GitHub CLI
echo "Tool 2/5: GitHub CLI"
if ! command -v gh &> /dev/null; then
  [ "$OS" == "windows" ] && winget install GitHub.cli
  [ "$OS" == "mac" ] && brew install gh
  [ "$OS" == "linux" ] && sudo apt-get install -y gh
fi
gh auth login || true

# GitKraken
echo "Tool 3/5: GitKraken"
if ! command -v gitkraken &> /dev/null; then
  [ "$OS" == "windows" ] && winget install Axosoft.GitKraken
  [ "$OS" == "mac" ] && brew install --cask gitkraken
  [ "$OS" == "linux" ] && sudo snap install gitkraken --classic
fi

# Obsidian
echo "Tool 4/5: Obsidian"
if ! command -v obsidian &> /dev/null; then
  [ "$OS" == "windows" ] && winget install Obsidian.Obsidian
  [ "$OS" == "mac" ] && brew install --cask obsidian
  [ "$OS" == "linux" ] && sudo snap install obsidian --classic
fi
mkdir -p docs/obsidian-vault

# Eraser.io (web-based)
echo "Tool 5/5: Eraser.io (web-based at https://app.eraser.io)"
mkdir -p docs/diagrams

echo ""
echo -e "${GREEN}Installation complete! Run verify_required_tools.sh to check status.${NC}"
echo ""
