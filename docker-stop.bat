@echo off
echo Stopping IMO Creator Docker services...
echo.

docker-compose down

if %errorlevel% eq 0 (
    echo.
    echo [SUCCESS] All services stopped successfully.
) else (
    echo.
    echo [WARNING] Some services may not have stopped properly.
)

echo.
pause