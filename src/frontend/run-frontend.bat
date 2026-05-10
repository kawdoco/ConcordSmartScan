@echo off
echo ====================================
echo Frontend Setup and Run Script
echo ====================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js found!
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [INFO] npm found!
call npm --version

echo.
REM Check if node_modules exists, if not run full npm install
if not exist "node_modules" (
    echo [INFO] node_modules not found. Running full npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Full npm install failed!
        pause
        exit /b 1
    )
) else (
    echo [INFO] node_modules found. Checking for specific packages...
)

REM Ensure critical packages exist (map, charts, and any declared QR packages)
setlocal EnableDelayedExpansion
set "REQUIRED_PACKAGES=leaflet react-leaflet recharts"
set "QR_PACKAGES=qrcode.react react-qr-reader html5-qrcode jsqr qr-scanner"
set "OPTIONAL_QR_PACKAGES="

for %%Q in (%QR_PACKAGES%) do (
    findstr /i /c:"\"%%Q\"" package.json >nul 2>nul
    if not errorlevel 1 (
        set "OPTIONAL_QR_PACKAGES=!OPTIONAL_QR_PACKAGES! %%Q"
    )
)

set "CHECK_PACKAGES=%REQUIRED_PACKAGES%%OPTIONAL_QR_PACKAGES%"
call npm ls %CHECK_PACKAGES% --depth=0 >nul 2>nul
if errorlevel 1 (
    echo [INFO] Missing required packages detected. Installing: %CHECK_PACKAGES%
    call npm install %CHECK_PACKAGES%
    if errorlevel 1 (
        echo [ERROR] Package install failed!
        pause
        exit /b 1
    )
) else (
    echo [INFO] All required packages already installed.
)
endlocal

echo.
echo [INFO] Starting frontend development server...
echo [INFO] Frontend will run on http://localhost:3000
echo ====================================
echo.

REM Run the application
call npm start
