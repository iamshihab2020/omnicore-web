from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantTableViewSet

# Create a router for viewsets
router = DefaultRouter()
router.register(r"", RestaurantTableViewSet, basename="restaurant-table")

urlpatterns = [
    path("", include(router.urls)),
]
