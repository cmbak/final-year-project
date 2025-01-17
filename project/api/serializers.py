from typing import List, Dict

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model - maps JSON to User object"""

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
        fields: List[str] = ["id", "username", "email", "password"]
        field_kw_args: Dict[str, bool] = {"required": True, "allow_blank": False}
        extra_kwargs: Dict[str, dict] = {
            "username": {"required": True, "allow_blank": False, "help_text": ""},
            "email": field_kw_args,
            "password": field_kw_args,
        }


class LoginSerializer(serializers.ModelSerializer):
    """Serializer for handling user data for logging in users"""

    password = serializers.CharField(
        write_only=True,
        # required=True,
        min_length=8,
        max_length=16,
        style={"input_type": "password"},
    )

    class Meta:
        """Metadata options for LoginSerializer - based on User model"""

        model: User = User
        fields: List[str] = ["username", "password"]
        extra_kwargs: Dict[str, dict] = {
            "username": {"required": True, "allow_blank": False, "help_text": ""},
            "password": {"required": True, "allow_blank": False},
        }
