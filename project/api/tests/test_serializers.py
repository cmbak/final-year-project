import pytest
from api.serializers import UserSerializer

from .test_models import create_db_user
from api.models import User


@pytest.fixture
def create_user_and_serializer() -> tuple[User, UserSerializer]:
    """Create and return a User intance and User serializer"""
    return create_db_user(), UserSerializer()


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
    user = create_db_user(username="new_user")
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
def test_password_too_short():
    """
    Test that the user serializer is invalid and the correct error message is shown
    if the password of the User passed to the serializer is too short
    """
    serializer = UserSerializer(
        data={
            "username": "bob",
            "email": "email@gmail.com",
            "password": "short",
        }
    )
    assert serializer.is_valid() is False
    # TODO check exact error message expected


@pytest.mark.django_db(True)
def test_password_too_long():
    """
    Test that the correct error message is shown
    if the password of the User passed to the serializer is too short
    """
    pass
