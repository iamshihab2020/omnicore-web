# Settings App

This app is responsible for managing various system settings for the OmniCore platform.

## Modules

### Counters

The Counters module allows management of restaurant selling counters (points of sale). These are the physical or virtual locations where sales are processed.

**API Endpoints:**

- `GET /api/settings/counters/` - List all counters
- `POST /api/settings/counters/` - Create a new counter
- `GET /api/settings/counters/{id}/` - Get details of a specific counter
- `PUT /api/settings/counters/{id}/` - Update a counter
- `PATCH /api/settings/counters/{id}/` - Partially update a counter
- `DELETE /api/settings/counters/{id}/` - Delete a counter

## Future Modules

Other settings modules that will be added in the future include:

- Tax Settings
- Subscription Settings
- General System Settings
- User Preferences
- And more...
