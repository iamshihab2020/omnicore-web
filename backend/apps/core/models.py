from django.db import models
from apps.tenants.models import Tenant
import uuid


class BaseModel(models.Model):
    """
    Abstract base model that includes common fields for all models
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class TenantSetting(models.Model):
    """
    Settings specific to each tenant
    """
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='settings')
    currency = models.CharField(max_length=3, default='USD')
    default_tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    service_charge_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    working_hours_start = models.TimeField(null=True, blank=True)
    working_hours_end = models.TimeField(null=True, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    
    # POS Settings
    enable_table_management = models.BooleanField(default=True)
    enable_kitchen_display = models.BooleanField(default=True)
    enable_customer_display = models.BooleanField(default=False)
    enable_mobile_ordering = models.BooleanField(default=False)
    enable_online_payments = models.BooleanField(default=False)
    
    # Receipt Settings
    receipt_header = models.TextField(blank=True)
    receipt_footer = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Tenant Setting'
        verbose_name_plural = 'Tenant Settings'
    
    def __str__(self):
        return f"Settings for {self.tenant.name}"


class Table(models.Model):
    """
    Table model for restaurant seating
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='tables')
    name = models.CharField(max_length=50)  # Table number or name
    capacity = models.PositiveIntegerField(default=4)
    is_occupied = models.BooleanField(default=False)
    location = models.CharField(max_length=50, blank=True)  # e.g., 'indoor', 'outdoor', etc.
    
    # Status information
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'
        unique_together = ('tenant', 'name')
    
    def __str__(self):
        return f"Table {self.name} ({self.tenant.name})"


class Notification(models.Model):
    """
    Notification model for system notifications
    """
    NOTIFICATION_TYPES = (
        ('order', 'Order Notification'),
        ('payment', 'Payment Notification'),
        ('system', 'System Notification'),
        ('user', 'User Notification'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='system')
    is_read = models.BooleanField(default=False)
    reference_id = models.UUIDField(null=True, blank=True)  # Reference to related object (order ID, etc.)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
