from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Counter
from .serializers import CounterSerializer
from apps.menu.models import MenuItem
from apps.core.permissions import IsTenantUser, IsTenantAdmin, IsTenantOwner


class CounterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant counters (selling points)

    - List: Get all counters for the current tenant
    - Create: Create a new counter for the current tenant
    - Retrieve: Get details of a specific counter
    - Update: Update a counter
    - Delete: Delete a counter

    Access requires an authenticated user with access to the tenant.
    The tenant is determined from the authenticated user and X-Tenant-Workspace header.
    """

    serializer_class = CounterSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        """
        Get counters for the current tenant
        """
        if hasattr(self.request, "tenant"):
            # Use select_related to prefetch tenant to optimize serialization
            # This helps when accessing the tenant's VAT taxes in the serializer
            return Counter.objects.filter(tenant=self.request.tenant).select_related(
                "tenant"
            )
        return Counter.objects.none()

    def perform_create(self, serializer):
        """
        Create a new counter for the current tenant
        """
        if hasattr(self.request, "tenant"):
            # Extract items data if present
            items_data = self.request.data.get("items", None)

            # Save the counter with tenant information
            counter = serializer.save(tenant=self.request.tenant)

            # No need to manually set items as the serializer handles this through items field
        else:
            raise ValueError("No active tenant found. Set X-Tenant-Workspace header.")

    def validate_items(self, items_data):
        """
        Validate that all menu items belong to the current tenant
        """
        if not items_data:
            return True

        if hasattr(self.request, "tenant"):
            # Get all item IDs - handle both objects and just IDs
            item_ids = [item.id if hasattr(item, "id") else item for item in items_data]

            # Count items belonging to the current tenant
            tenant_items_count = MenuItem.objects.filter(
                id__in=item_ids, tenant=self.request.tenant
            ).count()

            # If count doesn't match, some items don't belong to this tenant
            if tenant_items_count != len(item_ids):
                return False

        return True

    def create(self, request, *args, **kwargs):
        """
        Create a new counter with validation
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check for existing counter with the same name for this tenant
        counter_name = serializer.validated_data.get("name")
        if (
            hasattr(self.request, "tenant")
            and Counter.objects.filter(
                tenant=self.request.tenant, name=counter_name
            ).exists()
        ):
            return Response(
                {
                    "detail": f"Counter with name '{counter_name}' already exists for this tenant."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if menu items belong to the current tenant
        items_data = serializer.validated_data.get("items", [])
        if not self.validate_items(items_data):
            return Response(
                {"detail": "Some menu items do not belong to the current tenant."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        """
        Update a counter with validation for menu items
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Check if menu items belong to the current tenant
        items_data = serializer.validated_data.get("items", None)
        if items_data is not None and not self.validate_items(items_data):
            return Response(
                {"detail": "Some menu items do not belong to the current tenant."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
