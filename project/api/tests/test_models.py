import pytest
from api.models import User
from django.db.utils import IntegrityError

USER_USERNAME = "bob"
USER_EMAIL = "bob@gmail.com"
USER_PASSWORD = "password1@"


def create_db_user(
    username: str = USER_USERNAME,
    email: str = USER_EMAIL,
    password: str = USER_PASSWORD,
) -> User:
    """
    Create user instance with given username, email and password.
    Uses default values if no arguments provided
    """
    return User.objects.create(username=username, email=email, password=password)


@pytest.mark.django_db(True)
def test_create_user():
    """Test user creation functionality with valid user details"""
    user = create_db_user()
    assert user.username == USER_USERNAME
    assert user.email == USER_EMAIL
    assert user.password == USER_PASSWORD


@pytest.mark.django_db(True)
def test_unique_user_username():
    """
    Test that creating a user with the same username as an existing user is not allowed
    """
    create_db_user()
    with pytest.raises(IntegrityError):
        create_db_user(email="john.doe@gmail.com")


@pytest.mark.django_db(True)
def test_unique_user_email():
    """
    Test that creating a user with the same email as an exisiting user is not allowed
    """
    with pytest.raises(IntegrityError):
        create_db_user(username="John Doe", email=USER_EMAIL)
