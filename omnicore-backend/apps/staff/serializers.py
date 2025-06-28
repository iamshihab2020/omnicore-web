from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import StaffProfile
from apps.tenants.models import TenantUser

User = get_user_model()


class StaffProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the StaffProfile model with conditional password validation
    based on the staff position.
    """
    password = serializers.CharField(
        write_only=True, 
        required=False,
        style={'input_type': 'password'},
        validators=[validate_password]
    )

    class Meta:
        model = StaffProfile
        fields = [
            'id', 'name', 'position', 'email', 'phone_number', 
            'address', 'gender', 'profile_photo', 'is_active', 
            'created_at', 'updated_at', 'password'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        """
        Validate the data based on the staff position:
        - If manager or cashier: password is required
        - If waiter or chef: password should not be provided
        """
        position = attrs.get('position')
        password = attrs.get('password')
        
        # For positions that require login
        if position in StaffProfile.LOGIN_ENABLED_POSITIONS:
            if not password and self.context['request'].method == 'POST':
                raise serializers.ValidationError({
                    'password': f'Password is required for {position} position'
                })
        # For positions that don't require login
        else:
            if password:
                raise serializers.ValidationError({
                    'password': f'Password should not be provided for {position} position'
                })
        
        return attrs
    
    def create(self, validated_data):
        """
        Create the staff profile and user account if needed based on position.
        """
        position = validated_data.get('position')
        password = validated_data.pop('password', None)
        request = self.context.get('request')
        tenant = request.tenant
        
        # Create user account for positions that require login
        if position in StaffProfile.LOGIN_ENABLED_POSITIONS and password:
            email = validated_data.get('email')
            name_parts = validated_data.get('name', '').split(maxsplit=1)
            first_name = name_parts[0] if name_parts else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Create a Django user account
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                phone=validated_data.get('phone_number', ''),
            )
            
            # Create tenant user relationship with appropriate role
            tenant_role = 'manager' if position == 'manager' else 'cashier'
            TenantUser.objects.create(
                tenant=tenant,
                user=user,
                role=tenant_role,
                is_active=True
            )
            
            # Set the user on the staff profile
            validated_data['user'] = user
        
        # Set tenant from request
        validated_data['tenant'] = tenant
        
        # Create the staff profile
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """
        Update the staff profile and user account if needed.
        """
        password = validated_data.pop('password', None)
        position = validated_data.get('position', instance.position)
        
        # Handle user account updates for positions that require login
        if position in StaffProfile.LOGIN_ENABLED_POSITIONS and password and instance.user:
            instance.user.set_password(password)
            instance.user.save()
            
            # Update user profile info if email or name changed
            if 'email' in validated_data and validated_data['email'] != instance.email:
                instance.user.email = validated_data['email']
                
            if 'name' in validated_data and validated_data['name'] != instance.name:
                name_parts = validated_data['name'].split(maxsplit=1)
                instance.user.first_name = name_parts[0] if name_parts else ''
                instance.user.last_name = name_parts[1] if len(name_parts) > 1 else ''
                
            if 'phone_number' in validated_data:
                instance.user.phone = validated_data['phone_number']
                
            instance.user.save()
        
        # Update the staff profile
        return super().update(instance, validated_data)
