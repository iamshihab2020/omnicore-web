from django.contrib import admin
from .models import VatTax


@admin.register(VatTax)
class VatTaxAdmin(admin.ModelAdmin):
    list_display = ("name", "rate", "is_active", "tenant", "created_at", "updated_at")
    list_filter = ("is_active", "tenant")
    search_fields = ("name", "description")
    readonly_fields = ("id", "created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("name", "rate", "description", "is_active")}),
        ("Tenant Information", {"fields": ("tenant",)}),
        (
            "Metadata",
            {"fields": ("id", "created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )
