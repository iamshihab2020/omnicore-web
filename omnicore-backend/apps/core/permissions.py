from rest_framework import permissions
from apps.tenants.models import TenantUser


class IsTenantOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a tenant to access/modify it.
    """
    def has_permission(self, request, view):
        tenant_id = view.kwargs.get('tenant_id')
        if not tenant_id:
            return False
        
        return TenantUser.objects.filter(
            tenant_id=tenant_id,
            user=request.user,
            role='owner',
            is_active=True
        ).exists()


class IsTenantAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins and owners of a tenant to access/modify it.
    """
    def has_permission(self, request, view):
        tenant_id = view.kwargs.get('tenant_id')
        if not tenant_id:
            return False
        
        return TenantUser.objects.filter(
            tenant_id=tenant_id,
            user=request.user,
            role__in=['owner', 'admin'],
            is_active=True
        ).exists()


class IsTenantManager(permissions.BasePermission):
    """
    Custom permission for tenant managers (including admins and owners).
    """
    def has_permission(self, request, view):
        tenant_id = view.kwargs.get('tenant_id')
        if not tenant_id:
            return False
        
        return TenantUser.objects.filter(
            tenant_id=tenant_id,
            user=request.user,
            role__in=['owner', 'admin', 'manager'],
            is_active=True
        ).exists()


class IsTenantUser(permissions.BasePermission):
    """
    Custom permission to only allow users that belong to a specific tenant.
    """
    def has_permission(self, request, view):
        tenant_id = view.kwargs.get('tenant_id')
        if not tenant_id:
            return False
        
        return TenantUser.objects.filter(
            tenant_id=tenant_id,
            user=request.user,
            is_active=True
        ).exists()
