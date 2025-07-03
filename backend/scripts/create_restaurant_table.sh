#!/bin/bash
# filepath: c:\Users\Victus\Documents\GitHub\omnicore-web\omnicore-backend\scripts\create_restaurant_table.sh

# Script to create a restaurant table using the API

# Check if we need to get a token first
if [ -z "$ACCESS_TOKEN" ]; then
    echo "No access token found, logging in to get one..."
    
    # Login to get the token
    RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login/ \
      -H "Content-Type: application/json" \
      -d '{"email":"tenant@example.com","password":"password123"}')
    
    # Extract the access token
    export ACCESS_TOKEN=$(echo $RESPONSE | grep -o '"access":"[^"]*"' | sed 's/"access":"//;s/"$//')
    
    if [ -z "$ACCESS_TOKEN" ]; then
        echo "Failed to obtain access token"
        echo "Response: $RESPONSE"
        exit 1
    fi
    
    echo "Successfully obtained access token"
fi

# Create the restaurant table
echo "Creating restaurant table..."
curl -X POST http://localhost:8000/api/management/table/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Tenant-Slug: test-tenant-restaurant" \
  -d '{
    "number": "T1",
    "name": "Front Window Table",
    "capacity": 4,
    "status": "available",
    "area": "Main Hall",
    "is_active": true,
    "notes": "Best table for couples and small groups"
  }' | python -m json.tool

echo "Done!"
