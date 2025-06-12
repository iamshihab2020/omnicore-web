#!/bin/bash
# filepath: c:\Users\Victus\Documents\GitHub\omnicore-web\omnicore-backend\scripts\delete_restaurant_table.sh

# Script to delete a restaurant table using the API

# Check if table ID is provided
if [ -z "$1" ]; then
    echo "Error: No table ID provided"
    echo "Usage: bash scripts/delete_restaurant_table.sh <table_id>"
    exit 1
fi

TABLE_ID=$1

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

# Delete the restaurant table
echo "Deleting restaurant table with ID: $TABLE_ID"
curl -X DELETE "http://localhost:8000/api/management/table/tables/$TABLE_ID/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Tenant-Slug: test-tenant-restaurant" \
  | python -m json.tool

echo "Done!"
