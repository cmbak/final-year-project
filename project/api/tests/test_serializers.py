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
def test_email_already_exists(create_user_and_serializer):
    """
    Test that correct error message shows if a user is passed to the serializer
    with an email which another user already has
    """
    user, serializer = create_user_and_serializer
    print(user)
    print(serializer)


@pytest.mark.django_db(True)
def test_password_too_short():
    """
    Test that the correct error message is shown
    if the password of the User passed to the serializer is too short
    """
    pass


@pytest.mark.django_db(True)
def test_password_too_long():
    """
    Test that the correct error message is shown
    if the password of the User passed to the serializer is too short
    """
    pass
