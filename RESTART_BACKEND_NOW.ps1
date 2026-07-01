Write-Host "=== RESTARTING BACKEND SERVER ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will restart your Flask backend to apply the JWT fix..." -ForegroundColor Yellow
Write-Host ""

# Find and stop the Python process running on port 5000
Write-Host "Step 1: Stopping old backend process..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process) {
    Stop-Process -Id $process -Force
    Write-Host "Old backend stopped" -ForegroundColor Green
    Start-Sleep -Seconds 2
}
else {
    Write-Host "No backend process found on port 5000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Starting new backend..." -ForegroundColor Yellow
Write-Host ""

# Start the backend in a new window
$backendPath = "society-treasurer-app\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python app.py"

Write-Host "Backend is starting in a new window..." -ForegroundColor Green
Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. Wait 5 seconds for backend to fully start"
Write-Host "2. Refresh your browser (Ctrl+F5)"
Write-Host "3. Login again with:"
Write-Host "   Username: admin"
Write-Host "   Password: admin123"
Write-Host ""
Write-Host "The dashboard should now load correctly!" -ForegroundColor Green
Write-Host ""

# Made with Bob
