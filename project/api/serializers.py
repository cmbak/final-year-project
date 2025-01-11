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
                "Your password must contain at least one digit 0-9 and one character from @+-_!?."  # noqa: E501
            )
        },
    )

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def validate_email(self, value):
        """Check that no user with given email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists")
        return value

    def validate_password(self, value):
        """Check that length of password is between 8 and 16 characters"""

        if len(value) < 8 or len(value) > 16:
            raise serializers.ValidationError(
                "Your password must be between 8 and 16 characters inclusive"
            )
        return value
