# VAT/Tax Management

This module provides functionality for managing Value-Added Tax (VAT) settings within the application.

## Features

- Create, read, update, and delete VAT tax rates
- Associate tax rates with tenants (multi-tenant support)
- Set active/inactive status for tax rates
- Track creation and modification timestamps

## API Endpoints

All endpoints are accessible under `/api/settings/vat/`

### List all VAT taxes

```
GET /api/settings/vat/
```

### Get a specific VAT tax

```
GET /api/settings/vat/{id}/
```

### Create a new VAT tax

```
POST /api/settings/vat/
```

Example request body:

```json
{
  "name": "Standard VAT",
  "rate": 15.0,
  "description": "Standard VAT rate for most goods and services",
  "is_active": true
}
```

### Update a VAT tax

```
PUT /api/settings/vat/{id}/
PATCH /api/settings/vat/{id}/
```

### Delete a VAT tax

```
DELETE /api/settings/vat/{id}/
```

## Model Fields

- `id`: UUID identifier (auto-generated)
- `tenant`: Reference to the tenant this tax belongs to
- `name`: Name of the tax (e.g., "Standard VAT")
- `rate`: Decimal rate as percentage (e.g., 15.00 for 15%)
- `description`: Optional text description of the tax
- `is_active`: Boolean flag indicating if this tax rate is currently active
- `created_at`: Timestamp when the record was created
- `updated_at`: Timestamp when the record was last updated
