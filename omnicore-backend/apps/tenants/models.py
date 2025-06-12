from django.db import models
from django.conf import settings
import uuid


class Tenant(models.Model):
    """
    Tenant model for multi-tenant application
    Each tenant represents a separate restaurant/business
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    domain = models.CharField(max_length=100, unique=True, null=True, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='owned_tenants'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Business information
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    tax_id = models.CharField(max_length=50, blank=True)
    
    # Branding
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#ffffff', blank=True)  # Hex color code
    secondary_color = models.CharField(max_length=7, default='#000000', blank=True)  # Hex color code
    
    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'
    
    def __str__(self):
        return self.name


class TenantUser(models.Model):
    """
    Many-to-Many relationship between Tenants and Users
    With additional fields like role
    """
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('staff', 'Staff'),
        ('cashier', 'Cashier'),
        ('kitchen', 'Kitchen'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='tenant_users')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_tenants')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Tenant User'
        verbose_name_plural = 'Tenant Users'
        unique_together = ('tenant', 'user')
    
    def __str__(self):
        return f"{self.user} - {self.tenant} ({self.role})"
