from django.db import models
import uuid
from apps.tenants.models import Tenant


class VatTax(models.Model):
    """
    Model for storing VAT tax details.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="vat_taxes"
    )
    name = models.CharField(max_length=100, help_text="Name of the tax")
    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Tax rate as percentage (e.g., 15.00 for 15%)",
    )
    description = models.TextField(
        null=True, blank=True, help_text="Optional description of the tax"
    )
    is_active = models.BooleanField(
        default=True, help_text="Whether this tax is currently active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "VAT Tax"
        verbose_name_plural = "VAT Taxes"

    def __str__(self):
        return f"{self.name} ({self.rate}%)"
