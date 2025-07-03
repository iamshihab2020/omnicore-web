import requests
import json
import sys
import os

# Get environment variables or use defaults
base_url = os.environ.get("API_URL", "http://localhost:8000")
token = os.environ.get("ACCESS_TOKEN", "")
tenant_slug = os.environ.get("TENANT_SLUG", "test-tenant-restaurant")

# Check if we have a token
if not token:
    print(
        "Error: No access token provided. Please set ACCESS_TOKEN environment variable."
    )
    print(
        "Example: ACCESS_TOKEN='your_jwt_token' python scripts/create_restaurant_table.py"
    )
    sys.exit(1)

# Define the restaurant table data
table_data = {
    "number": "T1",
    "name": "Front Window Table",
    "capacity": 4,
    "status": "available",
    "area": "Main Hall",
    "is_active": True,
    "notes": "Best table for couples and small groups",
}

# Set headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}",
    "X-Tenant-Slug": tenant_slug,
}

# Make the API request
try:
    url = f"{base_url}/api/management/table/"
    print(f"Creating restaurant table at: {url}")
    print(f"With data: {json.dumps(table_data, indent=2)}")

    response = requests.post(url, json=table_data, headers=headers)
    response.raise_for_status()

    # Print the response
    print("\nSuccess! Restaurant table created:")
    print(json.dumps(response.json(), indent=2))

except requests.exceptions.HTTPError as e:
    print(f"\nError: HTTP error occurred: {e}")
    print(f"Response body: {response.text}")
except requests.exceptions.ConnectionError as e:
    print(f"\nError: Connection error: {e}")
except Exception as e:
    print(f"\nError: {str(e)}")
