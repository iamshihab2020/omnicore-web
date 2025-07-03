from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CounterViewSet

# Create a router for viewsets
router = DefaultRouter()
router.register(r"", CounterViewSet, basename="counter")

urlpatterns = [
    path("", include(router.urls)),
]
