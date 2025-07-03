from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.tenants.models import Tenant
from apps.authentication.models import User
from .models import VatTax


class VatTaxTests(TestCase):
    """Tests for VAT tax API"""

    def setUp(self):
        # Create a tenant
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            workspace_slug="test-tenant",
        )

        # Create a user with access to the tenant
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123",
        )
        self.user.tenants.add(self.tenant)

        # Create test VAT taxes
        self.vat_tax = VatTax.objects.create(
            tenant=self.tenant,
            name="Standard VAT",
            rate=15.0,
            description="Standard VAT rate",
            is_active=True,
        )

        # Setup API client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        # Set tenant header
        self.client.defaults["HTTP_X_TENANT_WORKSPACE"] = self.tenant.workspace_slug

        # URL for vat tax
        self.vat_url = reverse("vat-tax-list")

    def test_list_vat_taxes(self):
        """Test retrieving VAT taxes"""
        response = self.client.get(self.vat_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Standard VAT")

    def test_create_vat_tax(self):
        """Test creating a VAT tax"""
        payload = {
            "name": "Reduced VAT",
            "rate": 5.0,
            "description": "Reduced VAT rate for essential goods",
            "is_active": True,
        }
        response = self.client.post(self.vat_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], payload["name"])

        # Check it was saved to the database
        vat_exists = VatTax.objects.filter(
            tenant=self.tenant, name=payload["name"]
        ).exists()
        self.assertTrue(vat_exists)
