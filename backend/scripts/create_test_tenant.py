import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omnicore_backend.settings")
django.setup()

from apps.authentication.models import User
from apps.tenants.models import Tenant, TenantUser


def create_user_and_tenant():
    # Check if user exists
    email = "tenant@example.com"
    password = "password123"

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "is_active": True,
            "is_staff": False,
        },
    )

    if created:
        user.set_password(password)
        user.save()
        print(f"User created with email: {email}")
    else:
        print(f"User already exists with email: {email}")

    # Create tenant if it doesn't exist
    tenant_name = "Example Restaurant"
    tenant_slug = "example-restaurant"

    tenant, t_created = Tenant.objects.get_or_create(
        slug=tenant_slug,
        defaults={
            "name": tenant_name,
            "owner": user,
            "address": "123 Example St",
            "phone": "1234567890",
            "email": email,
            "is_active": True,
        },
    )

    if t_created:
        print(f"Tenant created: {tenant_name} (slug: {tenant_slug})")
    else:
        print(f"Tenant already exists: {tenant_name} (slug: {tenant_slug})")
    # Ensure user is associated with tenant
    tenant_user, tu_created = TenantUser.objects.get_or_create(
        tenant=tenant,
        user=user,
        defaults={
            "role": "owner",
        },
    )

    if tu_created:
        print(f"User {email} associated with tenant {tenant_name}")
    else:
        print(f"User {email} already associated with tenant {tenant_name}")

    print("\nLogin Credentials:")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"Tenant Slug: {tenant_slug}")


if __name__ == "__main__":
    create_user_and_tenant()
