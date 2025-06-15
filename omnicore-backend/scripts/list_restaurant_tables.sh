#!/bin/bash
# filepath: c:\Users\Victus\Documents\GitHub\omnicore-web\omnicore-backend\scripts\list_restaurant_tables.sh

# Script to list restaurant tables using the API

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

# Build the URL with query parameters
URL="http://localhost:8000/api/management/table/"
QUERY_PARAMS=""

# Process command line arguments
for arg in "$@"; do
    case $arg in
        --counts|-c)
            if [ -z "$QUERY_PARAMS" ]; then
                QUERY_PARAMS="?include_counts=true"
            else
                QUERY_PARAMS="${QUERY_PARAMS}&include_counts=true"
            fi
            ;;
        --status=*)
            STATUS="${arg#*=}"
            if [ -z "$QUERY_PARAMS" ]; then
                QUERY_PARAMS="?status=$STATUS"
            else
                QUERY_PARAMS="${QUERY_PARAMS}&status=$STATUS"
            fi
            ;;
        --area=*)
            AREA="${arg#*=}"
            if [ -z "$QUERY_PARAMS" ]; then
                QUERY_PARAMS="?area=$AREA"
            else
                QUERY_PARAMS="${QUERY_PARAMS}&area=$AREA"
            fi
            ;;
    esac
done

# Fetch the restaurant tables
echo "Fetching restaurant tables..."
curl -X GET "${URL}${QUERY_PARAMS}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Tenant-Slug: test-tenant-restaurant" \
  | python -m json.tool

echo "Done!"
