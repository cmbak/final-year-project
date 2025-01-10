from rest_framework import serializers

from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for user model"""

    class Meta:
        model = User
        fields = ["url", "username", "email"]
