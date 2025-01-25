from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User, Category


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model - convert User to JSON and vice versa"""

    # Need to set input type to password and validate
    password = serializers.RegexField(
        # Look for digit, special char, match those chars 8-16
        regex=r"^(?=.*\d)(?=.*[@+\-_!?])[A-Za-z\d@+\-_!?]{8,16}$",
        write_only=True,
        required=True,
        min_length=8,
        max_length=16,
        style={"input_type": "password"},
        error_messages={
            "invalid": (
                "Your password must contain at least one digit from 0-9 and one character from @+-_!?."  # noqa: E501
            )
        },
    )

    class Meta:
        """Metadata options for UserSerializer - based on User"""

        model: User = User
        fields: list[str] = ["id", "username", "email", "password"]
        field_kw_args: dict[str, bool] = {"required": True, "allow_blank": False}
        extra_kwargs: dict[str, dict] = {
            "username": {"required": True, "allow_blank": False, "help_text": ""},
            "email": field_kw_args,
            "password": field_kw_args,
        }


class LoginSerializer(serializers.Serializer):
    """Serializer for handling user data for logging in users"""

    username = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True, style={"input_type": "password"}, required=True
    )

    def validate(self, data):
        """Check that username and password match against an existing user"""
        user = authenticate(username=data["username"], password=data["password"])
        if user is None:
            error = "Invalid username or password"
            raise serializers.ValidationError({"username": error, "password": error})
        return data


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model - convert Category to JSON and vice versa"""

    class Meta:
        """Metadata for Category serializer"""

        model = Category
        fields = ["id", "name", "user"]
