import json
from unittest.mock import MagicMock, patch

import pytest
from api.models import Question, Quiz, User
from django.urls import reverse
from rest_framework.test import APIClient
from yt_dlp.utils import DownloadError

from .conftest import custom_user, get_response_errors

# Users API Endpoint


@pytest.mark.django_db(True)
def test_get_users_auth(standard_user: User, api_client: APIClient) -> None:
    """
    Test that an authenticated user sending a GET request to the users endpoint
    receives a 200 response
    """
    api_client.force_authenticate(user=standard_user)
    response = api_client.get("/api/users/")

    assert response.status_code == 200


@pytest.mark.django_db(True)
def test_get_users_not_auth(api_client: APIClient) -> None:
    """
    Test that an unauthenticated user sending a GET request to the users endpoint
    recieves a 401 response
    """
    api_client.force_authenticate(None)
    response = api_client.get("/api/users/")

    assert response.status_code == 401


@pytest.mark.django_db(True)
def test_post_valid_user(standard_user: User, api_client: APIClient) -> None:
    """
    Test that sending a POST request to the users endpoint with valid user data
    creates a User with that data
    """
    data = {
        "username": "new_user",
        "email": "new_user@gmail.com",
        "password": "password1@",
    }

    api_client.force_authenticate(standard_user)
    response = api_client.post("/api/users/", data)
    response_user = response.json()

    assert response.status_code == 201
    assert response_user["username"] == data["username"]
    assert response_user["email"] == data["email"]
    assert User.objects.get(username=data["username"]) is not None  # username is unique


@pytest.mark.django_db(True)
def test_post_user_not_auth(api_client: APIClient) -> None:
    """
    Test that an unauthenticated user sending a POST request to the users endpoint
    recieves a 401 response
    """
    api_client.force_authenticate(None)
    response = api_client.post("/api/users/")

    assert response.status_code == 401


@pytest.mark.django_db(True)
def test_post_user_email_already_exists(
    standard_user: User, email: str, password: str, api_client: APIClient
) -> None:
    """
    Test that sending a POST request to the users endpoint
    with an email of an existing user returns a 400 response
    and shows the correct error message
    """
    data = {
        "username": "new_user",
        "email": email,
        "password": password,
    }

    api_client.force_authenticate(standard_user)
    response = api_client.post("/api/users/", data)
    email_errors = [error.lower() for error in response.json()["email"]]

    assert response.status_code == 400
    assert len(email_errors) == 1
    assert "User with this email address already exists.".lower() in email_errors


@pytest.mark.django_db(True)
@pytest.mark.parametrize(
    "password, expected",
    [
        ("short", "Ensure this field has at least 8 characters."),
        ("verylongpassword1@", "Ensure this field has no more than 16 characters."),
    ],
)
def test_post_user_password_invalid_length(
    standard_user: User,
    api_client: APIClient,
    username: str,
    email: str,
    password: str,
    expected: str,
) -> None:
    """
    Test that sending a POST request to the users endpoint with an invalid
    password length returns a 400 response and shows the correct error message
    """
    data = {
        "username": username,
        "email": email,
        "password": password,
    }

    api_client.force_authenticate(user=standard_user)
    response = api_client.post("/api/users/", data)
    password_errors = [error.lower() for error in response.json()["password"]]

    assert response.status_code == 400
    assert expected.lower() in password_errors


@pytest.mark.django_db(True)
@pytest.mark.parametrize(
    "password",
    ["apassword", "apassword1", "apassword@"],
)
def test_post_user_password_missing_reqs(
    api_client: APIClient, standard_user: User, username: str, email: str, password: str
) -> APIClient:
    """
    Test that sending a POST request to the users endpoint with an invalid password
    (missing digit from 0-9 and special character from @+-_!?)
    returns a 400 response and shows the correct error message
    """
    data = {
        "username": username,
        "email": email,
        "password": password,
    }

    api_client.force_authenticate(user=standard_user)
    response = api_client.post("/api/users/", data)
    password_errors = [error.lower() for error in response.json()["password"]]

    assert response.status_code == 400
    assert (
        "Your password must contain at least one digit from 0-9 and one character from @+-_!?.".lower()  # noqa E501
        in password_errors
    )


# Creating Quiz


