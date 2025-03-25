import pytest
from api.models import Label, Quiz, User
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
def test_label_valid_fields(standard_user: User) -> None:
    """Test label creation functionality with valid label name and user"""
    label = Label.objects.create(name="label", user=standard_user)
    assert label.name == "label"
    assert label.user == standard_user


@pytest.mark.django_db(True)
def test_label_name_unique(standard_user: User) -> None:
    """Test that the name of a label should be unique irrespective of case"""
    Label.objects.create(name="label", user=standard_user)
    with pytest.raises(IntegrityError):
        Label.objects.create(name="LABEL", user=standard_user)


@pytest.mark.django_db(True)
def test_label_string(standard_user: User) -> None:
    """Test that the Label string method returns the label name"""
    label = Label.objects.create(name="label", user=standard_user)
    assert str(label) == label.name


@pytest.mark.django_db(True)
def test_quiz_valid_fields(quiz: Quiz, username: str) -> None:
    """Test quiz creation functionality with valid quiz fields"""
    assert quiz.title == "quiz"
    assert quiz.user.username == username
    assert quiz.labels.filter(name="label", user=quiz.user).exists()


@pytest.mark.django_db(True)
def test_label_deleted_on_user_deletion(standard_user: User) -> None:
    """Test that after a user is deleted, their labels also get deleted"""
    Label.objects.create(name="to be deleted", user=standard_user)

    standard_user.delete()

    assert Label.objects.count() == 0


@pytest.mark.django_db(True)
def test_quiz_string(quiz: Quiz, username: str) -> None:
    """Test quiz string method returns the details of the quiz"""
    assert str(quiz) == f"quiz | {quiz.UPLOAD} | label | {username}"


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
def test_quiz_label_deletion(quiz: Quiz) -> None:
    """
    Test that after a label is deleted,
    it's been removed from its (previously) associated quizzes
    """
    label = Label.objects.get(name="label", user=quiz.user)  # Created in fixture

    label.delete()

    assert quiz.labels.count() == 0


@pytest.mark.django_db(True)
def test_quiz_deleted_on_user_deletion(quiz: Quiz) -> None:
    """Test that after a user is deleted, their quizzes should also be deleted"""
    user = quiz.user

    user.delete()

    assert not Quiz.objects.filter(title="quiz").exists()
    assert Quiz.objects.count() == 0
