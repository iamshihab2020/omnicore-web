from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Category, MenuItem
from .serializers import CategorySerializer, MenuItemSerializer
from apps.core.permissions import IsTenantUser, IsTenantAdmin, IsTenantOwner
from apps.tenants.models import TenantUser


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing menu categories

    - List: Get all categories for the current tenant
    - Create: Create a new category for the current tenant
    - Retrieve: Get details of a specific category
    - Update: Update a category
    - Delete: Delete a category

    Access requires an authenticated user with access to the tenant.
    The tenant is determined from the authenticated user and X-Tenant-Slug header.
    """

    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        """
        Get categories for the current tenant
        """
        if hasattr(self.request, "tenant"):
            return Category.objects.filter(tenant=self.request.tenant)
        return Category.objects.none()

    def perform_create(self, serializer):
        """
        Create a new category for the current tenant
        """
        if hasattr(self.request, "tenant"):
            serializer.save(tenant=self.request.tenant)
        else:
            raise ValueError("No active tenant found. Set X-Tenant-Slug header.")

    def create(self, request, *args, **kwargs):
        """
        Create a new category with validation
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Category created successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def update(self, request, *args, **kwargs):
        """
        Update a category
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {"message": "Category updated successfully", "data": serializer.data}
        )


class MenuItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing menu items

    - List: Get all menu items for the current tenant
    - Create: Create a new menu item for the current tenant
    - Retrieve: Get details of a specific menu item
    - Update: Update a menu item
    - Delete: Delete a menu item

    Access requires an authenticated user with access to the tenant.
    The tenant is determined from the authenticated user and X-Tenant-Slug header.
    """

    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantUser]

    def initial(self, request, *args, **kwargs):
        """
        Runs anything that needs to occur prior to calling the method handler.
        We override this to add debugging info for permissions.
        """
        super().initial(request, *args, **kwargs)

        # Debug information
        print(f"DEBUG - User authenticated: {request.user.is_authenticated}")
        print(f"DEBUG - User: {request.user}")
        print(f"DEBUG - Tenant header: {request.headers.get('X-Tenant-Slug')}")
        print(f"DEBUG - Request tenant: {getattr(request, 'tenant', None)}")

        if hasattr(request, "tenant"):
            has_tenant_access = TenantUser.objects.filter(
                tenant=request.tenant, user=request.user, is_active=True
            ).exists()
            print(f"DEBUG - Has tenant access: {has_tenant_access}")
        else:
            print("DEBUG - No tenant set on request")

    def get_queryset(self):
        """
        Get menu items for the current tenant
        Filter by category if specified in query params
        """
        if not hasattr(self.request, "tenant"):
            return MenuItem.objects.none()

        queryset = MenuItem.objects.filter(tenant=self.request.tenant)

        # Filter by category if specified in query params
        category_id = self.request.query_params.get("category")
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # Filter by active status if specified
        is_active = self.request.query_params.get("is_active")
        if is_active:
            is_active = is_active.lower() == "true"
            queryset = queryset.filter(is_active=is_active)

        return queryset

    def perform_create(self, serializer):
        """
        Create a new menu item for the current tenant
        """
        if hasattr(self.request, "tenant"):
            serializer.save(tenant=self.request.tenant)
        else:
            raise ValueError("No active tenant found. Set X-Tenant-Slug header.")

    def create(self, request, *args, **kwargs):
        """
        Create a new menu item with validation
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Menu item created successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def update(self, request, *args, **kwargs):
        """
        Update a menu item
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {"message": "Menu item updated successfully", "data": serializer.data}
        )
