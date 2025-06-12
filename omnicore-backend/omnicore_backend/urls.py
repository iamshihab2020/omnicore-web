"""
URL configuration for omnicore_backend project.

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
from rest_framework_simplejwt.views import TokenVerifyView
from django.views.generic import RedirectView

urlpatterns = [
    path("admin/", admin.site.urls),  # API endpoints
    path("api/auth/", include("apps.authentication.urls")),
    path("api/tenants/", include("apps.tenants.urls")),
    path("api/menu/", include("apps.menu.urls")),
    # JWT token verify endpoint
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # Root URL redirects to admin
    path("", RedirectView.as_view(url="/admin/"), name="index"),
]

# Add media files serving in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
