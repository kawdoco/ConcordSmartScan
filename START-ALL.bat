@echo off
echo ====================================
echo Starting Full Application
echo ====================================
echo This will start both Backend and Frontend
echo ====================================

REM Start backend in a new window
start "Backend Server" cmd /k "cd /d %~dp0src\backend && run-backend.bat"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
start "Frontend Server" cmd /k "cd /d %~dp0src\frontend && run-frontend.bat"

echo ====================================
echo Backend and Frontend are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo ====================================
echo Close the terminal windows to stop the servers
pause
