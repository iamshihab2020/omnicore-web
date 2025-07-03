from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.tenants.models import Tenant, TenantUser
from .models import RestaurantTable
from .views import RestaurantTableViewSet

User = get_user_model()


class RestaurantTableViewSetTestCase(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )

        # Create test tenant
        self.tenant = Tenant.objects.create(
            name="Test Restaurant", slug="test-restaurant", owner=self.user
        )

        # Add user to tenant
        TenantUser.objects.create(tenant=self.tenant, user=self.user, role="owner")

        # Create test restaurant table
        self.table = RestaurantTable.objects.create(
            tenant=self.tenant,
            number="T1",
            name="Window Table",
            capacity=4,
            status="available",
            area="Main Hall",
        )

        # Set up request factory and API client
        self.factory = RequestFactory()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_table_list(self):
        """Test listing restaurant tables"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            "/api/management/table/", HTTP_X_TENANT_WORKSPACE=self.tenant.slug
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)

    def test_table_create(self):
        """Test creating a restaurant table"""
        self.client.force_authenticate(user=self.user)
        data = {
            "number": "T2",
            "name": "Corner Table",
            "capacity": 2,
            "status": "available",
            "area": "Bar Area",
            "is_active": True,
        }
        response = self.client.post(
            "/api/management/table/",
            data,
            format="json",
            HTTP_X_TENANT_WORKSPACE=self.tenant.slug,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["message"], "Table created successfully")
