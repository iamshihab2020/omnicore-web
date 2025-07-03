from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffProfileViewSet

router = DefaultRouter()
router.register('', StaffProfileViewSet, basename='staff')

urlpatterns = [
    path('', include(router.urls)),
]
