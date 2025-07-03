from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import VatTaxViewSet

router = DefaultRouter()
router.register(r"", VatTaxViewSet, basename="vat-tax")

urlpatterns = [
    path("", include(router.urls)),
]
