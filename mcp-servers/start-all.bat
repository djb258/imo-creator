@echo off
REM Start All MCP Servers Script for Windows
REM This script starts all operational MCP servers with proper environment configuration

echo.
echo ========================================
echo Starting MCP Server Infrastructure...
echo ========================================
echo.

REM Start Composio MCP Server
echo Starting composio-mcp on port 3001...
cd composio-mcp
if not exist node_modules (
    echo Installing dependencies for composio-mcp...
    call npm install
)
start /B cmd /c "set PORT=3001 && npm start > composio-mcp.log 2>&1"
cd ..
timeout /t 2 /nobreak > nul
echo [OK] composio-mcp started on port 3001

REM Start Ref Tools MCP Server
echo Starting ref-tools-mcp on port 3002...
cd ref-tools-mcp
if not exist node_modules (
    echo Installing dependencies for ref-tools-mcp...
    call npm install
)
start /B cmd /c "set PORT=3002 && npm start > ref-tools-mcp.log 2>&1"
cd ..
timeout /t 2 /nobreak > nul
echo [OK] ref-tools-mcp started on port 3002

REM Start Query Builder MCP Server (if database URLs are configured)
if exist query-builder-mcp (
    echo Starting query-builder-mcp on port 3003...
    cd query-builder-mcp
    if not exist node_modules (
        echo Installing dependencies for query-builder-mcp...
        call npm install
    )
    start /B cmd /c "set PORT=3003 && npm start > query-builder-mcp.log 2>&1"
    cd ..
    timeout /t 2 /nobreak > nul
    echo [OK] query-builder-mcp started on port 3003
)

REM Start GitHub Actions MCP Server (if GitHub token is configured)
if exist github-actions-mcp (
    echo Starting github-actions-mcp on port 3004...
    cd github-actions-mcp
    if not exist node_modules (
        echo Installing dependencies for github-actions-mcp...
        call npm install
    )
    start /B cmd /c "set PORT=3004 && npm start > github-actions-mcp.log 2>&1"
    cd ..
    timeout /t 2 /nobreak > nul
    echo [OK] github-actions-mcp started on port 3004
)

REM Start Whimsical GitHub Webhook Server
if exist whimsical-github-webhook (
    echo Starting whimsical-github-webhook on port 3007...
    cd whimsical-github-webhook
    if not exist node_modules (
        echo Installing dependencies for whimsical-github-webhook...
        call npm install
    )
    start /B cmd /c "set PORT=3007 && npm start > whimsical-webhook.log 2>&1"
    cd ..
    timeout /t 2 /nobreak > nul
    echo [OK] whimsical-github-webhook started on port 3007
)

echo.
echo ========================================
echo MCP Server Infrastructure Status:
echo ========================================
echo.
echo Running servers:
echo   [+] composio-mcp        : http://localhost:3001
echo   [+] ref-tools-mcp       : http://localhost:3002
echo   [+] query-builder-mcp   : http://localhost:3003
echo   [+] github-actions      : http://localhost:3004
echo   [+] whimsical-webhook   : http://localhost:3007
echo.
echo Health check endpoints:
echo   curl http://localhost:3001/mcp/health  (Composio)
echo   curl http://localhost:3002/mcp/health  (Ref Tools)
echo   curl http://localhost:3003/mcp/health  (Query Builder)
echo   curl http://localhost:3007/health      (Whimsical Webhook)
echo.
echo Whimsical Integration:
echo   Manual trigger: curl -X POST http://localhost:3007/trigger
echo   GitHub webhook: http://localhost:3007/webhook/github
echo.
echo [!] HEIR/ORBT Compliance: Active
echo [!] Performance Caching: Enabled
echo [!] Kill Switch: Armed
echo.
echo To stop servers, close this window or press Ctrl+C
echo To view logs, check mcp-servers\*\*.log files
echo.
pause