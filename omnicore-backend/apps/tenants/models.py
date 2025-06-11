from django.db import models
from core.models.abstract_models import TimeStampedModel, SoftDeleteModel


class Tenant(TimeStampedModel, SoftDeleteModel):
    """
    Model representing a tenant (restaurant) in the system.
    """

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to="tenants/logos/", blank=True, null=True)

    # Subscription/billing fields
    subscription_plan = models.CharField(
        max_length=20,
        choices=[
            ("FREE", "Free"),
            ("BASIC", "Basic"),
            ("PRO", "Professional"),
            ("ENTERPRISE", "Enterprise"),
        ],
        default="FREE",
    )
    subscription_start_date = models.DateField(null=True, blank=True)
    subscription_end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name
