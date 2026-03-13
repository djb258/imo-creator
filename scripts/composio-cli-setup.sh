#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# composio-cli-setup.sh — One-time Composio CLI venv setup
# ═══════════════════════════════════════════════════════════════════════════════
# Creates a Python 3.13 venv at C:\tools\composio-venv with composio-core
# and pinned Click for CLI compatibility.
#
# Prerequisites:
#   Python 3.13 installed at:
#   C:\Users\CUSTOM PC\AppData\Local\Programs\Python\Python313\python.exe
#
# Constraints:
#   - composio-core 0.7.21 requires Pillow <11 — no 3.14 wheel exists
#   - Click must be <8.2 — composio's EnumParam breaks on 8.2+
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

PYTHON313="C:/Users/CUSTOM PC/AppData/Local/Programs/Python/Python313/python.exe"
VENV_DIR="C:/tools/composio-venv"

if [ ! -f "$PYTHON313" ]; then
  echo "ERROR: Python 3.13 not found at $PYTHON313"
  echo "Install Python 3.13 from https://www.python.org/downloads/"
  exit 1
fi

echo "Creating venv at ${VENV_DIR}..."
"$PYTHON313" -m venv "$VENV_DIR"

echo "Upgrading pip..."
"${VENV_DIR}/Scripts/python.exe" -m pip install --upgrade pip

echo "Installing composio-core + pinned Click..."
"${VENV_DIR}/Scripts/pip.exe" install composio-core "click<8.2"

echo ""
echo "Done. Verify with:"
echo "  PYTHONIOENCODING=utf-8 ${VENV_DIR}/Scripts/composio.exe --help"
