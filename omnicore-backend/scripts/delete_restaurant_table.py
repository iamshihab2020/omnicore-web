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
        "Example: ACCESS_TOKEN='your_jwt_token' python scripts/delete_restaurant_table.py <table_id>"
    )
    sys.exit(1)

# Check if we have a table ID
if len(sys.argv) < 2:
    print("Error: No table ID provided.")
    print("Usage: python scripts/delete_restaurant_table.py <table_id>")
    sys.exit(1)

table_id = sys.argv[1]

# Set headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}",
    "X-Tenant-Slug": tenant_slug,
}

# Make the API request
try:
    url = f"{base_url}/api/management/table/{table_id}/"
    print(f"Deleting restaurant table with ID: {table_id}")

    response = requests.delete(url, headers=headers)
    response.raise_for_status()

    # Print the response
    print("\nSuccess! Restaurant table deleted:")
    try:
        print(json.dumps(response.json(), indent=2))
    except json.JSONDecodeError:
        print(f"Response status code: {response.status_code}")

except requests.exceptions.HTTPError as e:
    print(f"\nError: HTTP error occurred: {e}")
    print(f"Response body: {response.text}")
except requests.exceptions.ConnectionError as e:
    print(f"\nError: Connection error: {e}")
except Exception as e:
    print(f"\nError: {str(e)}")
