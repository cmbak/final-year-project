import pytest
from django.db.utils import IntegrityError

from .conftest import custom_user


@pytest.mark.django_db(True)
def test_create_user(standard_user, username, email, password):
    """Test user creation functionality with valid user details"""
    user = standard_user
    assert user.username == username
    assert user.email == email
    assert user.password == password


@pytest.mark.django_db(True)
def test_unique_user_username(standard_user):
    """
    Test that creating a user with the same username as an existing user is not allowed
    """
    with pytest.raises(IntegrityError):
        custom_user(email="john.doe@gmail.com")


@pytest.mark.django_db(True)
def test_unique_user_email(standard_user):
    """
    Test that creating a user with the same email as an exisiting user is not allowed
    """
    with pytest.raises(IntegrityError):
        custom_user(username="John Doe")


@pytest.mark.django_db(True)
def test_user_string(standard_user):
    """
    Test that string method of User returns the correctly formatted string:
    ``` username (email) ```
    """
    assert str(standard_user) == f"{standard_user.username} ({standard_user.email})"
