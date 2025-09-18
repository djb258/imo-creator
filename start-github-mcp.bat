@echo off
echo ========================================
echo GitHub Composio MCP Server Startup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is available
echo.

REM Install dependencies if needed
if not exist "mcp-servers\node_modules" (
    echo Installing MCP server dependencies...
    cd mcp-servers
    npm install @modelcontextprotocol/sdk @composio/core axios dotenv express cors
    cd ..
    echo.
)

REM Check environment variables
if "%COMPOSIO_API_KEY%"=="" (
    if not exist ".env" (
        echo [ERROR] No .env file found and COMPOSIO_API_KEY not set!
        echo Please create a .env file with COMPOSIO_API_KEY
        pause
        exit /b 1
    )
    echo [OK] Using .env file for configuration
) else (
    echo [OK] COMPOSIO_API_KEY found in environment
)

echo.
echo Starting GitHub Composio MCP Server...
echo Press Ctrl+C to stop the server
echo.
echo Features:
echo   - Repository management (list, create, delete)
echo   - Issue tracking (list, create, update, close)
echo   - Pull request automation (create, review, merge)
echo   - GitHub Actions workflows (list, trigger)
echo   - Code and repository search
echo   - Branch management
echo   - File operations
echo.
echo Available custom tools:
echo   - github_quick_search - Quick search across GitHub
echo   - github_repo_summary - Get comprehensive repo info
echo   - github_pr_review - Review and comment on PRs
echo   - github_workflow_dispatch - Trigger workflows
echo   - github_create_branch - Create new branches
echo.
echo Plus all standard GitHub operations through Composio!
echo.

REM Start the MCP server
node mcp-servers/github-composio-server.js

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] MCP server failed to start!
    echo.
    echo Troubleshooting:
    echo 1. Check your COMPOSIO_API_KEY is valid
    echo 2. Ensure you have set up GitHub authentication with Composio
    echo 3. Run: node scripts/setup-github-composio.js
    echo.
    pause
    exit /b 1
)

echo.
echo MCP server stopped.
pause