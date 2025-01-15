import pytest
from api.models import User
from api.serializers import UserSerializer

from .conftest import custom_user


@pytest.fixture
def create_user_and_serializer(standard_user) -> tuple[User, UserSerializer]:
    """Create and return a User intance and User serializer"""
    return standard_user, UserSerializer()


@pytest.mark.django_db(True)
def test_valid_user(create_user_and_serializer):
    """Test that the User serializer has the same data as the user passed to it"""
    user, serializer = create_user_and_serializer
    serializer.instance = user
    assert serializer.data == user.as_dict()


@pytest.mark.django_db(True)
def test_email_already_exists():
    """
    Test that the user serializer is invalid and the correct error message is shown
    if a user is passed to the serializer with an email which another user already has
    """
    user = custom_user(username="new_user")
    serializer = UserSerializer(
        data={"username": user.username, "email": user.email, "password": user.password}
    )
    assert serializer.is_valid() is False
    email_errors = serializer.errors.get("email")
    assert email_errors is not None  # Check that there are errors for email field
    assert len(email_errors) == 1  # Check that it's the only error
    assert (
        email_errors[0] == "user with this email address already exists."
    )  # taken from Field constructor unique error


@pytest.mark.django_db(True)
def test_password_too_short(username, email):
    """
    Test that the user serializer is invalid and the correct error message is shown
    if the password of the User passed to the serializer is too short
    """
    serializer = UserSerializer(
        data={
            "username": username,
            "email": email,
            "password": "short",
        }
    )
    assert serializer.is_valid() is False
    password_errors = serializer.errors.get("password")
    assert password_errors is not None
    password_errors = [
        str(error) for error in password_errors
    ]  # Only have string reps of ErrorDetails (subclass of str)
    assert "Ensure this field has at least 8 characters." in password_errors


@pytest.mark.django_db(True)
def test_password_too_long(username, email):
    """
    Test that the correct error message is shown
    if the password of the User passed to the serializer is too short
    """
    serializer = UserSerializer(
        data={
            "username": username,
            "email": email,
            "password": "verylongpassword1@",
        }
    )
    assert serializer.is_valid() is False
    password_errors = serializer.errors.get("password")
    assert password_errors is not None
    password_errors = [str(error) for error in password_errors]
    assert "Ensure this field has no more than 16 characters." in password_errors


@pytest.mark.django_db(True)
@pytest.mark.parametrize(
    "password, expected",
    [("apassword", True), ("apassword1", True), ("apassword@", True)],
)
def test_password_missing_reqs(password: str, expected: bool):
    """
    Test that the correct error message is shown
    if the password is missing a digit from 0-9
    and a character from @+-_!?
    """
    serializer = UserSerializer(
        data={
            "username": "bob",
            "email": "email@gmail.com",
            "password": password,
        }
    )

    assert serializer.is_valid() is False
    password_errors = serializer.errors.get("password")
    assert password_errors is not None
    password_errors = [str(error) for error in password_errors]
    assert (
        "Your password must contain at least one digit from 0-9 and one character from @+-_!?."  # noqa E501
        in password_errors
    ) is expected
