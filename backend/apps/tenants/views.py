from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from .models import Tenant, TenantUser
from .serializers import TenantSerializer, TenantUserSerializer
from apps.core.permissions import IsTenantOwner, IsTenantAdmin, IsTenantUser
from django.contrib.auth import get_user_model

User = get_user_model()


class TenantListView(generics.ListCreateAPIView):
    """List all tenants or create a new tenant"""
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only tenants that the user belongs to"""
        return Tenant.objects.filter(
            tenant_users__user=self.request.user,
            tenant_users__is_active=True
        )
    
    def perform_create(self, serializer):
        """When creating a tenant, set the current user as the owner"""
        slug = slugify(serializer.validated_data['name'])
        tenant = serializer.save(
            owner=self.request.user,
            slug=slug
        )
        # Create TenantUser relationship with owner role
        TenantUser.objects.create(
            tenant=tenant,
            user=self.request.user,
            role='owner'
        )


class TenantDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a tenant"""
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantOwner]
    
    def get_queryset(self):
        """Return only tenants that the user belongs to"""
        return Tenant.objects.filter(
            tenant_users__user=self.request.user,
            tenant_users__is_active=True
        )


class TenantUserListView(generics.ListCreateAPIView):
    """List all users in a tenant or add a new user to tenant"""
    serializer_class = TenantUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]
    
    def get_queryset(self):
        """Return only users of the specified tenant"""
        tenant_id = self.kwargs['tenant_id']
        return TenantUser.objects.filter(tenant_id=tenant_id)
    
    def perform_create(self, serializer):
        """When adding a user to tenant, set tenant from URL"""
        tenant_id = self.kwargs['tenant_id']
        tenant = get_object_or_404(Tenant, id=tenant_id)
        
        # Check if user exists, or create them
        user_data = self.request.data.get('user', {})
        email = user_data.get('email')
        
        if email:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),
                    'is_active': True
                }
            )
            
            if created:
                # Set a random password for new user (they would reset it)
                import uuid
                temp_password = str(uuid.uuid4())[:12]
                user.set_password(temp_password)
                user.save()
                
                # TODO: Send invitation email with temp password
            
            serializer.save(tenant=tenant, user=user)
        else:
            raise ValidationError({"user": "User email is required"})


class TenantUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or remove a user from tenant"""
    serializer_class = TenantUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]
    
    def get_queryset(self):
        """Return only users of the specified tenant"""
        tenant_id = self.kwargs['tenant_id']
        return TenantUser.objects.filter(tenant_id=tenant_id)
