import pytest
from api.models import User

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


@pytest.fixture
def username() -> str:
    """
    Return a valid username for a User instance.
    Same username as the one of the user returned from standard_user fixture
    """
    return USER_USERNAME


@pytest.fixture
def email() -> str:
    """
    Return a valid email for a User instance.
    Same email as the one of the user returned from standard_user fixture
    """
    return USER_EMAIL


@pytest.fixture
def password() -> str:
    """
    Return a valid password for a User instance.
    Same password as the one of the user returned from standard_user fixture
    """
    return USER_PASSWORD
