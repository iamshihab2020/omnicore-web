from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
from .models import RestaurantTable
from .serializers import RestaurantTableSerializer
from apps.core.permissions import IsTenantUser, IsTenantAdmin, IsTenantOwner


class RestaurantTableViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant tables

    - List: Get all tables for the current tenant
    - Create: Create a new table for the current tenant
    - Retrieve: Get details of a specific table
    - Update: Update a table
    - Delete: Delete a table

    Access requires an authenticated user with access to the tenant.
    The tenant is determined from the authenticated user and X-Tenant-Workspace header.
    """

    serializer_class = RestaurantTableSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        """
        Get tables for the current tenant
        Filter by status or area if specified in query params
        """
        if not hasattr(self.request, "tenant"):
            return RestaurantTable.objects.none()

        queryset = RestaurantTable.objects.filter(tenant=self.request.tenant)

        # Filter by status if specified in query params
        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(status=status)

        # Filter by area if specified in query params
        area = self.request.query_params.get("area")
        if area:
            queryset = queryset.filter(area=area)

        return queryset

    def perform_create(self, serializer):
        """
        Create a new table for the current tenant
        """
        if hasattr(self.request, "tenant"):
            serializer.save(tenant=self.request.tenant)
        else:
            raise ValueError("No active tenant found. Set X-Tenant-Workspace header.")

    def create(self, request, *args, **kwargs):
        """
        Create a new table with validation
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Table created successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def update(self, request, *args, **kwargs):
        """
        Update a table
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {"message": "Table updated successfully", "data": serializer.data}
        )

    def list(self, request, *args, **kwargs):
        """
        List all tables with optional counts
        """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # Check if we should include counts
        include_counts = (
            request.query_params.get("include_counts", "").lower() == "true"
        )

        if include_counts and hasattr(request, "tenant"):
            # Get counts by status
            counts = {}
            counts["total"] = queryset.count()

            status_counts = (
                RestaurantTable.objects.filter(tenant=request.tenant)
                .values("status")
                .annotate(count=Count("status"))
            )

            for status_count in status_counts:
                counts[status_count["status"]] = status_count["count"]

            # Add default values for statuses that have no tables
            for status in ["available", "occupied", "reserved", "inactive"]:
                if status not in counts:
                    counts[status] = 0

            return Response({"data": serializer.data, "counts": counts})

        return Response({"data": serializer.data})

    def destroy(self, request, *args, **kwargs):
        """
        Delete a table
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Table deleted successfully"}, status=status.HTTP_200_OK
        )
