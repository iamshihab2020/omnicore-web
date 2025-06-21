# OmniCore - Restaurant Management SaaS Platform

OmniCore is a comprehensive multi-tenant SaaS platform designed for restaurant management and Point of Sale (POS) operations. The platform provides a complete solution for managing restaurant operations, including menu management, order processing, payment handling, counter/selling point management, tax management, and more.

## Project Structure

The project is divided into two main parts:

1. **omnicore-backend**: Django REST API backend with JWT authentication
2. **omnicore-frontend**: Next.js frontend application

## Backend

### Technology Stack

- **Python 3.12+**
- **Django 5.2+**
- **Django REST Framework**
- **JWT Authentication** (using djangorestframework-simplejwt)
- **SQLite** (default for development, can be configured for PostgreSQL in production)

### Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/omnicore-web.git
cd omnicore-web/omnicore-backend
```

2. **Set up a virtual environment**

```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
# OR
source venv/bin/activate      # On Unix/Mac
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Create a `.env` file in the omnicore-backend directory and add:

```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

5. **Run migrations**

```bash
python manage.py migrate
```

6. **Create a superuser**

```bash
python manage.py createsuperuser
```

7. **Create a tenant**

```bash
python manage.py create_tenant --name "Your Restaurant" --email "admin@example.com" --password "securepassword" --first_name "Admin" --last_name "User"
```

8. **Run the development server**

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### API Endpoints

#### Authentication

- `POST /api/auth/login/` - Log in and obtain JWT tokens
- `POST /api/auth/logout/` - Log out (blacklist refresh token)
- `POST /api/auth/register/` - Register a new user
- `GET /api/auth/user/` - Get authenticated user details
- `POST /api/auth/password/change/` - Change user password
- `POST /api/auth/password/reset/` - Request password reset
- `POST /api/auth/password/reset/confirm/` - Confirm password reset

#### Tenants

- `GET /api/tenants/` - List user's tenants
- `POST /api/tenants/` - Create a new tenant
- `GET /api/tenants/{id}/` - Get tenant details
- `PUT /api/tenants/{id}/` - Update tenant
- `DELETE /api/tenants/{id}/` - Delete tenant
- `GET /api/tenants/{tenant_id}/users/` - List tenant users
- `POST /api/tenants/{tenant_id}/users/` - Add user to tenant
- `GET /api/tenants/{tenant_id}/users/{id}/` - Get tenant user details
- `PUT /api/tenants/{tenant_id}/users/{id}/` - Update tenant user
- `DELETE /api/tenants/{tenant_id}/users/{id}/` - Remove user from tenant

#### Settings

##### Counters
Counters represent selling points or service points in a restaurant.

- `GET /api/settings/counters/` - List all counters for the tenant
- `POST /api/settings/counters/` - Create a new counter
- `GET /api/settings/counters/{id}/` - Get details of a specific counter
- `PUT /api/settings/counters/{id}/` - Update counter information
- `DELETE /api/settings/counters/{id}/` - Delete a counter

Counter functionalities include:
- Assigning menu items to specific counters
- Setting counter status (active/inactive)
- Defining counter location and description
- Managing which items can be sold at each counter

##### VAT Tax
VAT (Value-Added Tax) management for applying taxes to orders.

- `GET /api/settings/vat/` - List all VAT tax entries for the tenant
- `POST /api/settings/vat/` - Create a new VAT tax entry
- `GET /api/settings/vat/{id}/` - Get details of a specific VAT tax
- `PUT /api/settings/vat/{id}/` - Update VAT tax information
- `PATCH /api/settings/vat/{id}/` - Partially update VAT tax (e.g., activate/deactivate)
- `DELETE /api/settings/vat/{id}/` - Delete a VAT tax entry

VAT tax functionalities include:
- Setting different tax rates
- Activating or deactivating tax rates
- Naming and describing tax rates (e.g., Standard VAT, Reduced VAT)
- Automatically associating taxes with the tenant

#### Menu Management

- `GET /api/menu/categories/` - List all menu categories
- `POST /api/menu/categories/` - Create a new menu category
- `GET /api/menu/categories/{id}/` - Get details of a specific category
- `PUT /api/menu/categories/{id}/` - Update category
- `DELETE /api/menu/categories/{id}/` - Delete category
- `GET /api/menu/items/` - List all menu items
- `POST /api/menu/items/` - Create a new menu item
- `GET /api/menu/items/{id}/` - Get details of a specific item
- `PUT /api/menu/items/{id}/` - Update item
- `DELETE /api/menu/items/{id}/` - Delete item

#### POS Operations

- `POST /api/pos/open-session/` - Open a new POS session
- `GET /api/pos/active-session/` - Get details of the current active session
- `POST /api/pos/record-cash-movement/` - Record cash movement (in/out)
- `GET /api/pos/session-summary/{id}/` - Get session financial summary
- `POST /api/pos/close-session/` - Close an active POS session

#### Sales Management

- `POST /api/sales/orders/` - Create a new order
- `GET /api/sales/orders/` - List all orders (with filtering options)
- `GET /api/sales/orders/{id}/` - Get details of a specific order
- `PATCH /api/sales/orders/{id}/status/` - Update order status
- `POST /api/sales/orders/{id}/payment/` - Process payment for an order

### Project Structure

```
omnicore-backend/
├── __init__.py
├── asgi.py
├── settings.py
├── urls.py
└── wsgi.py
apps/
├── __init__.py
│
├── tenants/          # Manages tenants (Shared App)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── management/
│   │   └── commands/
│   │       └── create_tenant.py
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── core/             # Core/Shared logic (Shared App)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models/
│   ├── middleware/
│   ├── permissions.py
│   ├── utils/
│   ├── tests.py
│   └── views.py
│
├── authentication/   # Manages users per tenant (Tenant App)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── jwt.py
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── menu/             # Manages menu items (Tenant App)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── settings/         # Manages restaurant settings (Tenant App)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── urls.py
│   ├── counters/     # Counter management module
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   └── vat/          # VAT tax management module
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── tests.py
│       ├── urls.py
│       └── views.py
│
├── sales/            # Manages orders and sales (Tenant App)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
└── pos/              # Handles POS operations (Tenant App)
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── migrations/
    ├── models.py
    ├── serializers.py
    ├── tests.py
    ├── urls.py
    └── views.py
