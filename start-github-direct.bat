@echo off
echo ========================================
echo GitHub Direct MCP Server
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    pause
    exit /b 1
)

REM Check GitHub token
if "%GITHUB_API_TOKEN%"=="" (
    if not exist ".env" (
        echo [ERROR] No GITHUB_API_TOKEN found!
        echo Please check your .env file
        pause
        exit /b 1
    )
)

echo [OK] GitHub API token configured
echo [OK] Starting GitHub Direct MCP Server...
echo.
echo Features:
echo   ✅ Repository management (list, get, create)
echo   ✅ Issue tracking (list, create, update)
echo   ✅ Search (repositories, code)
echo   ✅ User information
echo   ✅ Direct GitHub API access
echo.
echo Press Ctrl+C to stop
echo.

node mcp-servers/github-direct-server.js

pause