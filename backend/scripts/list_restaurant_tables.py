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
        "Example: ACCESS_TOKEN='your_jwt_token' python scripts/list_restaurant_tables.py"
    )
    sys.exit(1)

# Parse command line arguments
include_counts = False
status_filter = None
area_filter = None

# Simple command line argument parsing
for arg in sys.argv[1:]:
    if arg == "--counts" or arg == "-c":
        include_counts = True
    elif arg.startswith("--status="):
        status_filter = arg.split("=")[1]
    elif arg.startswith("--area="):
        area_filter = arg.split("=")[1]

# Set headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}",
    "X-Tenant-Slug": tenant_slug,
}

# Build query parameters
query_params = []
if include_counts:
    query_params.append("include_counts=true")
if status_filter:
    query_params.append(f"status={status_filter}")
if area_filter:
    query_params.append(f"area={area_filter}")

query_string = "&".join(query_params)
if query_string:
    query_string = "?" + query_string

# Make the API request
try:
    url = f"{base_url}/api/management/table/{query_string}"
    print(f"Fetching restaurant tables from: {url}")

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    # Print the response
    data = response.json()
    print("\nRestaurant Tables:")

    # Check if we have counts in the response
    if "counts" in data:
        print(f"\nTable Counts:")
        for status, count in data["counts"].items():
            print(f"  {status}: {count}")
        print("")

    # Print table data
    tables = data.get("data", [])
    if not tables:
        print("No tables found matching your criteria.")
    else:
        for i, table in enumerate(tables, 1):
            print(f"{i}. Table {table['number']} - {table['name']}")
            print(f"   Status: {table['status']}")
            print(f"   Area: {table['area'] or 'Not specified'}")
            print(f"   Capacity: {table['capacity']} people")
            print(f"   ID: {table['id']}")
            print("")

except requests.exceptions.HTTPError as e:
    print(f"\nError: HTTP error occurred: {e}")
    print(f"Response body: {response.text}")
except requests.exceptions.ConnectionError as e:
    print(f"\nError: Connection error: {e}")
except Exception as e:
    print(f"\nError: {str(e)}")
