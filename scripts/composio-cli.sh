#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# composio-cli.sh — Composio CLI wrapper
# ═══════════════════════════════════════════════════════════════════════════════
# Purpose: Run the Composio CLI from the Python 3.13 venv (composio-core 0.7.21)
#
# Why this exists:
#   - composio-core 0.7.21 (deprecated) ships the CLI but breaks on Python 3.14
#     (Pillow wheel build failure)
#   - composio 0.11.2 (new SDK) does NOT ship a CLI
#   - Solution: dedicated Python 3.13 venv at C:\tools\composio-venv
#   - Click pinned to <8.2 (8.3+ breaks composio's EnumParam.get_metavar)
#   - PYTHONIOENCODING=utf-8 required on Windows (help text contains emoji)
#
# Usage:
#   ./scripts/composio-cli.sh --help
#   ./scripts/composio-cli.sh whoami
#   ./scripts/composio-cli.sh add github
#   ./scripts/composio-cli.sh apps
#
# Setup (one-time):
#   See scripts/composio-cli-setup.sh or run manually:
#     python3.13 -m venv C:\tools\composio-venv
#     C:\tools\composio-venv\Scripts\pip.exe install composio-core "click<8.2"
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

COMPOSIO_VENV="C:/tools/composio-venv"
COMPOSIO_EXE="${COMPOSIO_VENV}/Scripts/composio.exe"

if [ ! -f "$COMPOSIO_EXE" ]; then
  echo "ERROR: Composio venv not found at ${COMPOSIO_VENV}"
  echo "Run scripts/composio-cli-setup.sh to create it."
  exit 1
fi

# Pull API key from Doppler if not already set
if [ -z "${COMPOSIO_API_KEY:-}" ]; then
  if command -v doppler &>/dev/null; then
    export COMPOSIO_API_KEY
    COMPOSIO_API_KEY="$(doppler secrets get GLOBAL_COMPOSIO_API_KEY --project imo-creator --config dev --plain 2>/dev/null)" || true
  fi
fi

export PYTHONIOENCODING=utf-8
exec "$COMPOSIO_EXE" "$@"
