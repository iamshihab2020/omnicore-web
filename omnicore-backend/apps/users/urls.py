from django.urls import path
from rest_framework_simplejwt.views import TokenBlacklistView

from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    RegisterView,
    UserDetailView,
    LogoutView,
    TestAuthView,
)

app_name = "users"

urlpatterns = [
    # JWT Token authentication
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),
    # User registration and management
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", UserDetailView.as_view(), name="user_detail"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # Test endpoint
    path("test-auth/", TestAuthView.as_view(), name="test_auth"),
]
