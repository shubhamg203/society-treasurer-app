@echo off
echo ========================================
echo   Society Treasurer App - Simple Start
echo ========================================
echo.

REM Stop any existing Python processes
echo Stopping any existing backend servers...
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend Server (Simplified Version)...
echo.
start "Society Treasurer Backend" cmd /k "cd backend && python app_simple.py"

timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
echo.
start "Society Treasurer Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login with: admin / admin123
echo.
echo Keep both terminal windows open!
echo Close this window when done.
echo.
pause

@REM Made with Bob
