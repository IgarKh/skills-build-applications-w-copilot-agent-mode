# OctoFit Tracker API Test Script
# Test the Django REST API endpoints

# Configuration
$BASE_URL = "http://localhost:8000"
$API_ENDPOINTS = @(
    "api/users/",
    "api/teams/",
    "api/activities/",
    "api/leaderboard/",
    "api/workouts/"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OctoFit Tracker API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test root API endpoint
Write-Host "Testing Root API Endpoint:" -ForegroundColor Yellow
Write-Host "URL: GET $BASE_URL/api/" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/" -Method Get -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $response.Content | ConvertFrom-Json | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Gray
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test API endpoints
foreach ($endpoint in $API_ENDPOINTS) {
    Write-Host "Testing Endpoint: $endpoint" -ForegroundColor Yellow
    Write-Host "URL: GET $BASE_URL/$endpoint" -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "$BASE_URL/$endpoint" -Method Get -ErrorAction Stop
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        if ($statusCode -eq 401) {
            Write-Host "Status: $statusCode (Unauthorized - Authentication required)" -ForegroundColor Yellow
        } else {
            Write-Host "Status: $statusCode" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
