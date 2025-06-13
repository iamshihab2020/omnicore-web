from rest_framework import serializers
from .models import Counter


class CounterSerializer(serializers.ModelSerializer):
    """Serializer for Counter model"""

    class Meta:
        model = Counter
        fields = [
            "id",
            "name",
            "description",
            "location",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
