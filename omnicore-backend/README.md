# OmniCore - Restaurant Management SaaS Platform

OmniCore is a comprehensive multi-tenant SaaS platform designed for restaurant management and Point of Sale (POS) operations.

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
│   ├── models.py
│   ├── permissions.py
│   ├── tests.py
│   └── views.py
│
├── authentication/   # Manages users per tenant (Tenant App)
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

For detailed documentation on these utilities, see [tenant-utils.md](docs/tenant-utils.md).

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
