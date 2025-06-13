import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omnicore_backend.settings")
django.setup()

from apps.tenants.models import Tenant
from apps.settings.counters.models import Counter


def create_counter():
    # Get the tenant
    tenant_slug = "example-restaurant"
    try:
        tenant = Tenant.objects.get(slug=tenant_slug)
    except Tenant.DoesNotExist:
        print(f"Tenant with slug '{tenant_slug}' does not exist.")
        return

    # Create sample counters
    counters = [
        {
            "name": "Main Counter",
            "description": "Main selling point at the entrance",
            "location": "Front Entrance",
            "status": "active",
        },
        {
            "name": "Bar Counter",
            "description": "Counter for beverages and drinks",
            "location": "Bar Area",
            "status": "active",
        },
        {
            "name": "Takeaway Counter",
            "description": "Counter for takeaway orders",
            "location": "Side Entrance",
            "status": "active",
        },
    ]

    for counter_data in counters:
        counter, created = Counter.objects.get_or_create(
            tenant=tenant,
            name=counter_data["name"],
            defaults={
                "description": counter_data["description"],
                "location": counter_data["location"],
                "status": counter_data["status"],
            },
        )

        if created:
            print(f"Counter created: {counter.name}")
        else:
            print(f"Counter already exists: {counter.name}")

    # List all counters for this tenant
    print("\nAll counters for tenant:", tenant.name)
    all_counters = Counter.objects.filter(tenant=tenant)
    for counter in all_counters:
        print(f"- {counter.name} ({counter.location}): {counter.status}")


if __name__ == "__main__":
    create_counter()
