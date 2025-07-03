from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from apps.tenants.models import Tenant, TenantUser
from rest_framework.validators import UniqueValidator

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'avatar', 'phone']
        read_only_fields = ['id', 'is_active', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    # Optional tenant creation fields
    create_tenant = serializers.BooleanField(required=False, default=False)
    tenant_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm', 'first_name', 'last_name', 
                  'phone', 'create_tenant', 'tenant_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate tenant creation if requested
        if attrs.get('create_tenant'):
            if not attrs.get('tenant_name'):
                raise serializers.ValidationError({"tenant_name": "Tenant name is required when creating a tenant."})
        
        return attrs
    
    def create(self, validated_data):
        # Remove tenant-related and confirmation fields from user creation
        create_tenant = validated_data.pop('create_tenant', False)
        tenant_name = validated_data.pop('tenant_name', None)
        validated_data.pop('password_confirm', None)
        
        # Create the user
        user = User.objects.create(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Create tenant if requested
        if create_tenant and tenant_name:
            from django.utils.text import slugify
            tenant = Tenant.objects.create(
                name=tenant_name,
                slug=slugify(tenant_name),
                owner=user
            )
            # Create tenant-user relationship with owner role
            TenantUser.objects.create(
                tenant=tenant,
                user=user,
                role='owner'
            )
        
        return user


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation"""
    token = serializers.UUIDField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs
