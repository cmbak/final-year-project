import pytest
from api.models import Quiz, User
from django.core.exceptions import ValidationError
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
        custom_user(
            email="john.doe@gmail.com"
        )  # Standard user fixture already creates user w/ this email


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
def test_quiz_string(quiz: Quiz, username: str) -> None:
    """Test quiz string method returns the details of the quiz"""
    assert str(quiz) == f"quiz | {quiz.UPLOAD} | {username}"


@pytest.mark.django_db(True)
def test_quiz_unique_title() -> None:
    """Test that title of a quiz should be unique irrespective of case"""
    user = custom_user("new_user", "new_user@gmail.com")

    with pytest.raises(ValidationError):
        Quiz.objects.create(
            title="quiz",
            user=user,
        )


@pytest.mark.django_db(True)
def test_quiz_deleted_on_user_deletion(quiz: Quiz) -> None:
    """Test that after a user is deleted, their quizzes should also be deleted"""
    user = quiz.user

    user.delete()

    assert not Quiz.objects.filter(title="quiz").exists()
    assert Quiz.objects.count() == 0
