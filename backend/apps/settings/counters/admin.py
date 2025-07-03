from django.contrib import admin
from .models import Counter


@admin.register(Counter)
class CounterAdmin(admin.ModelAdmin):
    list_display = ["name", "tenant", "status", "location", "created_at", "updated_at"]
    list_filter = ["status", "tenant"]
    search_fields = ["name", "description", "location"]
    readonly_fields = ["id", "created_at", "updated_at"]
