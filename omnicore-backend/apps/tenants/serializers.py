from rest_framework import serializers
from .models import Tenant, TenantUser


class TenantSerializer(serializers.ModelSerializer):
    """Serializer for Tenant model"""
    class Meta:
        model = Tenant
        fields = [
            'id', 'name', 'slug', 'domain', 'is_active', 'created_at',
            'address', 'city', 'state', 'country', 'zip_code',
            'phone', 'email', 'logo', 'primary_color', 'secondary_color'
        ]
        read_only_fields = ['id', 'created_at']


class TenantUserSerializer(serializers.ModelSerializer):
    """Serializer for TenantUser model"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TenantUser
        fields = ['id', 'tenant', 'user', 'role', 'is_active', 'created_at', 'user_email', 'user_name']
        read_only_fields = ['id', 'created_at']
    
    def get_user_name(self, obj):
        if obj.user.first_name or obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return obj.user.email
