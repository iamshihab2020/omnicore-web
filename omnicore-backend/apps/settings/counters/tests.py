from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from apps.tenants.models import Tenant, TenantUser
from apps.authentication.models import User
from .models import Counter


class CounterModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com", password="password123"
        )
        self.tenant = Tenant.objects.create(
            name="Test Restaurant",
            slug="test-restaurant",
            owner=self.user,
            address="123 Test St",
            phone="1234567890",
        )
        TenantUser.objects.create(tenant=self.tenant, user=self.user, is_owner=True)

    def test_create_counter(self):
        counter = Counter.objects.create(
            tenant=self.tenant,
            name="Test Counter",
            description="Test Description",
            location="Test Location",
        )

        self.assertEqual(counter.name, "Test Counter")
        self.assertEqual(counter.description, "Test Description")
        self.assertEqual(counter.location, "Test Location")
        self.assertEqual(counter.status, "active")  # Default value
        self.assertEqual(counter.tenant, self.tenant)


class CounterAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com", password="password123"
        )
        self.tenant = Tenant.objects.create(
            name="Test Restaurant",
            slug="test-restaurant",
            owner=self.user,
            address="123 Test St",
            phone="1234567890",
        )
        TenantUser.objects.create(tenant=self.tenant, user=self.user, is_owner=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.credentials(HTTP_X_TENANT_WORKSPACE="test-restaurant")

    def test_list_counters(self):
        # Create test counters
        Counter.objects.create(
            tenant=self.tenant,
            name="Counter 1",
            location="Location 1",
        )
        Counter.objects.create(
            tenant=self.tenant,
            name="Counter 2",
            location="Location 2",
        )

        # Test API endpoint
        response = self.client.get("/api/settings/counters/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_counter(self):
        data = {
            "name": "New Counter",
            "description": "New Description",
            "location": "New Location",
            "status": "active",
        }

        response = self.client.post("/api/settings/counters/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Counter.objects.count(), 1)
        self.assertEqual(Counter.objects.first().name, "New Counter")

    def test_update_counter(self):
        counter = Counter.objects.create(
            tenant=self.tenant,
            name="Original Counter",
            location="Original Location",
        )

        data = {
            "name": "Updated Counter",
            "description": "Updated Description",
            "location": "Updated Location",
            "status": "inactive",
        }

        response = self.client.put(f"/api/settings/counters/{counter.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        counter.refresh_from_db()
        self.assertEqual(counter.name, "Updated Counter")
        self.assertEqual(counter.status, "inactive")

    def test_delete_counter(self):
        counter = Counter.objects.create(
            tenant=self.tenant,
            name="Test Counter",
            location="Test Location",
        )

        response = self.client.delete(f"/api/settings/counters/{counter.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Counter.objects.count(), 0)
