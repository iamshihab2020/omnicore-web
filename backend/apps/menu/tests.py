from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.test import force_authenticate
from apps.tenants.models import Tenant, TenantUser
from apps.menu.models import Category, MenuItem
from apps.menu.views import MenuItemViewSet
from apps.core.middleware import TenantMiddleware

User = get_user_model()


class MenuItemViewSetTestCase(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )

        # Create test tenants
        self.tenant1 = Tenant.objects.create(
            name="Test Restaurant 1", slug="test-restaurant-1", owner=self.user
        )

        self.tenant2 = Tenant.objects.create(
            name="Test Restaurant 2", slug="test-restaurant-2", owner=self.user
        )

        # Add user to tenants
        TenantUser.objects.create(tenant=self.tenant1, user=self.user, role="owner")

        TenantUser.objects.create(tenant=self.tenant2, user=self.user, role="owner")

        # Create categories
        self.category1 = Category.objects.create(
            tenant=self.tenant1,
            name="Category 1 for Tenant 1",
            description="Test Category 1",
        )

        self.category2 = Category.objects.create(
            tenant=self.tenant2,
            name="Category 1 for Tenant 2",
            description="Test Category 2",
        )

        # Create menu items
        self.menu_item1 = MenuItem.objects.create(
            tenant=self.tenant1,
            category=self.category1,
            name="Menu Item 1",
            price=10.99,
            cost=5.00,
        )

        self.menu_item2 = MenuItem.objects.create(
            tenant=self.tenant2,
            category=self.category2,
            name="Menu Item 2",
            price=12.99,
            cost=6.00,
        )

        # Set up request factory and API client
        self.factory = RequestFactory()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_menu_item_list_with_tenant_slug(self):
        """Test that menu items are filtered by tenant slug"""
        # Test tenant 1
        response = self.client.get(
            "/api/menu/items/", HTTP_X_TENANT_WORKSPACE=self.tenant1.slug
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Menu Item 1")

        # Test tenant 2
        response = self.client.get(
            "/api/menu/items/", HTTP_X_TENANT_WORKSPACE=self.tenant2.slug
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Menu Item 2")

    def test_menu_item_create_with_tenant_slug(self):
        """Test creating menu item with tenant slug"""
        # Create item in tenant 1
        response = self.client.post(
            "/api/menu/items/",
            {
                "name": "New Menu Item",
                "price": 14.99,
                "cost": 7.50,
                "category": str(self.category1.id),
            },
            HTTP_X_TENANT_WORKSPACE=self.tenant1.slug,
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        # Verify it belongs to tenant 1
        new_item_id = response.json()["data"]["id"]
        item = MenuItem.objects.get(id=new_item_id)
        self.assertEqual(item.tenant, self.tenant1)

        # Verify it's accessible via tenant 1's context
        response = self.client.get(
            f"/api/menu/items/{new_item_id}/", HTTP_X_TENANT_WORKSPACE=self.tenant1.slug
        )
        self.assertEqual(response.status_code, 200)

        # Verify it's NOT accessible via tenant 2's context
        response = self.client.get(
            f"/api/menu/items/{new_item_id}/", HTTP_X_TENANT_WORKSPACE=self.tenant2.slug
        )
        self.assertEqual(response.status_code, 404)
