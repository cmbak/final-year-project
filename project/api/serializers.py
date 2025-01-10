from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model - maps JSON to User object"""

    class Meta:
        model = User
        fields = ["id", "username", "email"]
