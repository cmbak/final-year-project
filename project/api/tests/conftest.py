import pytest
from api.models import Category, Label, Quiz, User
from rest_framework.test import APIClient

USER_USERNAME = "bob"
USER_EMAIL = "bob@gmail.com"
USER_PASSWORD = "password1@"


def custom_user(
    username: str = USER_USERNAME,
    email: str = USER_EMAIL,
    password: str = USER_PASSWORD,
) -> User:
    """Create user instance with given username, email and password."""
    return User.objects.create(username=username, email=email, password=password)


@pytest.fixture
def standard_user() -> User:
    """Create a user instance with a fixed username, email and password."""
    return User.objects.create(
        username=USER_USERNAME, email=USER_EMAIL, password=USER_PASSWORD
    )


@pytest.fixture(scope="module")
def username() -> str:
    """
    Return a valid username for a User instance.
    Same username as the one of the user returned from standard_user fixture
    """
    return USER_USERNAME


@pytest.fixture(scope="module")
def email() -> str:
    """
    Return a valid email for a User instance.
    Same email as the one of the user returned from standard_user fixture
    """
    return USER_EMAIL


@pytest.fixture(scope="module")
def password() -> str:
    """
    Return a valid password for a User instance.
    Same password as the one of the user returned from standard_user fixture
    """
    return USER_PASSWORD


@pytest.fixture
def api_client() -> APIClient:
    """Return an API client instance"""
    return APIClient()


@pytest.fixture
def quiz() -> Quiz:
    """Returns a quiz instance"""
    user = custom_user()
    quiz = Quiz.objects.create(
        title="quiz",
        user=user,
        category=Category.objects.create(name="category", user=user),
    )

    quiz.labels.add(Label.objects.create(name="label"))
    quiz.save()
    return quiz


def get_response_errors(response) -> list[str]:
    """Return a list of the errors in found in the response data"""
    errors = []

    for field_errors in response.data["errors"]:
        for error in response.data["errors"][field_errors]:
            errors.append(str(error))

    return errors
