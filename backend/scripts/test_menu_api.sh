#!/bin/bash

# Debugging script for the menu item API
echo "==== Menu Item API Permission Test ===="
echo ""

# 1. Login to get the token
echo "1. Login to get token"
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"tenant@example.com","password":"password123"}' \
  -s | grep -o '"access":"[^"]*"' | sed 's/"access":"//;s/"$//' > token.txt

TOKEN=$(cat token.txt)
echo "Token retrieved"
echo ""

# 2. Get user details 
echo "2. Get user details"
curl -X GET http://localhost:8000/api/auth/user/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -s | python -m json.tool
echo ""

# 3. List the user's tenants
echo "3. List user's tenants"
curl -X GET http://localhost:8000/api/tenants/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -s | python -m json.tool
echo ""

# 4. List menu categories with tenant slug
echo "4. List menu categories"
curl -X GET http://localhost:8000/api/menu/categories/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Slug: test-tenant-restaurant" \
  -v 2>&1 | grep -v "^*" | grep -v "^}" | grep -v "^{"
echo ""

# 5. Create a menu category 
echo "5. Create a menu category"
curl -X POST http://localhost:8000/api/menu/categories/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Slug: test-tenant-restaurant" \
  -d '{"name":"Test Category","description":"Test category from API","status":"active"}' \
  -s | python -m json.tool
echo ""

# 6. Create a menu item
echo "6. Create a menu item"
curl -X POST http://localhost:8000/api/menu/items/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Slug: test-tenant-restaurant" \
  -d '{"name":"Test Item","description":"Test item from API","price":12.99,"cost":6.50}' \
  -v 2>&1 | grep -v "^*" | grep -v "^}" | grep -v "^{"
echo ""

# Clean up
rm token.txt
echo "Test complete"
