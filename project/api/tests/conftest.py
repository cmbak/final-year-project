import pytest
from api.models import Answer, Category, Label, Question, Quiz, User
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
    quiz.labels.add(Label.objects.create(name="label", user=user))

    question = Question.objects.create(
        question="What is the captial of England?", quiz=quiz
    )
    answer = Answer.objects.create(answer="London", question=question)
    question.correct_answer = answer

    question.save()
    quiz.save()
    return quiz


@pytest.fixture
def quiz_data_and_user(standard_user) -> tuple[dict, User]:
    """
    Return a tuple of valid data for a Quiz and the user used to create the quiz details
    """
    label_one = Label.objects.create(name="Label One", user=standard_user)
    label_two = Label.objects.create(name="Label Two", user=standard_user)
    category = Category.objects.create(name="Category", user=standard_user)

    return (
        {
            "title": "Test Quiz",
            "labels": [label_one.id, label_two.id],
            "category": category.id,
            "user": standard_user.id,
            "url": "fakeurl.co.uk",
        },
        standard_user,
    )


def get_response_errors(response) -> list[str]:
    """Return a list of the errors in found in the response data"""
    errors = []

    # Response is list
    try:
        for field_errors in response.data["errors"]:
            for error in response.data["errors"][field_errors]:
                errors.append(str(error))
    except AttributeError:  # Response is dict
        for field_errors in response.get("errors"):
            for error in response.get("errors")[field_errors]:
                errors.append(str(error))

    return errors
