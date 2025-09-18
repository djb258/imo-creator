@echo off
echo ========================================
echo IMO Creator - Docker Setup Script
echo ========================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running or not in Linux container mode!
    echo.
    echo Please:
    echo 1. Ensure Docker Desktop is running
    echo 2. Switch to Linux containers (right-click Docker icon in system tray)
    echo.
    pause
    exit /b 1
)

REM Check Docker OS type
FOR /F "tokens=*" %%i IN ('docker info --format "{{.OSType}}"') DO SET OS_TYPE=%%i
if not "%OS_TYPE%"=="linux" (
    echo [ERROR] Docker is in Windows container mode!
    echo Please switch to Linux containers from the Docker Desktop menu.
    pause
    exit /b 1
)

echo [OK] Docker is running in Linux container mode
echo.

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down 2>nul

echo.
echo Building Docker images...
docker-compose build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to build Docker images!
    pause
    exit /b 1
)

echo.
echo Starting services...
docker-compose up -d

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start services!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Services are starting...
echo ========================================
echo.
echo Available services:
echo   - MCP Servers:  http://localhost:3000-3020
echo   - PostgreSQL:   localhost:5432
echo   - Redis:        localhost:6379
echo   - Nginx:        http://localhost
echo   - Prometheus:   http://localhost:9090
echo   - Grafana:      http://localhost:3001 (user: admin, pass: admin)
echo.
echo Useful commands:
echo   - View logs:        docker-compose logs -f mcp-servers
echo   - Stop all:         docker-compose down
echo   - Restart service:  docker-compose restart [service-name]
echo   - Shell access:     docker-compose exec mcp-servers sh
echo.
pause