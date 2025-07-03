# Tenant Context Utilities

This document describes the utility functions available for working with tenant context in the OmniCore platform.

## TenantContextManager

The `TenantContextManager` class provides helper methods to manage tenant context in views, services, and other components of the application.

### Available Methods

#### `get_active_tenant_for_user(user, tenant_slug=None)`

Gets the active tenant for a user based on the provided slug.

**Parameters:**

- `user`: The user to get the tenant for
- `tenant_slug`: Optional tenant slug to filter by

**Returns:**

- Tenant object or None if not found

**Example:**

```python
from apps.core.utils import TenantContextManager

# Get tenant by slug
tenant = TenantContextManager.get_active_tenant_for_user(request.user, "restaurant-one")

# Get first active tenant for user
default_tenant = TenantContextManager.get_active_tenant_for_user(request.user)
```

#### `get_user_role_in_tenant(user, tenant)`

Gets the user's role in a specific tenant.

**Parameters:**

- `user`: The user to check
- `tenant`: The tenant to check

**Returns:**

- Role string or None if user is not in the tenant

**Example:**

```python
role = TenantContextManager.get_user_role_in_tenant(user, tenant)
if role == 'owner':
    # Allow owner-specific actions
```

#### `is_user_in_tenant_role(user, tenant, roles)`

Checks if a user has one of the specified roles in a tenant.

**Parameters:**

- `user`: The user to check
- `tenant`: The tenant to check
- `roles`: List of roles to check for

**Returns:**

- Boolean indicating if user has any of the roles

**Example:**

```python
# Check if user is owner or admin
if TenantContextManager.is_user_in_tenant_role(user, tenant, ['owner', 'admin']):
    # Allow admin actions
```

#### `filter_queryset_by_tenant(queryset, tenant)`

Filters a queryset by tenant.

**Parameters:**

- `queryset`: The queryset to filter
- `tenant`: The tenant to filter by

**Returns:**

- Filtered queryset

**Example:**

```python
products = TenantContextManager.filter_queryset_by_tenant(Product.objects.all(), tenant)
```

## Best Practices

1. **Use in ViewSets**: These utilities are particularly useful in ViewSets to simplify tenant-specific operations
2. **Combine with Permissions**: Use alongside permission classes for comprehensive access control
3. **Use in Services**: When creating service classes, use these utilities to maintain tenant isolation
