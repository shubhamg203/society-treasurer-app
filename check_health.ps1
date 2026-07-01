Write-Host "=== SOCIETY TREASURER APP HEALTH CHECK ===" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "BACKEND (Port 5000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  Status: RUNNING (checkmark)" -ForegroundColor Green
    Write-Host "  HTTP Code: $($response.StatusCode)"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "  Status: RUNNING (checkmark) - Authentication required (Expected)" -ForegroundColor Green
        Write-Host "  HTTP Code: 401"
    } else {
        Write-Host "  Status: ERROR (X)" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)"
    }
}

Write-Host ""

# Check Frontend
Write-Host "FRONTEND (Port 3000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  Status: RUNNING (checkmark)" -ForegroundColor Green
    Write-Host "  HTTP Code: $($response.StatusCode)"
} catch {
    Write-Host "  Status: ERROR (X)" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== DATABASE CHECK ===" -ForegroundColor Cyan
$dbPath = "society-treasurer-app\backend\instance\society_treasurer.db"
if (Test-Path $dbPath) {
    $dbSize = (Get-Item $dbPath).Length / 1KB
    Write-Host "  Database: EXISTS (checkmark)" -ForegroundColor Green
    Write-Host "  Size: $([math]::Round($dbSize, 2)) KB"
} else {
    Write-Host "  Database: NOT FOUND (X)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== ACCESS YOUR APP ===" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:3000"
Write-Host "  Default Login:"
Write-Host "    Username: admin"
Write-Host "    Password: admin123"
Write-Host ""

# Made with Bob
