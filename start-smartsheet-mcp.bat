@echo off
echo ========================================
echo Smartsheet MCP Server Startup
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

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH!
    pause
    exit /b 1
)

echo [OK] Node.js and npm are available
echo.

REM Install MCP server dependencies if needed
if not exist "mcp-servers\node_modules" (
    echo Installing MCP server dependencies...
    cd mcp-servers
    npm install @modelcontextprotocol/sdk axios dotenv express cors
    cd ..
    echo.
)

REM Check environment variables
if "%SMARTSHEET_API_TOKEN%"=="" (
    if not exist ".env" (
        echo [ERROR] No .env file found and SMARTSHEET_API_TOKEN not set!
        echo Please create a .env file with SMARTSHEET_API_TOKEN
        pause
        exit /b 1
    )
    echo [OK] Using .env file for configuration
) else (
    echo [OK] SMARTSHEET_API_TOKEN found in environment
)

echo.
echo Starting Smartsheet MCP Server...
echo Press Ctrl+C to stop the server
echo.
echo Available tools:
echo   - smartsheet_list_sheets
echo   - smartsheet_get_sheet
echo   - smartsheet_create_sheet
echo   - smartsheet_add_rows
echo   - smartsheet_update_rows
echo   - smartsheet_delete_rows
echo   - smartsheet_search_sheets
echo   - smartsheet_list_workspaces
echo   - smartsheet_get_workspace
echo.

REM Start the MCP server
node mcp-servers/smartsheet-server.js

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] MCP server failed to start!
    pause
    exit /b 1
)

echo.
echo MCP server stopped.
pause