from rest_framework import serializers
from .models import Counter
from apps.menu.models import MenuItem


class MenuItemDetailSerializer(serializers.ModelSerializer):
    """Serializer for MenuItem model with detailed information"""

    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name",
            "description",
            "price",
            "image",
            "is_active",
            "preparation_time",
            "category",
            "category_name",
        ]


class CounterSerializer(serializers.ModelSerializer):
    """Serializer for Counter model"""

    # Keep items as a write-only field
    items = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), many=True, required=False, write_only=True
    )

    # Keep item_details for reading the full item information
    item_details = MenuItemDetailSerializer(source="items", many=True, read_only=True)

    class Meta:
        model = Counter
        fields = [
            "id",
            "name",
            "description",
            "location",
            "items",
            "item_details",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
