Write-Host "=== TESTING BACKEND LOGIN ===" -ForegroundColor Cyan
Write-Host ""

$body = @{
    username = 'admin'
    password = 'admin123'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
    Write-Host "LOGIN TEST: SUCCESS" -ForegroundColor Green
    Write-Host "Token received: YES" -ForegroundColor Green
    Write-Host "User: $($response.user.username)"
    Write-Host "Role: $($response.user.role)"
    Write-Host ""
    Write-Host "Backend login is working correctly!" -ForegroundColor Green
}
catch {
    Write-Host "LOGIN TEST: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Response: $($_.Exception.Response.StatusCode.value__)"
}

Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Yellow
Write-Host "1. The frontend API URL has been fixed to use port 5000"
Write-Host "2. Please refresh your browser page (Ctrl+F5 or Cmd+Shift+R)"
Write-Host "3. Try logging in again with:"
Write-Host "   Username: admin"
Write-Host "   Password: admin123"
Write-Host ""

# Made with Bob
