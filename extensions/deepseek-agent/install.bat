@echo off
REM DeepSeek Agent Installation Script for Windows
REM This script installs and sets up the DeepSeek Agent extension for VS Code

echo.
echo ========================================
echo DeepSeek Agent Installation Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo         Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected
node -v

REM Check if VS Code is installed
where code >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] VS Code is not installed or not in PATH.
    echo         Please install VS Code or add it to your PATH.
    pause
    exit /b 1
)

echo [OK] VS Code detected
echo.

REM Navigate to extension directory
set EXTENSION_DIR=extensions\deepseek-agent

if not exist "%EXTENSION_DIR%" (
    echo [ERROR] Extension directory not found: %EXTENSION_DIR%
    pause
    exit /b 1
)

cd "%EXTENSION_DIR%"
echo [INFO] Working directory: %CD%
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed
echo.

REM Ask if user wants to package the extension
set /p PACKAGE_RESPONSE="Would you like to package the extension? (y/n): "

if /i "%PACKAGE_RESPONSE%"=="y" (
    echo.
    echo [INFO] Packaging extension...

    REM Check if vsce is installed
    where vsce >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [INFO] Installing @vscode/vsce...
        call npm install -g @vscode/vsce
    )

    call npm run package

    if %ERRORLEVEL% EQU 0 (
        echo [OK] Extension packaged successfully
        echo.

        REM Find the .vsix file
        for /f "delims=" %%i in ('dir /b /o-d *.vsix 2^>nul') do (
            set VSIX_FILE=%%i
            goto :found_vsix
        )

        :found_vsix
        if defined VSIX_FILE (
            echo [INFO] Package created: %VSIX_FILE%
            echo.
            set /p INSTALL_RESPONSE="Would you like to install the extension now? (y/n): "

            if /i "!INSTALL_RESPONSE!"=="y" (
                echo.
                echo [INFO] Installing extension...
                call code --install-extension "%VSIX_FILE%"

                if !ERRORLEVEL! EQU 0 (
                    echo [OK] Extension installed successfully
                ) else (
                    echo [ERROR] Failed to install extension
                    pause
                    exit /b 1
                )
            )
        )
    ) else (
        echo [ERROR] Failed to package extension
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Get your DeepSeek API key from: https://platform.deepseek.com
echo 2. Open VS Code Settings (Ctrl+,)
echo 3. Search for 'deepseek'
echo 4. Enter your API key in 'DeepSeek: Api Key'
echo 5. Press Ctrl+Shift+D to start chatting with DeepSeek!
echo.
echo Documentation:
echo    - README: extensions\deepseek-agent\README.md
echo    - Quick Start: extensions\deepseek-agent\QUICKSTART.md
echo    - Integration Guide: extensions\deepseek-agent\INTEGRATION.md
echo.
echo Happy coding with DeepSeek!
echo.
pause
