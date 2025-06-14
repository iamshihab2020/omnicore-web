from django.db import models
from apps.tenants.models import Tenant
import uuid


class RestaurantTable(models.Model):
    """Restaurant table model for seating management"""

    STATUS_CHOICES = [
        ("available", "Available"),
        ("occupied", "Occupied"),
        ("reserved", "Reserved"),
        ("inactive", "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="restaurant_tables"
    )
    number = models.CharField(max_length=20)
    name = models.CharField(max_length=100, blank=True)
    capacity = models.IntegerField(default=4)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="available"
    )
    area = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Restaurant Table"
        verbose_name_plural = "Restaurant Tables"
        ordering = ["number"]
        unique_together = ("tenant", "number")

    def __str__(self):
        return f"Table {self.number} - {self.name} ({self.tenant.name})"
