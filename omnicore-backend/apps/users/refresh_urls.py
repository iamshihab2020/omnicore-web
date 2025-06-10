from django.urls import path
from .views import CustomTokenRefreshView

# Simple URL pattern for direct refresh path
urlpatterns = [
    path("", CustomTokenRefreshView.as_view(), name="direct_refresh"),
]