```

## Frontend (Next.js)

Details of the frontend implementation can be found in the `omnicore-frontend` directory.

## Multi-Tenancy Architecture

OmniCore uses a multi-tenant approach with the following characteristics:

- Each restaurant/business is a tenant identified by a human-readable slug
- Users can belong to multiple tenants with different roles
- Each tenant has its own menu, inventory, orders, etc.
- Common functionality is shared across tenants
- Requests include an `X-Tenant-Slug` header to specify the tenant context

For detailed documentation on the multi-tenant architecture, see [multi-tenant-architecture.md](docs/multi-tenant-architecture.md).

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials and returns JWT tokens (access and refresh)
3. Frontend stores tokens and includes them in subsequent API requests
4. Access token is used for authentication and authorization
5. Refresh token is used to obtain a new access token when it expires
6. For authenticated requests to tenant-specific endpoints, the `X-Tenant-Slug` header is included

## Tenant Utilities

We provide utility functions to make working with tenants easier:

- `TenantContextManager`: Helper class for tenant operations
- Methods for tenant filtering, role checking, and more



## Core Features and Models

### Multi-Tenancy

The platform is built with multi-tenancy at its core:
- Each restaurant or business is a distinct tenant
- Data isolation between tenants
- Shared infrastructure but separate data storage
- Tenant context middleware that injects tenant information into each request

### User Management

- Users can belong to multiple tenants
- Role-based permissions (Owner, Admin, Staff)
- JWT authentication with token refresh mechanism
- Password reset and email verification

### Counter Management

Counters represent selling points or service points within a restaurant:

- **Key Features:**
  - Counter creation and management
  - Status tracking (active/inactive)
  - Menu item assignment to specific counters
  - Location tracking and description

### VAT Tax Management

VAT tax management allows restaurants to define different tax rates:

- **Key Features:**
  - Create multiple tax rates (standard, reduced, etc.)
  - Set specific percentage rates
  - Activate/deactivate tax rates
  - Tenant-specific tax configuration
  - Track creation and modification timestamps

### Menu Management

- **Categories:** Group menu items logically
- **Items:** Individual dishes or products
- **Pricing:** Set prices for each menu item
- **Availability:** Control item availability
- **Images:** Upload and manage item images

### POS Operations

- **Sessions:** Open and close POS sessions
- **Cash Management:** Track cash movements
- **Session Summary:** Financial summaries for each session

### Order Processing

- **Order Creation:** Create orders with items
- **Status Management:** Update order statuses
- **Payment Processing:** Handle various payment methods
- **Order History:** Track and search order history

## API Testing

### Using Bruno API Client

This project includes a comprehensive collection of API requests using [Bruno](https://www.usebruno.com/), an open-source API client.

Bruno collections are organized by module in the `/bruno/omnicore/` directory:

```
bruno/
├── environments/
│   ├── development.json
│   └── production.json
└── omnicore/
    ├── auth/
    │   ├── folder.bru
    │   └── ...
    ├── settings/
    │   ├── folder.bru
    │   ├── Counter/
    │   │   ├── Create Counter.bru
    │   │   ├── Delete Counter.bru
    │   │   ├── folder.bru
    │   │   ├── Get Counters.bru
    │   │   └── Update Counter.bru
    │   └── Vat/
    │       ├── Create VAT Tax.bru
    │       ├── Delete VAT Tax.bru
    │       ├── folder.bru
    │       ├── Get VAT Tax Detail.bru
    │       ├── Get VAT Taxes.bru
    │       ├── Patch VAT Tax.bru
    │       └── Update VAT Tax.bru
    ├── menu/
    │   └── ...
    ├── pos/
    │   └── ...
    └── sales/
        └── ...
