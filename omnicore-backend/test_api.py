import requests
import json

# Base URL
base_url = "http://127.0.0.1:8000/api/v1"


def get_token(email, password):
    """Get JWT token from API"""
    url = f"{base_url}/auth/token/"
    data = {"email": email, "password": password}

    response = requests.post(url, json=data)
    print(f"Status code: {response.status_code}")

    if response.status_code == 200:
        print("Authentication successful!")
        return response.json()
    else:
        print(f"Authentication failed: {response.text}")
        return None


def test_auth_endpoint(token):
    """Test the authentication endpoint with token"""
    url = f"{base_url}/auth/test-auth/"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    print(f"Status code: {response.status_code}")

    if response.status_code == 200:
        print("Test endpoint accessed successfully!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Access failed: {response.text}")


# Use tenant owner credentials
email = "owner@restaurant.com"
password = "Owner@123!"

# Get token
token_data = get_token(email, password)

if token_data:
    access_token = token_data.get("access")

    # Test the auth endpoint
    if access_token:
        test_auth_endpoint(access_token)
