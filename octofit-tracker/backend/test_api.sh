#!/bin/bash

# OctoFit Tracker API Test Script for GitHub Codespaces
# Test the Django REST API endpoints

BASE_URL="http://localhost:8000"
API_ENDPOINTS=(
    "api/users/"
    "api/teams/"
    "api/activities/"
    "api/leaderboard/"
    "api/workouts/"
)

echo "========================================"
echo "OctoFit Tracker API Test"
echo "========================================"
echo ""

# Test root API endpoint
echo "Testing Root API Endpoint:"
echo "URL: GET $BASE_URL/api/"
curl -s -X GET "$BASE_URL/api/" \
    -H "Content-Type: application/json" | jq '.' || echo "Failed to reach API"
echo ""

# Test each endpoint
for endpoint in "${API_ENDPOINTS[@]}"; do
    echo "Testing Endpoint: $endpoint"
    echo "URL: GET $BASE_URL/$endpoint"
    
    response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/$endpoint" \
        -H "Content-Type: application/json")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo "Status: $http_code"
    
    if [ "$http_code" == "200" ]; then
        echo "$body" | jq '.' || echo "$body"
    elif [ "$http_code" == "401" ]; then
        echo "Status: 401 (Unauthorized - Authentication required)"
    else
        echo "$body"
    fi
    echo ""
done

echo "========================================"
echo "API Test Complete"
echo "========================================"
