from rest_framework import serializers
from .models import RestaurantTable


class TableSerializer(serializers.ModelSerializer):
    """Serializer for RestaurantTable model"""

    class Meta:
        model = RestaurantTable
        fields = [
            "id",
            "number",
            "name",
            "capacity",
            "status",
            "area",
            "is_active",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TableDetailSerializer(TableSerializer):
    """Detailed serializer for Table model with additional data"""

    class Meta(TableSerializer.Meta):
        fields = TableSerializer.Meta.fields + []
