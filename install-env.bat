@echo off
REM Install Composio .env file to current directory or specified path
REM Usage: install-env.bat [target-directory]

echo.
echo ========================================
echo  Composio Environment Installer
echo ========================================
echo.

set TARGET_DIR=%~1
if "%TARGET_DIR%"=="" set TARGET_DIR=%CD%

echo Installing Composio .env to: %TARGET_DIR%
echo.

node "%~dp0scripts\install-composio-env.js" "%TARGET_DIR%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed!
    pause
    exit /b 1
)

echo.
echo Installation complete!
pause