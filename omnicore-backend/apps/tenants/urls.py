from django.urls import path
from .views import (
    TenantListView,
    TenantDetailView,
    TenantUserListView,
    TenantUserDetailView,
)

urlpatterns = [
    path('', TenantListView.as_view(), name='tenant-list'),
    path('<uuid:pk>/', TenantDetailView.as_view(), name='tenant-detail'),
    path('<uuid:tenant_id>/users/', TenantUserListView.as_view(), name='tenant-user-list'),
    path('<uuid:tenant_id>/users/<uuid:pk>/', TenantUserDetailView.as_view(), name='tenant-user-detail'),
]
