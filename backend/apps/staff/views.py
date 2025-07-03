from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction

from .models import StaffProfile
from .serializers import StaffProfileSerializer
from apps.core.permissions import IsTenantUser, IsTenantManager, IsTenantAdmin


class StaffProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing staff profiles in a tenant context.
    
    Only users with tenant roles 'tenant', 'admin', or 'manager' can create staff profiles.
    """
    serializer_class = StaffProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantManager]
    
    def get_queryset(self):
        """Return staff profiles for the current tenant only."""
        if hasattr(self.request, "tenant"):
            return StaffProfile.objects.filter(tenant=self.request.tenant)
        return StaffProfile.objects.none()
    
    @transaction.atomic
    def perform_create(self, serializer):
        """Create a new staff profile for the current tenant."""
        if hasattr(self.request, "tenant"):
            try:
                serializer.save()
            except Exception as e:
                raise ValidationError(str(e))
        else:
            raise ValidationError("No active tenant found. Set X-Tenant-Workspace header.")
    
    def create(self, request, *args, **kwargs):
        """Create a new staff profile with validation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {"message": "Staff profile created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        except ValidationError as e:
            return Response(
                {"message": "Failed to create staff profile", "errors": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
    
    def update(self, request, *args, **kwargs):
        """Update a staff profile with validation."""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        
        try:
            self.perform_update(serializer)
            return Response(
                {"message": "Staff profile updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        except ValidationError as e:
            return Response(
                {"message": "Failed to update staff profile", "errors": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
    
    def destroy(self, request, *args, **kwargs):
        """Remove a staff profile."""
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
            return Response(
                {"message": "Staff profile deleted successfully"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"message": "Failed to delete staff profile", "errors": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
