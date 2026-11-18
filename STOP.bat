@echo off
title Cortexa AI - Stop Servers
color 0C
cls
echo =====================================================================
echo                   CORTEXA AI - SERVER SHUTDOWN
echo =====================================================================
echo.
echo [*] Stopping all active Cortexa AI server processes...

:: Stop process on port 8000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo [*] Terminating Backend process on port 8000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Stop process on port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [*] Terminating Frontend process on port 3000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill any residual CMD windows launched by Cortexa AI
taskkill /F /FI "WINDOWTITLE eq [CORTEXA AI]*" >nul 2>&1

echo.
echo =====================================================================
echo [SUCCESS] All Cortexa AI servers have been completely stopped!
echo =====================================================================
echo.
echo Press any key to close this window...
pause >nul
