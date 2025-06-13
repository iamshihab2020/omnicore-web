import requests
import json

# URL for login
url = "http://localhost:8000/api/auth/login/"

# Credentials
data = {"email": "tenant@example.com", "password": "password123"}

# Make the request
response = requests.post(url, json=data)

# Print the status code and response
print(f"Status Code: {response.status_code}")

# Try to parse the JSON response
try:
    response_data = response.json()
    print("\nResponse body:")
    print(json.dumps(response_data, indent=2))

    # If successful, save the token for further requests
    if response.status_code == 200:
        access_token = response_data.get("access")

        if access_token:
            print("\n=== Testing Counter API ===")
            counter_url = "http://localhost:8000/api/settings/counters/"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "X-Tenant-Slug": "example-restaurant",
                "Content-Type": "application/json",
            }

            counter_response = requests.get(counter_url, headers=headers)
            print(f"\nCounters API Status Code: {counter_response.status_code}")

            if counter_response.status_code == 200:
                counters = counter_response.json()
                print(f"\nFound {len(counters)} counters:")
                for counter in counters:
                    print(
                        f"- {counter.get('name')} ({counter.get('location')}): {counter.get('status')}"
                    )
            else:
                print("Failed to retrieve counters.")
                print(counter_response.text)
        else:
            print("No access token in the response.")
except ValueError:
    print("\nNon-JSON response:")
    print(response.text)
