# filepath: c:\Users\Victus\Documents\GitHub\omnicore-web\omnicore-backend\apps\management\table\admin.py.new
from django.contrib import admin
from .models import RestaurantTable


@admin.register(RestaurantTable)
class RestaurantTableAdmin(admin.ModelAdmin):
    """Admin configuration for Table model"""

    list_display = (
        "number",
        "name",
        "tenant",
        "capacity",
        "status",
        "area",
        "is_active",
    )
    list_filter = ("tenant", "status", "area", "is_active")
    search_fields = ("number", "name", "area", "notes")
    ordering = ("tenant", "number")
    readonly_fields = ("id", "created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("id", "tenant", "number", "name")}),
        ("Details", {"fields": ("capacity", "status", "area", "is_active")}),
        ("Additional Information", {"fields": ("notes",)}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
