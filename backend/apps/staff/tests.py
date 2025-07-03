from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.test import force_authenticate
from apps.tenants.models import Tenant, TenantUser
from apps.staff.models import StaffProfile
from apps.staff.views import StaffProfileViewSet
from apps.core.middleware import TenantMiddleware

User = get_user_model()


class StaffProfileViewSetTestCase(TestCase):
    """Test case for the staff management API endpoints"""

    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            email="testowner@example.com",
            password="testpass123",
            first_name="Test",
            last_name="Owner"
        )
        
        # Create test tenant
        self.tenant = Tenant.objects.create(
            name="Test Restaurant",
            slug="test-restaurant",
            owner=self.user
        )
        
        # Create tenant user relationship with owner role
        self.tenant_user = TenantUser.objects.create(
            tenant=self.tenant,
            user=self.user,
            role="owner",
            is_active=True
        )
        
        # Create a manager
        self.manager_user = User.objects.create_user(
            email="manager@example.com",
            password="testpass123",
            first_name="Test",
            last_name="Manager"
        )
        
        self.manager_tenant_user = TenantUser.objects.create(
            tenant=self.tenant,
            user=self.manager_user,
            role="manager",
            is_active=True
        )
        
        # Create staff profile with login
        self.cashier_staff = StaffProfile.objects.create(
            tenant=self.tenant,
            name="John Cashier",
            position="cashier",
            email="cashier@example.com",
            phone_number="1234567890",
        )
        
        # Create staff profile without login
        self.waiter_staff = StaffProfile.objects.create(
            tenant=self.tenant,
            name="Jane Waiter",
            position="waiter",
            email="waiter@example.com",
            phone_number="0987654321",
        )
        
        self.factory = RequestFactory()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.middleware = TenantMiddleware(get_response=lambda request: None)
    
    def test_list_staff_profiles(self):
        """Test listing staff profiles for a tenant"""
        request = self.factory.get('/api/staff/')
        request.user = self.user
        self.middleware.process_request(request)
        request.tenant = self.tenant
        
        view = StaffProfileViewSet.as_view({'get': 'list'})
        response = view(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
    
    def test_create_staff_waiter_without_password(self):
        """Test creating a waiter staff profile without password"""
        staff_data = {
            'name': 'New Waiter',
            'position': 'waiter',
            'email': 'newwaiter@example.com',
            'phone_number': '5555555555',
            'address': '123 Test St',
            'gender': 'Male'
        }
        
        request = self.factory.post('/api/staff/', staff_data)
        request.user = self.user
        self.middleware.process_request(request)
        request.tenant = self.tenant
        
        view = StaffProfileViewSet.as_view({'post': 'create'})
        response = view(request)
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['data']['name'], 'New Waiter')
        self.assertEqual(response.data['data']['position'], 'waiter')
    
    def test_create_cashier_with_password(self):
        """Test creating a cashier profile with password (creates user account)"""
        staff_data = {
            'name': 'New Cashier',
            'position': 'cashier',
            'email': 'newcashier@example.com',
            'phone_number': '5555555555',
            'password': 'SecureP@ss123'
        }
        
        request = self.factory.post('/api/staff/', staff_data)
        request.user = self.user
        self.middleware.process_request(request)
        request.tenant = self.tenant
        
        view = StaffProfileViewSet.as_view({'post': 'create'})
        response = view(request)
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['data']['name'], 'New Cashier')
        self.assertEqual(response.data['data']['position'], 'cashier')
        
        # Verify user was created
        self.assertTrue(User.objects.filter(email='newcashier@example.com').exists())
        
        # Verify tenant user relationship was created
        user = User.objects.get(email='newcashier@example.com')
        self.assertTrue(TenantUser.objects.filter(
            user=user,
            tenant=self.tenant,
            role='cashier'
        ).exists())
    
    def test_create_cashier_without_password_fails(self):
        """Test creating a cashier profile without password fails"""
        staff_data = {
            'name': 'Failed Cashier',
            'position': 'cashier',
            'email': 'failedcashier@example.com',
            'phone_number': '5555555555'
        }
        
        request = self.factory.post('/api/staff/', staff_data)
        request.user = self.user
        self.middleware.process_request(request)
        request.tenant = self.tenant
        
        view = StaffProfileViewSet.as_view({'post': 'create'})
        response = view(request)
        
        self.assertEqual(response.status_code, 400)
    
    def test_create_waiter_with_password_fails(self):
        """Test creating a waiter profile with password fails"""
        staff_data = {
            'name': 'Failed Waiter',
            'position': 'waiter',
            'email': 'failedwaiter@example.com',
            'phone_number': '5555555555',
            'password': 'AnyPassword123'
        }
        
        request = self.factory.post('/api/staff/', staff_data)
        request.user = self.user
        self.middleware.process_request(request)
        request.tenant = self.tenant
        
        view = StaffProfileViewSet.as_view({'post': 'create'})
        response = view(request)
        
        self.assertEqual(response.status_code, 400)
