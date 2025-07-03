from rest_framework import permissions
from apps.tenants.models import TenantUser


class HasActiveTenant(permissions.BasePermission):
    """
    Base permission that checks if the request has an active tenant
    """

    def has_permission(self, request, view):
        return hasattr(request, "tenant") and request.tenant is not None


class IsTenantOwner(HasActiveTenant):
    """
    Custom permission to only allow owners of a tenant to access/modify it.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        return TenantUser.objects.filter(
            tenant=request.tenant, user=request.user, role="owner", is_active=True
        ).exists()


class IsTenantAdmin(HasActiveTenant):
    """
    Custom permission to only allow admins and owners of a tenant to access/modify it.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        return TenantUser.objects.filter(
            tenant=request.tenant,
            user=request.user,
            role__in=["owner", "admin"],
            is_active=True,
        ).exists()


class IsTenantManager(HasActiveTenant):
    """
    Custom permission for tenant managers (including admins and owners).
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        return TenantUser.objects.filter(
            tenant=request.tenant,
            user=request.user,
            role__in=["owner", "admin", "manager"],
            is_active=True,
        ).exists()


class IsTenantUser(HasActiveTenant):
    """
    Custom permission to only allow users that belong to a specific tenant.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        return TenantUser.objects.filter(
            tenant=request.tenant, user=request.user, is_active=True
        ).exists()
