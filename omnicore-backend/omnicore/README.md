# Omnicore API Testing with Bruno

This folder contains API testing collections for the Omnicore Restaurant Management System built with [Bruno](https://www.usebruno.com/).

## Setup

1. Install Bruno from the [official website](https://www.usebruno.com/downloads) or using a package manager.
2. Open Bruno and click "Open Collection".
3. Navigate to this folder and open it.

## Collections

The API test collections are organized into the following categories:

### Authentication

- Login
- Tenant Login
- Token Refresh
- User Profile
- Register User
- Test Authentication

### SuperAdmin

- List Tenants
- Get Tenant Details
- Create Tenant
- Update Tenant
- Delete Tenant
- List Users

### Menu Management

- List Categories
- Create Category
- List Items
- Create Item

### POS System

- List Orders
- Create Order
- Process Payment

### Staff Management

- List Staff
- Create Staff Member
- Schedule Shift

### Analytics

- Sales Summary
- Popular Items
- Staff Performance

## Environments

Two environments are provided:

- **Local Development**: For testing against your local development server.
- **Production**: For testing against the production API (requires valid credentials).

## Usage

1. First run the **Login** request to authenticate as either a superadmin user or tenant user.
2. The environment variables will automatically be set with the JWT tokens.
3. Use these tokens for subsequent authenticated requests.

## Variables

The following environment variables are used:

- `base_url`: Base URL for the API
- `access_token`: JWT access token for superadmin
- `refresh_token`: JWT refresh token for superadmin
- `tenant_access_token`: JWT access token for tenant users
- `tenant_refresh_token`: JWT refresh token for tenant users
- `new_tenant_id`: ID of newly created tenant (set after creation)
- `category_id`: ID of menu category (set after creation)
- `menu_item_id`: ID of menu item (set after creation)
- `order_id`: ID of order (set after creation)
- `staff_id`: ID of staff member (set after creation)

## Testing Flow

For a complete testing flow:

1. Login as superadmin
2. Create a new tenant
3. Login as tenant
4. Test tenant-specific features like menu, pos, staff, etc.
