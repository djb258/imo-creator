@echo off
REM Test Composio MCP Server Integration for Windows
REM This script tests the Composio server with your API key

echo.
echo ========================================
echo Testing Composio MCP Server Integration
echo ========================================
echo.

set SERVER_URL=http://localhost:3001

REM Test 1: Health Check
echo 1. Testing Health Check...
curl -s "%SERVER_URL%/mcp/health" > health_response.tmp
findstr /C:"healthy" health_response.tmp >nul
if %errorlevel%==0 (
    echo [OK] Health check passed
    type health_response.tmp
) else (
    echo [FAIL] Health check failed
    type health_response.tmp
)
del health_response.tmp
echo.

REM Test 2: Get Available Tools
echo 2. Testing Get Available Tools...
curl -s -X POST "%SERVER_URL%/tool" -H "Content-Type: application/json" -d "{\"unique_id\":\"HEIR-2024-12-TEST-001\",\"process_id\":\"PRC-TEST-001\",\"orbt_layer\":5,\"blueprint_version\":\"v1.0.0\",\"tool\":\"get_available_tools\",\"data\":{\"toolkits\":[\"github\"],\"user_id\":\"test-user\"}}" > tools_response.tmp
findstr /C:"success" tools_response.tmp >nul
if %errorlevel%==0 (
    echo [OK] Get available tools succeeded
    echo Available GitHub tools found - check tools_response.tmp for details
) else (
    echo [FAIL] Get available tools failed
    type tools_response.tmp
)
del tools_response.tmp
echo.

REM Test 3: Execute a Simple Tool
echo 3. Testing Tool Execution (GitHub Get User)...
curl -s -X POST "%SERVER_URL%/tool" -H "Content-Type: application/json" -d "{\"unique_id\":\"HEIR-2024-12-TEST-002\",\"process_id\":\"PRC-TEST-002\",\"orbt_layer\":5,\"blueprint_version\":\"v1.0.0\",\"tool\":\"execute_composio_tool\",\"data\":{\"toolkit\":\"github\",\"tool\":\"get_user\",\"arguments\":{\"username\":\"djb258\"},\"user_id\":\"test-user\"}}" > execute_response.tmp
findstr /C:"success" execute_response.tmp >nul
if %errorlevel%==0 (
    echo [OK] Tool execution succeeded
) else (
    echo [WARNING] Tool execution may require connected account
    type execute_response.tmp
)
del execute_response.tmp
echo.

REM Test 4: Get Composio Stats
echo 4. Testing Get Composio Stats...
curl -s -X POST "%SERVER_URL%/tool" -H "Content-Type: application/json" -d "{\"unique_id\":\"HEIR-2024-12-TEST-003\",\"process_id\":\"PRC-TEST-003\",\"orbt_layer\":5,\"blueprint_version\":\"v1.0.0\",\"tool\":\"get_composio_stats\",\"data\":{\"include_usage\":true}}" > stats_response.tmp
findstr /C:"success" stats_response.tmp >nul
if %errorlevel%==0 (
    echo [OK] Stats retrieval succeeded
    type stats_response.tmp
) else (
    echo [FAIL] Stats retrieval failed
    type stats_response.tmp
)
del stats_response.tmp
echo.

echo ========================================
echo Test Summary:
echo ========================================
echo.
echo Next Steps:
echo   1. Connect accounts at https://app.composio.dev
echo   2. Use connected accounts for tool execution
echo   3. Explore 100+ available service integrations
echo.
pause