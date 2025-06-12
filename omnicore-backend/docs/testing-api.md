# Testing the Multi-Tenant API

This guide explains how to test the multi-tenant API in the OmniCore SaaS platform.

## Prerequisites

1. A user account that belongs to at least one tenant
2. Access token (JWT) obtained through login
3. Tenant slug for the tenant you want to access (e.g., "restaurant-one", "artpix-cafe")

## Testing with Bruno

We've created Bruno API collection files for testing the API. Here's how to use them:

1. **Login to get tokens**

   - Use the `auth/login.bru` request with your email and password
   - This will automatically store the JWT token in the environment

2. **Using the X-Tenant-Slug header**

   - All API requests include the `X-Tenant-Slug` header set to the tenant slug
   - Example: `X-Tenant-Slug: restaurant-one`
   - This header tells the API which tenant context to use
   - The header is only required if your user belongs to multiple tenants

3. **Menu Category API Tests**
   - **List categories**: GET /api/menu/categories/
   - **Create category**: POST /api/menu/categories/
   - **Get category**: GET /api/menu/categories/{id}/
   - **Update category**: PUT /api/menu/categories/{id}/
   - **Delete category**: DELETE /api/menu/categories/{id}/

## Testing with cURL

You can also test the API using cURL:

```bash
# Login to get token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"tenant@example.com","password":"password123"}'

# Store the access token
export TOKEN="your_access_token_here"
export TENANT_SLUG="restaurant-one"

# List categories
curl http://localhost:8000/api/menu/categories/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Slug: $TENANT_SLUG"

# Create a category
curl -X POST http://localhost:8000/api/menu/categories/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Slug: $TENANT_SLUG" \
  -H "Content-Type: application/json" \
  -d '{"name":"Desserts","description":"Sweet treats","status":"active"}'
```

## Common Issues and Solutions

1. **401 Unauthorized**: Your JWT token is missing, invalid, or expired. Try logging in again.

2. **403 Forbidden**: Your user doesn't have access to the requested tenant or resource.

3. **No active tenant found**: You need to provide the X-Tenant-Slug header if your user belongs to multiple tenants.

4. **Empty results**: Check that you're using the correct tenant slug and that your user has access to it.
