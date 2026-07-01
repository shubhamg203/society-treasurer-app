Write-Host "=== STARTING SOCIETY TREASURER APP ===" -ForegroundColor Cyan
Write-Host ""

# Check if backend is already running
$backendRunning = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "Backend is already running on port 5000" -ForegroundColor Green
} else {
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    $backendPath = Join-Path $PSScriptRoot "backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting Flask Backend...' -ForegroundColor Cyan; python app.py"
    Write-Host "Backend starting in new window..." -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host ""

# Check if frontend is already running
$frontendRunning = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($frontendRunning) {
    Write-Host "Frontend is already running on port 3000" -ForegroundColor Green
} else {
    Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting Vite Frontend...' -ForegroundColor Cyan; npm run dev"
    Write-Host "Frontend starting in new window..." -ForegroundColor Green
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "=== SERVERS STARTING ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please wait 10-15 seconds for both servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Then open your browser and go to:" -ForegroundColor Green
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login with:" -ForegroundColor Green
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Keep the server windows open while using the app!" -ForegroundColor Yellow
Write-Host ""

# Made with Bob
