# filepath: c:\Users\Victus\Documents\GitHub\omnicore-web\omnicore-backend\apps\management\table\views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import RestaurantTable
from .serializers import TableSerializer
from apps.core.permissions import IsTenantUser, IsTenantAdmin, IsTenantOwner


class TableViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant tables

    - List: Get all tables for the current tenant
    - Create: Create a new table for the current tenant
    - Retrieve: Get details of a specific table
    - Update: Update a table
    - Delete: Delete a table

    Access requires an authenticated user with access to the tenant.
    The tenant is determined from the authenticated user and X-Tenant-Slug header.
    """

    serializer_class = TableSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        """
        Get tables for the current tenant
        Filter by various parameters if specified in query params
        """
        if hasattr(self.request, "tenant"):
            queryset = RestaurantTable.objects.filter(tenant=self.request.tenant)
            
            # Filter by status if specified
            status = self.request.query_params.get("status")
            if status:
                queryset = queryset.filter(status=status)
            
            # Filter by active status
            is_active = self.request.query_params.get("is_active")
            if is_active is not None:
                is_active = is_active.lower() == "true"
                queryset = queryset.filter(is_active=is_active)
            
            # Filter by area
            area = self.request.query_params.get("area")
            if area:
                queryset = queryset.filter(area=area)
                
            return queryset
        return RestaurantTable.objects.none()

    def perform_create(self, serializer):
        """
        Create a new table for the current tenant
        """
        if hasattr(self.request, "tenant"):
            serializer.save(tenant=self.request.tenant)
        else:
            raise ValueError("No active tenant found. Set X-Tenant-Slug header.")

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

    def destroy(self, request, *args, **kwargs):
        """
        Delete a table
        """
        instance = self.get_object()
        instance_id = instance.id
        instance_number = instance.number
        self.perform_destroy(instance)
        return Response(
            {
                "message": f"Table {instance_number} deleted successfully",
                "id": str(instance_id)
            },
            status=status.HTTP_200_OK
        )

    def list(self, request, *args, **kwargs):
        """
        List all tables for the current tenant with optional filtering
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        # Add support for status counts
        counts = None
        if request.query_params.get("include_counts", "").lower() == "true":
            counts = {
                "total": queryset.count(),
                "available": queryset.filter(status="available").count(),
                "occupied": queryset.filter(status="occupied").count(),
                "reserved": queryset.filter(status="reserved").count(),
                "inactive": queryset.filter(status="inactive").count(),
            }
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data = self.get_paginated_response(serializer.data)
            if counts is not None:
                response_data.data["counts"] = counts
            return response_data

        serializer = self.get_serializer(queryset, many=True)
        response_data = {"data": serializer.data}
        
        if counts is not None:
            response_data["counts"] = counts
            
        return Response(response_data)
