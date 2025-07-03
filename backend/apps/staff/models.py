from django.db import models
from apps.tenants.models import Tenant
from django.conf import settings
import uuid


class StaffProfile(models.Model):
    """
    Model to store staff profiles in a tenant context.
    Some staff profiles (manager, cashier) will have login capabilities,
    while others (waiter, chef) will only have profile information without login.
    """
    POSITION_CHOICES = (
        ('manager', 'Manager'),
        ('cashier', 'Cashier'),
        ('waiter', 'Waiter'),
        ('chef', 'Chef'),
    )
    
    # Login-enabled roles (require user account)
    LOGIN_ENABLED_POSITIONS = ['manager', 'cashier']
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='staff_profiles')
    
    # Basic information
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=20, choices=POSITION_CHOICES)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    
    # Optional fields
    address = models.TextField(blank=True)
    gender = models.CharField(max_length=10, blank=True)
    profile_photo = models.ImageField(upload_to='staff_photos/', null=True, blank=True)
    
    # For login-enabled positions, link to User model
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='staff_profile'
    )
    
    # Timestamps and status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Staff Profile'
        verbose_name_plural = 'Staff Profiles'
        unique_together = ('tenant', 'email')
    
    def __str__(self):
        return f"{self.name} - {self.get_position_display()} at {self.tenant.name}"
    
    @property
    def requires_login(self):
        """Check if the staff position requires login capabilities"""
        return self.position in self.LOGIN_ENABLED_POSITIONS
