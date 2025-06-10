from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "tenant",
            "profile_picture",
            "is_active",
            "date_joined",
        )
        read_only_fields = ("id", "date_joined")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer that adds user data and role to the token payload
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["role"] = user.role
        token["email"] = user.email
        token["name"] = user.get_full_name()

        # Add tenant info if applicable
        if user.tenant:
            token["tenant_id"] = user.tenant.id
            token["tenant_name"] = user.tenant.name
            token["tenant_slug"] = user.tenant.slug

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra response data
        data["user"] = UserSerializer(self.user).data
        data["role"] = self.user.role

        if self.user.tenant:
            data["tenant"] = {
                "id": self.user.tenant.id,
                "name": self.user.tenant.name,
                "slug": self.user.tenant.slug,
            }

        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    password2 = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ("email", "password", "password2", "first_name", "last_name", "role")
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        # Remove password2 from the validated data
        validated_data.pop("password2")

        user = User.objects.create_user(**validated_data)
        return user


class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh = RefreshToken(attrs["refresh"])
        data = {"access": str(refresh.access_token)}

        # Add user info to response
        user = User.objects.get(id=refresh["user_id"])
        data["user"] = UserSerializer(user).data

        return data
