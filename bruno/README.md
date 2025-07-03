# OmniCore API Testing with Bruno

This folder contains a collection of Bruno API requests for testing the OmniCore backend API.

## What is Bruno?

[Bruno](https://www.usebruno.com/) is an open-source API client that makes it easy to test and debug APIs. It's lightweight, fast, and stores all API collections as plain text files that can be tracked in Git.

## Installation

1. Download and install Bruno from the [official website](https://www.usebruno.com/downloads)
2. Open Bruno and click on "Open Collection"
3. Select the `bruno` folder (not the nested omnicore folder) from your OmniCore repository

## Updated Structure

The Bruno collection has been reorganized to follow the latest Bruno format. The collection now includes:

- A `.brunorc` file at the root level
- Properly formatted `bruno.json` in the collection folder
- Folder structure with `folder.bru` files
- Environment configuration in `environments.bru`

## Environment Setup

This collection comes with two environments:

1. **Development** - Points to `http://localhost:8000`
2. **Production** - Points to `https://api.omnicore.example.com` (update this to your actual production URL)

To switch between environments, use the environment dropdown in the top right corner of Bruno.

## Authentication Flow

1. Run the "Login" request in the `auth` folder with valid credentials
2. Bruno will automatically store the JWT tokens as environment variables
3. All subsequent requests will use these tokens for authentication

## Available API Tests

### Authentication

- Login
- Register User
- Refresh Token
- Get User Details
- Change Password
- Logout

### Tenants

- List Tenants
- Create Tenant
- Get Tenant Details
- Update Tenant
- List Tenant Users
- Add User to Tenant

### Menu

- List Categories
- Create Category
- List Menu Items
- Create Menu Item
- Get Menu Item Details

### Sales

- List Orders
- Create Order
- Get Order Details
- Update Order Status
- Process Payment

### POS

- Open POS Session
- Get Active Session
- Record Cash Movement
- Get Session Summary
- Close POS Session

## Best Practices

1. Always start with the Login request to get valid tokens
2. Run requests in the order they appear in each folder
3. The tests are designed to save IDs in environment variables for subsequent requests
4. Check the "Tests" tab to see what validations are being performed

## Customizing Requests

You can customize the request bodies as needed for your specific testing scenarios. Most requests use environment variables (e.g., `{{tenantId}}`) that are set automatically by previous requests.
