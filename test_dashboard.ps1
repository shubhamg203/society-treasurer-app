Write-Host "=== TESTING DASHBOARD ENDPOINT ===" -ForegroundColor Cyan
Write-Host ""

# First, login to get a token
Write-Host "Step 1: Logging in..." -ForegroundColor Yellow
$loginBody = @{
    username = 'admin'
    password = 'admin123'
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json'
    $token = $loginResponse.access_token
    Write-Host "Login: SUCCESS" -ForegroundColor Green
    Write-Host "Token received" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "Login: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    exit
}

# Now test the dashboard endpoint
Write-Host "Step 2: Testing Dashboard API..." -ForegroundColor Yellow
$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}

try {
    $dashboardResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/dashboard/summary' -Method GET -Headers $headers
    Write-Host "Dashboard API: SUCCESS" -ForegroundColor Green
    Write-Host ""
    Write-Host "Dashboard Data:" -ForegroundColor Cyan
    Write-Host "  Current Balance: $($dashboardResponse.current_balance)"
    Write-Host "  Total Credits: $($dashboardResponse.total_credits)"
    Write-Host "  Total Debits: $($dashboardResponse.total_debits)"
    Write-Host "  Total Flats: $($dashboardResponse.total_flats)"
    Write-Host "  Recent Transactions: $($dashboardResponse.recent_transactions.Count)"
    Write-Host ""
    Write-Host "The backend is working correctly!" -ForegroundColor Green
}
catch {
    Write-Host "Dashboard API: FAILED" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host ""
    
    # Try to get more details
    if ($_.ErrorDetails.Message) {
        Write-Host "Error Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
}

Write-Host ""
Write-Host "=== DIAGNOSIS ===" -ForegroundColor Yellow
Write-Host "If dashboard test succeeded but frontend still fails:"
Write-Host "1. Clear browser cache (Ctrl+Shift+Delete)"
Write-Host "2. Hard refresh the page (Ctrl+F5)"
Write-Host "3. Check browser console for errors (F12)"
Write-Host "4. Make sure you're using http://localhost:3000 (not 5000)"
Write-Host ""

# Made with Bob
