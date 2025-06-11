from django.utils.deprecation import MiddlewareMixin
from django.urls import resolve
from django.conf import settings
from django.http import Http404

from apps.tenants.models import Tenant


class TenantMiddleware(MiddlewareMixin):
    """
    Middleware to identify the current tenant based on the request domain/subdomain or headers.
    """

    def process_request(self, request):
        """
        Process each request to identify and attach the tenant.

        This will try to identify the tenant based on:
        1. A tenant_id in the request headers
        2. A subdomain in the host header (for multi-tenant hosting)
        3. For API requests, it will check authorization header and get the tenant from the user
        """
        request.tenant = None

        # Skip tenant identification for admin and superadmin routes
        current_path = request.path_info
        if current_path.startswith("/admin/") or current_path.startswith(
            "/superadmin/"
        ):
            return None

        # Check for tenant_id in headers (useful for API calls from tenant frontend)
        tenant_id = request.headers.get("X-Tenant-ID")
        if tenant_id:
            try:
                request.tenant = Tenant.objects.get(id=tenant_id, is_active=True)
                return None
            except Tenant.DoesNotExist:
                pass

        # Check subdomain for tenant identification (for web access)
        host = request.get_host().split(":")[0]  # Remove port if present

        # Skip for localhost or direct IP access during development
        if host in ["localhost", "127.0.0.1"] and settings.DEBUG:
            return None

        # Extract subdomain
        parts = host.split(".")
        if len(parts) > 2:  # Has subdomain
            subdomain = parts[0]
            if subdomain not in ["www", "api"]:  # Skip common non-tenant subdomains
                try:
                    request.tenant = Tenant.objects.get(slug=subdomain, is_active=True)
                except Tenant.DoesNotExist:
                    pass

        # If still no tenant identified and user is authenticated, get from user
        if (
            not request.tenant
            and hasattr(request, "user")
            and request.user.is_authenticated
        ):
            if hasattr(request.user, "tenant"):
                request.tenant = request.user.tenant

        return None
