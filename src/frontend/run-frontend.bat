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
REM Ensure map packages (and any declared QR packages) exist
setlocal EnableDelayedExpansion
set "REQUIRED_PACKAGES=leaflet react-leaflet"
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
    echo [INFO] Missing map/QR packages detected. Installing: %CHECK_PACKAGES%
    call npm install %CHECK_PACKAGES%
    if errorlevel 1 (
        echo [ERROR] Package install failed!
        pause
        exit /b 1
    )
) else (
    echo [INFO] Map/QR packages already installed. Skipping install.
)
endlocal

echo.
echo [INFO] Starting frontend development server...
echo [INFO] Frontend will run on http://localhost:3000
echo ====================================
echo.

REM Run the application
call npm start
