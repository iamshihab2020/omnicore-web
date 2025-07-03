from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from .models import VatTax
from .serializers import VatTaxSerializer
from apps.core.permissions import IsTenantUser, IsTenantAdmin, IsTenantOwner


class VatTaxViewSet(viewsets.ModelViewSet):
    """ViewSet for managing VAT tax data"""

    permission_classes = [permissions.IsAuthenticated, IsTenantUser]
    serializer_class = VatTaxSerializer

    def get_queryset(self):
        """Return objects for the current authenticated tenant only"""
        if hasattr(self.request, "tenant"):
            return VatTax.objects.filter(tenant=self.request.tenant)
        return VatTax.objects.none()

    def perform_create(self, serializer):
        """Create a new VAT tax"""
        if hasattr(self.request, "tenant"):
            serializer.save(tenant=self.request.tenant)
