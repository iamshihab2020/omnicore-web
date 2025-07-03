from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponseForbidden
from apps.tenants.models import Tenant, TenantUser
from django.contrib.auth import get_user_model
from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()


class TenantMiddleware(MiddlewareMixin):
    """
    Middleware to set tenant on request based on authenticated user
    It will:
    1. For authenticated users, find their active tenants
    2. For routes requiring a specific tenant, verify access permissions
    """

    def _get_user_from_jwt(self, request):
        """Get user from JWT token in Authorization header"""
        if "HTTP_AUTHORIZATION" not in request.META:
            print("TenantMiddleware: No HTTP_AUTHORIZATION in request.META")
            return None

        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            print("TenantMiddleware: Authorization header does not start with Bearer")
            return None

        jwt_auth = JWTAuthentication()
        try:
            raw_token = auth_header.replace("Bearer ", "")
            print(f"TenantMiddleware: Raw token (first 20 chars): {raw_token[:20]}...")

            # Get raw token correctly from the auth header
            token = raw_token
            token_bytes = token.encode() if isinstance(token, str) else token

            # Validate token
            validated_token = jwt_auth.get_validated_token(token_bytes)
            print(f"TenantMiddleware: Token validated successfully")

            # Get user from token
            user = jwt_auth.get_user(validated_token)
            if user:
                print(
                    f"TenantMiddleware: Found user from JWT: {user.email} (ID: {user.id})"
                )
                return user
            else:
                print("TenantMiddleware: Could not get user from validated token")
                return None

        except Exception as e:
            print(f"TenantMiddleware: JWT Authentication error: {e}")
            return None

    def process_request(self, request):
        print("TenantMiddleware: Processing request", request.path)
        # Skip for admin and authentication endpoints
        if request.path.startswith("/admin/") or request.path.startswith("/api/auth/"):
            print("TenantMiddleware: Skipping admin or auth endpoint")
            return None

        # Try to get user from JWT token if not already authenticated
        user = request.user
        if not hasattr(request, "user") or not user.is_authenticated:
            print("TenantMiddleware: User not authenticated via session, trying JWT")
            # Use DRF's built-in authentication with debug info
            auth_header = request.META.get("HTTP_AUTHORIZATION", "")
            if auth_header:
                print(
                    f"TenantMiddleware: Found Authorization header: {auth_header[:15]}..."
                )
                jwt_user = self._get_user_from_jwt(request)
                if jwt_user:
                    print(
                        f"TenantMiddleware: User authenticated via JWT: {jwt_user.email}"
                    )
                    # Important: Set the user on the request
                    request.user = jwt_user
                    user = jwt_user
                else:
                    print("TenantMiddleware: Failed to authenticate via JWT")
            else:
                print("TenantMiddleware: No Authorization header found")

        # Now check if the user is authenticated after JWT check
        if not hasattr(request, "user") or not request.user.is_authenticated:
            print("TenantMiddleware: User is not authenticated after JWT check")
            return None

        print(f"TenantMiddleware: User is authenticated: {request.user.email}")

        # Get the user's active tenants
        user_tenants = TenantUser.objects.filter(user=request.user, is_active=True)
        print(f"TenantMiddleware: User has {user_tenants.count()} active tenants")

        if not user_tenants.exists():
            # User has no tenants - set empty list
            request.user_tenants = []
            print("TenantMiddleware: User has no tenants")
            return None

        # Add the tenant queryset to the request
        request.user_tenants = user_tenants

        # If user has only one tenant, automatically set it as the active tenant
        if user_tenants.count() == 1:
            request.tenant = user_tenants.first().tenant
            print(f"TenantMiddleware: Auto-selected tenant: {request.tenant.name}")
            return None

        # If there are multiple tenants, check if one is selected via header
        tenant_slug = request.headers.get("X-Tenant-Slug")
        print(f"TenantMiddleware: X-Tenant-Slug header: {tenant_slug}")

        if tenant_slug:
            # Verify the user has access to this tenant
            try:
                tenant_user = user_tenants.get(tenant__slug=tenant_slug)
                request.tenant = tenant_user.tenant
                print(
                    f"TenantMiddleware: Selected tenant from slug: {request.tenant.name}"
                )
            except TenantUser.DoesNotExist:
                print(
                    f"TenantMiddleware: User does not have access to tenant slug: {tenant_slug}"
                )
                return HttpResponseForbidden("You don't have access to this tenant")
        else:
            # No specific tenant selected, but tenant-specific endpoint
            if not request.path.startswith("/api/common/"):
                print(
                    "TenantMiddleware: Tenant-specific endpoint but no tenant specified"
                )
                # For tenant-specific endpoints, we need a tenant to be selected
                return HttpResponseForbidden("Please specify a tenant for this request")

        return None
