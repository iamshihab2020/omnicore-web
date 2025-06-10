from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """
    Permission class to check if the user is a super admin.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "SUPER_ADMIN"


class IsTenant(permissions.BasePermission):
    """
    Permission class to check if the user is a tenant.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "TENANT"


class IsOwnerOrSuperAdmin(permissions.BasePermission):
    """
    Permission to check if a user is the owner of an object or a super admin
    """

    def has_object_permission(self, request, view, obj):
        # Allow super admins to access any object
        if request.user.role == "SUPER_ADMIN":
            return True

        # Check if the object has a tenant field and the request user is that tenant
        if hasattr(obj, "tenant") and obj.tenant == request.user.tenant:
            return True

        # Check if the object has a user field and the request user is that user
        if hasattr(obj, "user") and obj.user == request.user:
            return True

        return False
