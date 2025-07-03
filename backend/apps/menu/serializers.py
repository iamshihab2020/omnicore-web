from rest_framework import serializers
from .models import (
    Category,
    MenuItem,
    MenuItemVariant,
    MenuItemAddon,
    MenuItemAddonGroup,
    MenuItemAddonGroupItem,
)


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "image",
            "status",
            "display_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MenuItemVariantSerializer(serializers.ModelSerializer):
    """Serializer for MenuItemVariant model"""

    class Meta:
        model = MenuItemVariant
        fields = [
            "id",
            "name",
            "price",
            "cost",
            "is_active",
            "display_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MenuItemAddonSerializer(serializers.ModelSerializer):
    """Serializer for MenuItemAddon model"""

    class Meta:
        model = MenuItemAddon
        fields = [
            "id",
            "name",
            "price",
            "cost",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MenuItemAddonGroupItemSerializer(serializers.ModelSerializer):
    """Serializer for MenuItemAddonGroupItem model"""

    addon = MenuItemAddonSerializer(read_only=True)
    addon_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = MenuItemAddonGroupItem
        fields = ["id", "addon", "addon_id", "display_order"]
        read_only_fields = ["id"]


class MenuItemAddonGroupSerializer(serializers.ModelSerializer):
    """Serializer for MenuItemAddonGroup model"""

    items = MenuItemAddonGroupItemSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItemAddonGroup
        fields = [
            "id",
            "name",
            "is_required",
            "min_selections",
            "max_selections",
            "is_active",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MenuItemSerializer(serializers.ModelSerializer):
    """Serializer for MenuItem model"""

    category_name = serializers.CharField(source="category.name", read_only=True)
    variants = MenuItemVariantSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "description",
            "price",
            "cost",
            "image",
            "is_active",
            "preparation_time",
            "variants",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MenuItemDetailSerializer(MenuItemSerializer):
    """Detailed serializer for MenuItem model with variants"""

    class Meta(MenuItemSerializer.Meta):
        fields = MenuItemSerializer.Meta.fields + []
