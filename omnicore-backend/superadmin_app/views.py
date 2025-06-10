from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.db import transaction

from tenants_app.models import Tenant
from apps.users.serializers import UserSerializer
from core.permissions.permissions import IsSuperAdmin

User = get_user_model()


class TenantSerializer(serializers.ModelSerializer):
    """Serializer for the Tenant model"""

    class Meta:
        model = Tenant
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "address",
            "phone",
            "email",
            "website",
            "logo",
            "is_active",
            "subscription_plan",
            "subscription_start_date",
            "subscription_end_date",
            "created_at",
            "updated_at",
        ]


class SuperAdminTenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Tenant management by SuperAdmin
    """

    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsSuperAdmin]

    @action(detail=True, methods=["post"])
    def create_tenant_with_owner(self, request, pk=None):
        """
        Create a tenant and its owner user in a single transaction
        """
        tenant_data = request.data.get("tenant", {})
        user_data = request.data.get("user", {})

        if not tenant_data or not user_data:
            return Response(
                {"detail": "Both tenant and user data are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Ensure password is provided
        if "password" not in user_data:
            return Response(
                {"detail": "Password is required for the tenant owner"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                # Create tenant
                tenant_serializer = self.get_serializer(data=tenant_data)
                tenant_serializer.is_valid(raise_exception=True)
                tenant = tenant_serializer.save()

                # Create tenant owner user
                user_data["role"] = "TENANT"
                user_data["tenant"] = tenant.id
                user_serializer = UserSerializer(data=user_data)
                user_serializer.is_valid(raise_exception=True)
                user = User.objects.create_user(
                    email=user_data["email"],
                    password=user_data["password"],
                    first_name=user_data.get("first_name", ""),
                    last_name=user_data.get("last_name", ""),
                    role="TENANT",
                    tenant=tenant,
                )

                return Response(
                    {
                        "tenant": tenant_serializer.data,
                        "user": UserSerializer(user).data,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def users(self, request, pk=None):
        """
        Get all users associated with a specific tenant
        """
        tenant = self.get_object()
        users = User.objects.filter(tenant=tenant)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class SuperAdminUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User management by SuperAdmin
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdmin]

    @action(detail=False, methods=["get"])
    def super_admins(self, request):
        """
        Get all super admin users
        """
        super_admins = User.objects.filter(role="SUPER_ADMIN")
        serializer = self.get_serializer(super_admins, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def tenants(self, request):
        """
        Get all tenant owner users
        """
        tenant_owners = User.objects.filter(role="TENANT")
        serializer = self.get_serializer(tenant_owners, many=True)
        return Response(serializer.data)
