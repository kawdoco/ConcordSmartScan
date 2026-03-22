@echo off
echo ====================================
echo Backend Setup and Run Script
echo ====================================

REM Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven is not installed!
    echo Please install Maven from: https://maven.apache.org/download.cgi
    echo Or use Maven Wrapper: mvnw.cmd
    pause
    exit /b 1
)

echo [INFO] Maven found!
echo.
echo [INFO] Checking and downloading dependencies...

REM Download dependencies if not present
call mvn dependency:resolve

echo.
echo [INFO] Building application...
call mvn clean package -DskipTests

if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [INFO] Starting backend server...
echo [INFO] Backend will run on http://localhost:8080
echo ====================================
echo.

REM Run the application
call mvn spring-boot:run
