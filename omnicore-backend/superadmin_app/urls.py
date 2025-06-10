from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SuperAdminTenantViewSet, SuperAdminUserViewSet

app_name = "superadmin"

router = DefaultRouter()
router.register("tenants", SuperAdminTenantViewSet, basename="tenants")
router.register("users", SuperAdminUserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
]
