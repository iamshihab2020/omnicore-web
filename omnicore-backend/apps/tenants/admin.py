from django.contrib import admin
from .models import Tenant, TenantUser

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'owner', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug', 'owner__email')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(TenantUser)
class TenantUserAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'user', 'role', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('tenant__name', 'user__email')
