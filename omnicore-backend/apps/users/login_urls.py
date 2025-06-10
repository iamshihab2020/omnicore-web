from django.urls import path
from .views import CustomTokenObtainPairView

# Simple URL pattern for direct login path
urlpatterns = [
    path("", CustomTokenObtainPairView.as_view(), name="direct_login"),
]
