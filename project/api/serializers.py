from typing import List

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model - maps JSON to User object"""

    # Need to set input type to password and validate
    password: serializers.RegexField = serializers.RegexField(
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
        model: User = User
        fields: List[str] = ["id", "username", "email", "password"]
        field_kw_args: dict[str, bool] = {"required": True, "allow_blank": False}
        extra_kwargs: dict[str, dict] = {
            "username": {"required": True, "allow_blank": False, "help_text": ""},
            "email": field_kw_args,
            "password": field_kw_args,
        }
