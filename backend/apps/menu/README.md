# Menu API Testing Guide

This guide explains how to test the Menu API in the OmniCore SaaS platform.

## Setup

We've created a test tenant with the following credentials:

- **Email**: `tenant@example.com`
- **Password**: `password123`
- **Tenant ID**: `db5336dd-cc8a-4c65-a414-adcaa032f7de`
- **Tenant Slug**: `test-tenant-restaurant`

These credentials are already set in the Bruno environment variables.

## Testing Steps

1. **Start the Django server**

   ```
   cd omnicore-backend
   python manage.py runserver
   ```

2. **Log in using Bruno**

   - Open the Bruno app
   - Run the "Login" request in the `auth` folder
   - This will automatically store the JWT tokens in the environment

3. **Test the Category API endpoints**

   - **Create a category**: Run the `menu/create-category.bru` request
   - **List categories**: Run the `menu/list-categories.bru` request
   - **Get a specific category**: Run the `menu/get-category.bru` request
   - **Update a category**: Run the `menu/update-category.bru` request
   - **Delete a category**: Run the `menu/delete-category.bru` request

4. **Test the Menu Item API endpoints**
   - **Create a menu item**: Run the `menu/create-menu-item.bru` request
   - **List menu items**: Run the `menu/list-menu-items.bru` request
   - **Get a specific menu item**: Run the `menu/get-menu-item.bru` request
   - **Update a menu item**: Run the `menu/update-menu-item.bru` request
   - **Delete a menu item**: Run the `menu/delete-menu-item.bru` request

## API Endpoints

### Category API

The following API endpoints are available for the MenuCategory:

- **GET /api/menu/categories/** - List all categories
- **POST /api/menu/categories/** - Create a new category
- **GET /api/menu/categories/{id}/** - Get category details
- **PUT /api/menu/categories/{id}/** - Update a category
- **DELETE /api/menu/categories/{id}/** - Delete a category

### MenuItem API

The following API endpoints are available for the MenuItem:

- **GET /api/menu/items/** - List all menu items (with optional filters)
- **POST /api/menu/items/** - Create a new menu item
- **GET /api/menu/items/{id}/** - Get menu item details
- **PUT /api/menu/items/{id}/** - Update a menu item
- **DELETE /api/menu/items/{id}/** - Delete a menu item

#### Query Parameters for List Menu Items

- `category`: Filter by category ID
- `is_active`: Filter by active status (true/false)
- `is_featured`: Filter by featured status (true/false)

## Headers Required

All API requests require:

1. `Authorization: Bearer {accessToken}` - for authentication
2. `X-Tenant-Slug: {tenantSlug}` - to specify which tenant to use (when user has access to multiple tenants)
   Example: `X-Tenant-Slug: restaurant-one` or `X-Tenant-Slug: artpix-cafe`

## Category Model Fields

- `name` (required) - Category name
- `description` (optional) - Category description
- `status` - Either "active" or "inactive", defaults to "active"
- `display_order` - Integer for sorting categories
- `created_at` - Auto timestamp for creation time
- `updated_at` - Auto timestamp for update time

## MenuItem Model Fields

- `name` (required) - Menu item name
- `description` (optional) - Menu item description
- `price` (required) - Decimal price
- `cost` (optional) - Decimal cost price
- `category` (optional) - Foreign key to Category
- `is_active` - Boolean, defaults to true
- `is_featured` - Boolean, defaults to false
- `is_vegetarian` - Boolean, defaults to false
- `is_vegan` - Boolean, defaults to false
- `is_gluten_free` - Boolean, defaults to false
- `preparation_time` - Integer in minutes
- `calories` - Integer
- `display_order` - Integer for sorting
- `created_at` - Auto timestamp for creation time
- `updated_at` - Auto timestamp for update time
