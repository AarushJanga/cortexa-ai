@echo off
title Cortexa AI - Launcher
color 0B
cls
echo =====================================================================
echo                 CORTEXA AI - ONE-CLICK LAUNCHER
echo          Learn Smarter. Remember Longer. Achieve Further.
echo =====================================================================
echo.

set ROOT_DIR=%~dp0

:: Check Python
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not found in PATH! Please install Python 3.11+.
    pause
    exit /b 1
)

:: Check Node
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in PATH! Please install Node.js 18+.
    pause
    exit /b 1
)

echo [*] Starting FastAPI Backend on http://localhost:8000 ...
start "CORTEXA AI - Backend (Port 8000)" cmd /k "cd /d "%ROOT_DIR%apps\api" && title [CORTEXA AI] Backend - Port 8000 && echo Starting FastAPI Backend on port 8000... && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [*] Starting Next.js Frontend on http://localhost:3000 ...
start "CORTEXA AI - Frontend (Port 3000)" cmd /k "cd /d "%ROOT_DIR%apps\web" && title [CORTEXA AI] Frontend - Port 3000 && echo Starting Next.js Frontend on port 3000... && npm run dev"

echo.
echo [*] Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo [*] Opening Cortexa AI in your default web browser...
start http://localhost:3000

echo.
echo =====================================================================
echo [SUCCESS] Cortexa AI is now running live!
echo.
echo   - Web App:   http://localhost:3000
echo   - API Docs:  http://localhost:8000/api/docs
echo   - Health:    http://localhost:8000/api/v1/health
echo.
echo To shut down all servers at any time, double-click: STOP.bat
echo =====================================================================
echo.
echo Press any key to close this launcher window (servers will keep running)...
pause >nul
