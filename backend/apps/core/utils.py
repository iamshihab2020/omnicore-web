from django.conf import settings
from apps.tenants.models import Tenant, TenantUser


class TenantContextManager:
    """
    Utility class to help manage tenant context in views, services, and other components.
    This provides helper methods for common tenant operations.
    """

    @staticmethod
    def get_active_tenant_for_user(user, tenant_slug=None):
        """
        Get the active tenant for a user based on the slug
        If tenant_slug is not provided, returns the first active tenant for the user

        Args:
            user: The user to get the tenant for
            tenant_slug: Optional tenant slug to filter by

        Returns:
            Tenant object or None if not found
        """
        if not user or not user.is_authenticated:
            return None

        tenant_users = TenantUser.objects.filter(user=user, is_active=True)

        # If no active tenants, return None
        if not tenant_users.exists():
            return None

        # If slug provided, try to get that tenant
        if tenant_slug:
            try:
                tenant_user = tenant_users.get(tenant__slug=tenant_slug)
                return tenant_user.tenant
            except TenantUser.DoesNotExist:
                return None

        # Otherwise return the first active tenant
        return tenant_users.first().tenant

    @staticmethod
    def get_user_role_in_tenant(user, tenant):
        """
        Get the user's role in a specific tenant

        Args:
            user: The user to check
            tenant: The tenant to check

        Returns:
            Role string or None if user is not in the tenant
        """
        if not user or not tenant:
            return None

        try:
            tenant_user = TenantUser.objects.get(
                user=user, tenant=tenant, is_active=True
            )
            return tenant_user.role
        except TenantUser.DoesNotExist:
            return None

    @staticmethod
    def is_user_in_tenant_role(user, tenant, roles):
        """
        Check if a user has one of the specified roles in a tenant

        Args:
            user: The user to check
            tenant: The tenant to check
            roles: List of roles to check for

        Returns:
            Boolean indicating if user has any of the roles
        """
        if not user or not tenant or not roles:
            return False

        try:
            tenant_user = TenantUser.objects.get(
                user=user, tenant=tenant, is_active=True
            )
            return tenant_user.role in roles
        except TenantUser.DoesNotExist:
            return False

    @staticmethod
    def filter_queryset_by_tenant(queryset, tenant):
        """
        Filter a queryset by tenant

        Args:
            queryset: The queryset to filter
            tenant: The tenant to filter by

        Returns:
            Filtered queryset
        """
        if tenant:
            return queryset.filter(tenant=tenant)
        return queryset.none()
