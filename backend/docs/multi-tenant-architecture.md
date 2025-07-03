# OmniCore Multi-Tenant Architecture

This document outlines the multi-tenant architecture of the OmniCore SaaS platform.

## Overview

OmniCore uses a multi-tenant architecture where each restaurant or business is a separate tenant. Users can belong to multiple tenants with different roles in each tenant.

## Key Components

### 1. User Authentication

- Authentication is handled using JWT (JSON Web Tokens)
- Users are stored in a central user table
- Users can belong to multiple tenants with different roles

### 2. Tenant Identification

We use a middleware-based approach for tenant identification:

- Authenticated users have access to tenants they're associated with
- For users with multiple tenants, the `X-Tenant-Slug` header specifies which tenant to use
  - Example: `X-Tenant-Slug: restaurant-one` or `X-Tenant-Slug: artpix-cafe`
  - This provides a human-readable identifier instead of a UUID
- The middleware automatically sets the tenant context for the request
- Access control is enforced through permission classes

### 3. Slug-Based Tenant Identification

- Each tenant has a unique, human-readable slug
- Slugs are derived from the tenant name and made URL-friendly
- Slugs are used in the API for tenant identification instead of UUIDs
- This makes API testing and debugging more developer-friendly
- Example: `test-tenant-restaurant` instead of `db5336dd-cc8a-4c65-a414-adcaa032f7de`

### 4. Data Isolation

- Each tenant's data is isolated using foreign key relationships
- All tenant-specific models include a `tenant` foreign key
- API views filter data based on the tenant context from the middleware
- Permission classes ensure users can only access data from tenants they belong to

## Request Flow

1. User authenticates and receives a JWT token
2. Subsequent API requests include:
   - Authorization header with the JWT token
   - X-Tenant-Slug header (if user belongs to multiple tenants)
3. Middleware processes the request:
   - Validates the user authentication
   - Identifies the tenant context from the slug
   - Sets the tenant on the request object
4. API views:
   - Use the tenant context to filter data
   - Enforce permissions based on the user's role in the tenant
   - Return only tenant-specific data

## API Design

- APIs don't require tenant_id in the URL or query parameters
- Tenant context is determined from authentication and headers
- Permission classes enforce access control at the view level
- Serializers ensure data integrity and validation

## Security Considerations

- Each tenant's data is isolated and protected
- Users can only access data from tenants they belong to
- Role-based permissions within each tenant
- JWT tokens have limited lifetime for security
- Tenant slugs are validated and sanitized to prevent security issues

## Best Practices

1. **Always filter by tenant in views**: Each ViewSet's get_queryset method should filter by `tenant=request.tenant`
2. **Set tenant on create**: All create operations should automatically set the tenant field
3. **Use tenant permissions**: Apply the appropriate permission classes like IsTenantUser, IsTenantAdmin
4. **Test with multiple tenants**: Ensure data isolation works correctly by testing with multiple tenant contexts
