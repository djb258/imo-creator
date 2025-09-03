@echo off
REM Setup Whimsical Integration for IMO Creator
REM This script installs dependencies and sets up the Whimsical webhook server

echo.
echo ========================================
echo Setting up Whimsical Integration...
echo ========================================
echo.

cd mcp-servers\whimsical-github-webhook

REM Install npm dependencies
echo Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Edit .env file with your actual credentials:
    echo     - GITHUB_WEBHOOK_SECRET (optional but recommended)
    echo     - WHIMSICAL_API_KEY (get from Whimsical settings)
    echo     - WHIMSICAL_BOARD_ID (your board ID)
    echo.
)

cd ..\..

REM Create temp directory for webhook server
if not exist "mcp-servers\whimsical-github-webhook\temp_repos" (
    mkdir "mcp-servers\whimsical-github-webhook\temp_repos"
)

echo.
echo ========================================
echo Whimsical Integration Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Edit mcp-servers\whimsical-github-webhook\.env with your credentials
echo   2. Get Whimsical API key from: https://whimsical.com/developers
echo   3. Start the webhook server: cd mcp-servers\whimsical-github-webhook && npm start
echo   4. Test the integration: .whimsical\trigger-update.sh
echo.
echo Manual testing:
echo   python tools\whimsical_visualizer.py . --export-only
echo.
pause