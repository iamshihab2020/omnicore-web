from django.db import models
from apps.tenants.models import Tenant
from apps.menu.models import MenuItem
import uuid


class Counter(models.Model):
    """Counter model for restaurant selling points"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="counters"
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    items = models.ManyToManyField(MenuItem, related_name="counters", blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Counter"
        verbose_name_plural = "Counters"
        ordering = ["name"]
        unique_together = ["tenant", "name"]

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"
