from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MenuItemViewSet

# Create a router for viewsets
router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"items", MenuItemViewSet, basename="menu-item")

urlpatterns = [
    path("", include(router.urls)),
]
