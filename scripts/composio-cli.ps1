# ═══════════════════════════════════════════════════════════════════════════════
# composio-cli.ps1 — Composio CLI wrapper (Windows)
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
#   .\scripts\composio-cli.ps1 --help
#   .\scripts\composio-cli.ps1 whoami
#   .\scripts\composio-cli.ps1 add github
#   .\scripts\composio-cli.ps1 apps
#
# Setup (one-time):
#   See scripts\composio-cli-setup.ps1 or run manually:
#     & "C:\Users\CUSTOM PC\AppData\Local\Programs\Python\Python313\python.exe" -m venv C:\tools\composio-venv
#     C:\tools\composio-venv\Scripts\pip.exe install composio-core "click<8.2"
# ═══════════════════════════════════════════════════════════════════════════════

$ComposioVenv = "C:\tools\composio-venv"
$ComposioExe = Join-Path $ComposioVenv "Scripts\composio.exe"

if (-not (Test-Path $ComposioExe)) {
    Write-Error "Composio venv not found at $ComposioVenv. Run scripts\composio-cli-setup.ps1 to create it."
    exit 1
}

# Pull API key from Doppler if not already set
if (-not $env:COMPOSIO_API_KEY) {
    try {
        $env:COMPOSIO_API_KEY = doppler secrets get GLOBAL_COMPOSIO_API_KEY --project imo-creator --config dev --plain 2>$null
    } catch {}
}

$env:PYTHONIOENCODING = "utf-8"
& $ComposioExe @args
