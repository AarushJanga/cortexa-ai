@echo off
title Cortexa AI - Live Launcher
color 0B
cls
echo =====================================================================
echo                CORTEXA AI - RUN THE LIVE PLATFORM
echo          Learn Smarter. Remember Longer. Achieve Further.
echo =====================================================================
echo.

set ROOT_DIR=%~dp0

echo [*] Starting Backend Server (FastAPI on Port 8000)...
start "CORTEXA AI - Backend (Port 8000)" cmd /k "cd /d "%ROOT_DIR%apps\api" && title [CORTEXA AI] Backend - Port 8000 && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [*] Starting Frontend Server (Next.js on Port 3000)...
start "CORTEXA AI - Frontend (Port 3000)" cmd /k "cd /d "%ROOT_DIR%apps\web" && title [CORTEXA AI] Frontend - Port 3000 && npm run dev"

echo [*] Launching http://localhost:3000 in your browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo [DONE] Both servers launched! Use STOP.bat whenever you want to close them.
echo.
pause