@pytest.mark.django_db(True)
@patch(
    "api.views.download_video", side_effect=DownloadError("Video is not a valid URL")
)
def test_post_quiz_invalid_url(
    mock_download: MagicMock,
    quiz_data_and_user: tuple[dict, User],
    api_client: APIClient,
) -> None:
    """
    Test that a POST request from an authenticated user with an invalid YouTube url
    returns 400 and the appropriate error message
    """
    data, user = quiz_data_and_user

    api_client.force_authenticate(user=user)
    response = api_client.post(reverse("quiz-create"), data)
    errors = get_response_errors(response.json())

    assert response.status_code == 400
    assert Quiz.objects.count() == 0
    assert "Something went wrong" in errors
    assert mock_download.call_count == 1


@pytest.mark.django_db(True)
def test_post_quiz_not_auth(api_client: APIClient) -> None:
    """
    Test that a POST request from an unauthenticated user with returns 401
    """
    response = api_client.post(reverse("quiz-create"), {})
    assert response.status_code == 401


# Endpoint for a User's Quiz
@pytest.mark.django_db(True)
def test_get_user_quizzes(quiz: Quiz, api_client: APIClient):
    """
    Test that GET request to endpoint for user's specific quiz w/ an authenticated
    user returns 200 and the quiz details
    """
    user = quiz.user

    api_client.force_authenticate(user=user)
    response = api_client.get(
        reverse("user_quizzes", kwargs={"user_id": user.id, "quiz_id": quiz.id})
    )
    response_quiz = response.json()

    assert response.status_code == 200
    assert len(response_quiz) == 1
    assert response_quiz[0]["id"] == quiz.id


@pytest.mark.django_db(True)
def test_quiz_add_questions(quiz: Quiz, api_client: APIClient):
    """
    Test that a POST request to endpoint for user's specific quiz w/ questions
    and answers returns 200 and the updated quiz
    """
    user = quiz.user
    prev_num_questions = Question.objects.filter(quiz=quiz).count()

    data = {
        "questions": [
            {
                "question": "What is one 1+1?",
                "answers": ["1", "2", "3"],
                "correct_answers": ["1"],
                "timestamp": "00:00",
            }
        ]
    }

    api_client.force_authenticate(user=user)
    response = api_client.post(
        reverse("user_quizzes", kwargs={"user_id": user.id, "quiz_id": quiz.id}),
        json.dumps(data),
        content_type="application/json",
    )
    updated_quiz = response.json()["quiz"]

    assert response.status_code == 200
    assert updated_quiz["id"] == quiz.id
    assert (
        len(updated_quiz["questions"]) == prev_num_questions + 1
    )  # added one question via POST


@pytest.mark.django_db(True)
def test_quiz_add_no_questions(quiz: Quiz, api_client: APIClient):
    """
    Test that a POST request to endpoint for user's specific quiz w/ no questions
    returns and error and the correct error message
    """
    user = quiz.user
    data = {"questions": []}

    api_client.force_authenticate(user=user)
    response = api_client.post(
        reverse("user_quizzes", kwargs={"user_id": user.id, "quiz_id": quiz.id}), data
    )

    assert response.status_code == 400
    assert "No questions provided." in response.json()["error"]


# Questions for user's quiz endpoint


@pytest.mark.django_db(True)
def test_get_other_user_questions(quiz: Quiz, api_client: APIClient):
    """
    Test that a user trying to access the questions of another user
    returns a 403 response
    """
    other_user = custom_user(username="other_user", email="other.user@gmail.com")

    api_client.force_authenticate(quiz.user)
    response = api_client.get(
        reverse(
            "user_quiz_questions", kwargs={"user_id": other_user.id, "quiz_id": quiz.id}
        )
    )

    assert response.status_code == 403


@pytest.mark.django_db(True)
def test_get_quiz_questions(quiz: Quiz, api_client: APIClient):
    """
    Test that a user trying to access the questions for one of the quizzes
    returns a 200 response and the questions
    """
    user = quiz.user

    api_client.force_authenticate(quiz.user)
    response = api_client.get(
        reverse("user_quiz_questions", kwargs={"user_id": user.id, "quiz_id": quiz.id})
    )

    response_question = response.json()

    assert response.status_code == 200
    assert len(response_question) == 1
    assert response_question[0]["quiz"] == quiz.id
