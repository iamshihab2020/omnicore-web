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
    print("Example: ACCESS_TOKEN='your_jwt_token' python scripts/create_menu_item.py")
    sys.exit(1)

# Define the menu item data
menu_item = {
    "name": "Grilled Chicken Salad",
    "description": "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic dressing",
    "price": 14.99,
    "cost": 5.50,
    "is_active": True,
    "preparation_time": 10,
    "category": None,  # This will be filled in if a category_id is provided
}

# Check if we have a category ID as an argument
if len(sys.argv) > 1:
    category_id = sys.argv[1]
    menu_item["category"] = category_id
    print(f"Using category ID: {category_id}")

# Set headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}",
    "X-Tenant-Slug": tenant_slug,
}

# Make the API request
try:
    url = f"{base_url}/api/menu/items/"
    print(f"Creating menu item at: {url}")
    print(f"With data: {json.dumps(menu_item, indent=2)}")

    response = requests.post(url, json=menu_item, headers=headers)
    response.raise_for_status()

    # Print the response
    print("\nSuccess! Menu item created:")
    print(json.dumps(response.json(), indent=2))

except requests.exceptions.HTTPError as e:
    print(f"\nError: HTTP error occurred: {e}")
    print(f"Response body: {response.text}")
except requests.exceptions.ConnectionError as e:
    print(f"\nError: Connection error: {e}")
except Exception as e:
    print(f"\nError: {str(e)}")
