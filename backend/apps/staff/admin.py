from django.contrib import admin
from .models import StaffProfile

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'email', 'tenant', 'is_active', 'created_at')
    list_filter = ('position', 'is_active', 'tenant')
    search_fields = ('name', 'email', 'phone_number', 'tenant__name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('id', 'tenant')
        }),
        ('Basic Information', {
            'fields': ('name', 'position', 'email', 'phone_number')
        }),
        ('Additional Information', {
            'fields': ('address', 'gender', 'profile_photo')
        }),
        ('System', {
            'fields': ('user', 'is_active', 'created_at', 'updated_at')
        }),
    )
