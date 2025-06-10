"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

# Create empty URL patterns to start with
router = DefaultRouter()
# Add viewsets here if needed

# Define the main API version
api_v1_patterns = [
    # Authentication
    path("auth/", include("apps.users.urls")),
    # Superadmin routes
    path("superadmin/", include("superadmin_app.urls")),
    # App routes
    path("menu/", include("apps.menu.urls")),
    path("pos/", include("apps.pos.urls")),
    path("staff/", include("apps.staff.urls")),
    path("analytics/", include("apps.analytics.urls")),
]

# Comment out drf-yasg for now until we're ready to use it
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi
# # API Documentation setup
# schema_view = get_schema_view(
#     openapi.Info(
#         title="Omnicore API",
#         default_version='v1',
#         description="API for Omnicore Restaurant Management System",
#         terms_of_service="https://www.omnicore.com/terms/",
#         contact=openapi.Contact(email="contact@omnicore.com"),
#         license=openapi.License(name="Proprietary"),
#     ),
#     public=True,
#     permission_classes=[permissions.AllowAny],
# )

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),
    # API endpoints
    path("api/v1/", include(api_v1_patterns)),
    # Include default router if needed
    path("api/v1/", include(router.urls)),
    # Direct login endpoint
    path("api/login/", include("apps.users.login_urls")),
    path("api/refresh/", include("apps.users.refresh_urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
