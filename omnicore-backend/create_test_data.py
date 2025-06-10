from tenants_app.models import Tenant
from apps.users.models import User
from django.utils.text import slugify
from django.db import transaction

# Create a tenant
try:
    with transaction.atomic():
        # Create tenant
        tenant = Tenant.objects.create(
            name="Demo Restaurant",
            slug=slugify("Demo Restaurant"),
            description="Demo restaurant for testing",
            subscription_plan="PRO",
        )
        print(f"Created tenant: {tenant.name}")

        # Create a super admin user
        super_admin = User.objects.create_superuser(
            email="admin@omnicore.com",
            password="Admin@123!",
            first_name="Super",
            last_name="Admin",
            role="SUPER_ADMIN",
        )
        print(f"Created super admin: {super_admin.email}")

        # Create a tenant owner
        tenant_owner = User.objects.create_user(
            email="owner@restaurant.com",
            password="Owner@123!",
            first_name="Restaurant",
            last_name="Owner",
            role="TENANT",
            tenant=tenant,
        )
        print(f"Created tenant owner: {tenant_owner.email}")
except Exception as e:
    print(f"Error creating users: {str(e)}")

# Print all users for verification
print("\nAll Users:")
for user in User.objects.all():
    print(f"- {user.email} (Role: {user.role}, Tenant: {user.tenant})")