```

To use these collections:
1. Install the Bruno app from [usebruno.com](https://www.usebruno.com/)
2. Open the bruno folder in the app
3. Set up your environment variables
4. Run the requests to test the API

### Convenience Scripts

The project includes several utility scripts to help with testing and development:

```
scripts/
├── create_counter_migrations.sh
├── create_menu_item.py
├── create_menu_item.sh
├── create_restaurant_table.py
├── create_restaurant_table.sh
├── create_test_counters.py
├── create_test_tenant.py
├── delete_restaurant_table.py
├── delete_restaurant_table.sh
├── list_restaurant_tables.py
├── list_restaurant_tables.sh
├── run_tenant_tests.sh
├── test_counters.sh
├── test_login_and_counters.py
└── test_menu_api.sh
```

These scripts help with:
- Creating test data
- Running specific test scenarios
- Managing database migrations
- Testing API functionality

## Deployment

### Development Environment

For development, the application uses SQLite for simplicity. Run with:

```bash
python manage.py runserver
```

### Production Deployment

For production deployment:

1. **Configure environment variables**

   Create appropriate environment variables for production:
   - `DEBUG=False`
   - `SECRET_KEY=your-secure-secret-key`
   - `ALLOWED_HOSTS=yourdomain.com`
   - `DATABASE_URL=postgres://user:password@localhost:5432/omnicore`
   - `CORS_ALLOWED_ORIGINS=https://yourdomain.com`

2. **Set up database**

   Configure PostgreSQL or another production-ready database.

3. **Run migrations**

   ```bash
   python manage.py migrate
   ```

4. **Collect static files**

   ```bash
   python manage.py collectstatic
   ```

5. **Set up WSGI server**

   Configure Gunicorn or another WSGI server:

   ```bash
   gunicorn omnicore_backend.wsgi:application
   ```

6. **Set up web server**

   Configure Nginx or another web server as a reverse proxy.

## Development Best Practices

### Data Isolation

Always ensure tenant data is properly isolated by using tenant-specific filtering in all queries. The system implements tenant context middleware that automatically injects tenant information into requests.

### Permission Checks

Use the provided permission classes for tenant-specific permissions such as `IsTenantUser`, `IsTenantAdmin`, and `IsTenantOwner` to ensure proper authorization across the application.

### Testing

Write tests for all API endpoints and models:

```bash
# Run all tests
python manage.py test

# Run tenant-specific tests
./scripts/run_tenant_tests.sh
```

### API Versioning

The API is designed to support versioning if needed in the future:

```
/api/v1/endpoint/  # Future version support
```





For detailed documentation on these utilities, see [tenant-utils.md](docs/tenant-utils.md).

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request