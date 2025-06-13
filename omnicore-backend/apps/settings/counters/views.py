from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Counter
from .serializers import CounterSerializer
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
    The tenant is determined from the authenticated user and X-Tenant-Slug header.
    """

    serializer_class = CounterSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        """
        Get counters for the current tenant
        """
        if hasattr(self.request, "tenant"):
            return Counter.objects.filter(tenant=self.request.tenant)
        return Counter.objects.none()

    def perform_create(self, serializer):
        """
        Create a new counter for the current tenant
        """
        if hasattr(self.request, "tenant"):
            serializer.save(tenant=self.request.tenant)
        else:
            raise ValueError("No active tenant found. Set X-Tenant-Slug header.")

    def create(self, request, *args, **kwargs):
        """
        Create a new counter with validation
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
