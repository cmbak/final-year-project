from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Answer, Label, Question, Quiz, User


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


class LabelSerializer(serializers.ModelSerializer):
    """Serializer for Label model - convert Label to JSON and vice versa"""

    class Meta:
        """Metadata for Label serializer"""

        model = Label
        fields = ["id", "name", "user"]


class QuizSerializer(serializers.ModelSerializer):
    """Serializer for Quiz model - convert Quiz to JSON and vice versa"""

    labels = LabelSerializer(many=True)  # Nested list of list items

    class Meta:
        """Metadata for Quiz serializer"""

        model = Quiz
        fields = ["id", "title", "user", "labels"]

    def to_internal_value(self, data):
        """
        Allow list of Label pks (i.e. foreign keys to labels) to be passed
        into labels field - e.g. by User when creating Quiz -
        whilst returning dict representation of Labels
        https://www.andreas.earth/blog/2022/09/19/drf-serializer-read-nested-data-and-write-primary-key/
        """
        self.fields["labels"] = serializers.PrimaryKeyRelatedField(
            queryset=Label.objects.all(), many=True
        )  # TODO Filter only request users labels?

        return super().to_internal_value(data)

    def validate(self, data):
        """Check that user of labels match against user creating quiz"""
        if len(data["labels"]) > 0:
            user_labels: set[User] = {label.user for label in data["labels"]}
            # Check quiz user has made chosen labels
            if data["user"] not in user_labels:
                raise serializers.ValidationError(
                    {"labels": "You must use labels which you have created."}
                )
        return data


class AnswerSerializer(serializers.ModelSerializer):
    """Serializer for Answer model - convert Answer to JSON and vice versa"""

    class Meta:
        """Metadata for answer serializer"""

        model = Answer
        fields = ["id", "answer"]


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question model - convert Question to JSON and vice versa"""

    correct_answer = AnswerSerializer()

    class Meta:
        """Metadata for question serializer"""

        model = Question
        fields = ["id", "quiz", "question", "correct_answer"]
