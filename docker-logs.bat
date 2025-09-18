@echo off
echo ========================================
echo IMO Creator - Docker Logs Viewer
echo ========================================
echo.
echo Select which logs to view:
echo   1. All services
echo   2. MCP Servers only
echo   3. PostgreSQL only
echo   4. Redis only
echo   5. Nginx only
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    docker-compose logs -f
) else if "%choice%"=="2" (
    docker-compose logs -f mcp-servers
) else if "%choice%"=="3" (
    docker-compose logs -f postgres
) else if "%choice%"=="4" (
    docker-compose logs -f redis
) else if "%choice%"=="5" (
    docker-compose logs -f nginx
) else (
    echo Invalid choice!
    pause
)