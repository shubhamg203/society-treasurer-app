@echo off
echo ========================================
echo Society Treasurer Management System
echo ========================================
echo.

echo Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not found in PATH!
    echo.
    echo Please follow these steps:
    echo 1. Close this window
    echo 2. Close ALL PowerShell/Command Prompt windows
    echo 3. Open a NEW Command Prompt
    echo 4. Run this script again
    echo.
    echo If Node.js is not installed, download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
node --version
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "python app.py"
echo Backend server starting on http://localhost:5000
echo.

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
echo.

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"
echo.

echo ========================================
echo Application is starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login credentials:
echo Username: admin
echo Password: admin123
echo.
echo Two terminal windows will open:
echo 1. Backend Server (Python)
echo 2. Frontend Server (React)
echo.
echo Keep both windows open while using the app!
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000

echo.
echo Application launched!
echo Close this window when done.
pause

@REM Made with Bob
