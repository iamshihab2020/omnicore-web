from rest_framework import serializers
from .models import VatTax


class VatTaxSerializer(serializers.ModelSerializer):
    """Serializer for the VatTax model"""

    class Meta:
        model = VatTax
        fields = [
            "id",
            "name",
            "rate",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
