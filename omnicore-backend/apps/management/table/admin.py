from django.contrib import admin
from .models import RestaurantTable


@admin.register(RestaurantTable)
class RestaurantTableAdmin(admin.ModelAdmin):
    list_display = (
        "number",
        "name",
        "capacity",
        "status",
        "area",
        "is_active",
        "tenant",
    )
    list_filter = ("status", "is_active", "area", "tenant")
    search_fields = ("number", "name", "notes", "tenant__name")
    ordering = ("tenant", "number")
    readonly_fields = ("created_at", "updated_at")
