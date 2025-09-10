@echo off
REM Quick sync script for Windows
REM Syncs all updates from imo-creator to target repository

if "%1"=="" (
    echo Usage: sync-updates.bat ^<target-repo-path^>
    echo.
    echo Examples:
    echo   sync-updates.bat C:\path\to\my-project
    echo   sync-updates.bat .
    echo.
    echo Syncs all HEIR/ORBT/MCP/Factory updates to target repo
    exit /b 1
)

echo 🚀 Starting update sync...
python factory/pull_updates.py "%1"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Sync completed successfully!
    echo 💡 Next: Review changes and commit to git
) else (
    echo.
    echo ❌ Sync failed with error code %ERRORLEVEL%
)

pause