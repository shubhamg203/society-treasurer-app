# PowerShell script to restart the backend with the correct version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Society Treasurer App - Backend Fix  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all Python processes
Write-Host "Step 1: Stopping all Python processes..." -ForegroundColor Yellow
try {
    $pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
    if ($pythonProcesses) {
        $pythonProcesses | Stop-Process -Force
        Write-Host "✓ Stopped $($pythonProcesses.Count) Python process(es)" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "✓ No Python processes running" -ForegroundColor Green
    }
} catch {
    Write-Host "! Could not stop Python processes (they may already be stopped)" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Verify port 5000 is free
Write-Host "Step 2: Checking if port 5000 is free..." -ForegroundColor Yellow
$portTest = Test-NetConnection -ComputerName localhost -Port 5000 -WarningAction SilentlyContinue
if ($portTest.TcpTestSucceeded) {
    Write-Host "✗ Port 5000 is still in use!" -ForegroundColor Red
    Write-Host "  Please manually close any programs using port 5000" -ForegroundColor Red
    Write-Host "  Then run this script again" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
} else {
    Write-Host "✓ Port 5000 is free" -ForegroundColor Green
}

Write-Host ""

# Step 3: Navigate to backend directory
Write-Host "Step 3: Starting the simplified backend server..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\backend"

# Step 4: Start the simplified backend
Write-Host "✓ Starting app_simple.py on port 5000..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend server is starting..." -ForegroundColor Cyan
Write-Host "Keep this window open!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

python app_simple.py

# Made with Bob
