import pytest
from api.models import User, Category
from django.db.utils import IntegrityError

from .conftest import custom_user


@pytest.mark.django_db(True)
def test_create_user(
    standard_user: User, username: str, email: str, password: str
) -> None:
    """Test user creation functionality with valid user details"""
    user = standard_user
    assert user.username == username
    assert user.email == email
    assert user.password == password


@pytest.mark.django_db(True)
def test_unique_user_username(standard_user: User) -> None:
    """
    Test that creating a user with the same username as an existing user is not allowed
    """
    with pytest.raises(IntegrityError):
        custom_user(email="john.doe@gmail.com")


@pytest.mark.django_db(True)
def test_unique_user_email(standard_user: User) -> None:
    """
    Test that creating a user with the same email as an exisiting user is not allowed
    """
    with pytest.raises(IntegrityError):
        custom_user(username="John Doe")


@pytest.mark.django_db(True)
def test_user_string(standard_user: User) -> None:
    """
    Test that string method of User returns the correctly formatted string:
    ``` username (email) ```
    """
    assert str(standard_user) == f"{standard_user.username} ({standard_user.email})"


@pytest.mark.django_db(True)
def test_category_name_unique(standard_user: User) -> None:
    """Test that the name of a category should be unique irrespective of case"""
    Category.objects.create(name="category", user=standard_user)
    with pytest.raises(IntegrityError):
        Category.objects.create(name="Category", user=standard_user)


# TODO what happens to related model instances when category is deleted?
