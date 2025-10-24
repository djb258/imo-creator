@echo off
setlocal enabledelayedexpansion

:: IMO-Creator Sync Trigger Script (Windows)
:: Usage: trigger-sync.bat [target_repo] [sync_type]
:: Example: trigger-sync.bat sales-hive workflows-only

:: Configuration
set REPO_OWNER=djb258
set IMO_CREATOR_REPO=imo-creator
set GITHUB_API=https://api.github.com

:: Parse arguments
set TARGET_REPO=%1
set SYNC_TYPE=%2

:: Set defaults if not provided
if "%TARGET_REPO%"=="" set TARGET_REPO=all-repos
if "%SYNC_TYPE%"=="" set SYNC_TYPE=workflows-only

:: Show help if requested
if "%1"=="-h" goto :show_help
if "%1"=="--help" goto :show_help
if "%1"=="/?" goto :show_help

:: Check for required environment variables
if "%GITHUB_TOKEN%"=="" (
    echo [ERROR] GITHUB_TOKEN environment variable is required
    echo [INFO] Get a token from: https://github.com/settings/tokens
    echo [INFO] Set it with: set GITHUB_TOKEN=your_token_here
    exit /b 1
)

:: Validate parameters
set valid_repos=sales-hive client-hive outreach-hive all-repos
set valid_sync_types=workflows-only configs-only full-sync

call :check_valid_repo %TARGET_REPO%
if !errorlevel! neq 0 (
    echo [ERROR] Invalid target repository: %TARGET_REPO%
    echo [INFO] Valid options: %valid_repos%
    exit /b 1
)

call :check_valid_sync_type %SYNC_TYPE%
if !errorlevel! neq 0 (
    echo [ERROR] Invalid sync type: %SYNC_TYPE%
    echo [INFO] Valid options: %valid_sync_types%
    exit /b 1
)

:: Get current timestamp
for /f %%i in ('powershell -command "Get-Date -UFormat '%%Y-%%m-%%dT%%H:%%M:%%SZ'"') do set TIMESTAMP=%%i

:: Create temp file for payload
set TEMP_FILE=%TEMP%\imo_sync_payload_%RANDOM%.json

:: Create payload
echo { > "%TEMP_FILE%"
echo   "event_type": "sync-imo-creator", >> "%TEMP_FILE%"
echo   "client_payload": { >> "%TEMP_FILE%"
echo     "target_repo": "%TARGET_REPO%", >> "%TEMP_FILE%"
echo     "sync_type": "%SYNC_TYPE%", >> "%TEMP_FILE%"
echo     "triggered_by": "%USERNAME%", >> "%TEMP_FILE%"
echo     "timestamp": "%TIMESTAMP%" >> "%TEMP_FILE%"
echo   } >> "%TEMP_FILE%"
echo } >> "%TEMP_FILE%"

echo [INFO] Triggering IMO-Creator sync...
echo [INFO] Target Repository: %TARGET_REPO%
echo [INFO] Sync Type: %SYNC_TYPE%
echo.

:: Send repository dispatch event
curl -s -w "%%{http_code}" ^
  -X POST ^
  -H "Accept: application/vnd.github.v3+json" ^
  -H "Authorization: token %GITHUB_TOKEN%" ^
  -H "User-Agent: imo-creator-sync-script" ^
  -d "@%TEMP_FILE%" ^
  "%GITHUB_API%/repos/%REPO_OWNER%/%IMO_CREATOR_REPO%/dispatches" > "%TEMP%\response.txt"

:: Read response
set /p RESPONSE=<"%TEMP%\response.txt"
set HTTP_CODE=!RESPONSE:~-3!

:: Clean up temp files
del "%TEMP_FILE%" 2>nul
del "%TEMP%\response.txt" 2>nul

if "%HTTP_CODE%"=="204" (
    echo [SUCCESS] Sync trigger sent successfully!
    echo [INFO] Check workflow status at:
    echo [INFO] https://github.com/%REPO_OWNER%/%IMO_CREATOR_REPO%/actions
) else (
    echo [ERROR] Failed to trigger sync (HTTP %HTTP_CODE%^)
    exit /b 1
)

echo.
echo [INFO] The sync workflow should start shortly. You can monitor progress at:
echo [INFO] https://github.com/%REPO_OWNER%/%IMO_CREATOR_REPO%/actions/workflows/sync-updates.yml

goto :eof

:show_help
echo IMO-Creator Sync Trigger Script (Windows)
echo.
echo USAGE:
echo     trigger-sync.bat [TARGET_REPO] [SYNC_TYPE]
echo.
echo PARAMETERS:
echo     TARGET_REPO     Repository to sync to (sales-hive, client-hive, outreach-hive, all-repos)
echo                     Default: all-repos
echo.
echo     SYNC_TYPE       Type of sync operation (workflows-only, configs-only, full-sync)
echo                     Default: workflows-only
echo.
echo EXAMPLES:
echo     trigger-sync.bat                           # Sync workflows to all repos
echo     trigger-sync.bat sales-hive                # Sync workflows to sales-hive only
echo     trigger-sync.bat client-hive configs-only  # Sync configs to client-hive only
echo     trigger-sync.bat all-repos full-sync       # Full sync to all repos
echo.
echo ENVIRONMENT VARIABLES:
echo     GITHUB_TOKEN    GitHub personal access token (required)
echo.
goto :eof

:check_valid_repo
set repo=%1
for %%i in (%valid_repos%) do (
    if "%%i"=="%repo%" exit /b 0
)
exit /b 1

:check_valid_sync_type
set sync_type=%1
for %%i in (%valid_sync_types%) do (
    if "%%i"=="%sync_type%" exit /b 0
)
exit /b 1