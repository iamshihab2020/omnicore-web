#!/bin/bash

# Script to create a menu item using the API

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

# Get active category ID if not provided
if [ -z "$CATEGORY_ID" ]; then
    echo "Finding a category to use..."
    
    # Get the first category ID
    CATEGORY_RESPONSE=$(curl -s -X GET http://localhost:8000/api/menu/categories/ \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "X-Tenant-Slug: test-tenant-restaurant")
    
    # Extract the first category ID
    export CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"$//')
    
    if [ -z "$CATEGORY_ID" ]; then
        echo "No categories found. Creating one..."
        
        # Create a category
        CATEGORY_CREATE_RESPONSE=$(curl -s -X POST http://localhost:8000/api/menu/categories/ \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "X-Tenant-Slug: test-tenant-restaurant" \
          -d '{"name":"Main Dishes","description":"Our signature main course dishes","status":"active"}')
          
        # Extract the new category ID
        export CATEGORY_ID=$(echo $CATEGORY_CREATE_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"$//')
        
        if [ -z "$CATEGORY_ID" ]; then
            echo "Failed to create category"
            echo "Response: $CATEGORY_CREATE_RESPONSE"
            # Just continue without a category
        else
            echo "Created new category with ID: $CATEGORY_ID"
        fi
    else
        echo "Found existing category with ID: $CATEGORY_ID"
    fi
fi

# Create the menu item
echo "Creating menu item..."
curl -X POST http://localhost:8000/api/menu/items/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Tenant-Slug: test-tenant-restaurant" \
  -d "{
    \"name\": \"Grilled Chicken Salad\",
    \"description\": \"Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic dressing\",
    \"price\": 14.99,
    \"cost\": 5.50,
    \"is_active\": true,
    \"preparation_time\": 10,
    \"category\": \"$CATEGORY_ID\"
  }" | python -m json.tool

echo "Done!"
