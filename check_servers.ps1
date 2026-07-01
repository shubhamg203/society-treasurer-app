Write-Host "=== SERVER STATUS CHECK ===" -ForegroundColor Cyan
Write-Host ""

$backend = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
$frontend = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if ($backend) {
    Write-Host "Backend (Port 5000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "Backend (Port 5000): NOT RUNNING" -ForegroundColor Red
}

if ($frontend) {
    Write-Host "Frontend (Port 3000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "Frontend (Port 3000): NOT RUNNING" -ForegroundColor Red
}

Write-Host ""

if ($backend -and $frontend) {
    Write-Host "SUCCESS! All servers are running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Open your browser and go to:" -ForegroundColor Cyan
    Write-Host "  http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "Login with:" -ForegroundColor Cyan
    Write-Host "  Username: admin" -ForegroundColor White
    Write-Host "  Password: admin123" -ForegroundColor White
} else {
    Write-Host "WARNING: Some servers are not running!" -ForegroundColor Yellow
    Write-Host ""
    if (-not $backend) {
        Write-Host "To start backend:" -ForegroundColor Yellow
        Write-Host "  cd society-treasurer-app/backend" -ForegroundColor White
        Write-Host "  python app.py" -ForegroundColor White
        Write-Host ""
    }
    if (-not $frontend) {
        Write-Host "To start frontend:" -ForegroundColor Yellow
        Write-Host "  cd society-treasurer-app/frontend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
    }
    Write-Host "Or run: powershell -ExecutionPolicy Bypass -File society-treasurer-app/START_BOTH_SERVERS.ps1" -ForegroundColor Cyan
}

Write-Host ""

# Made with Bob
