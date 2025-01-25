import pytest
from api.models import User
from decouple import config
from rest_framework.test import APIClient
from .conftest import get_response_errors

invalid_signup_data = [
    (
        "new user",
        "new@gmail.com",
        "password1@",
        "Enter a valid username. This value may contain only letters, numbers,"
        " and @/./+/-/_ characters.",
    ),
    ("new_user", "new.gmail.com", "password1@", "Enter a valid email address."),
    (
        "new_user",
        "new@gmail.com",
        "password",
        "Your password must contain at least one digit from 0-9 and one character"
        " from @+-_!?.",
    ),
    (
        "new_user",
        "new@gmail.com",
        "password1",
        "Your password must contain at least one digit from 0-9 and one character"
        " from @+-_!?.",
    ),
    (
        "new_user",
        "new@gmail.com",
        "short",
        "Ensure this field has at least 8 characters.",
    ),
    (
        "new_user",
        "new@gmail.com",
        "verylongpassword1@",
        "Ensure this field has no more than 16 characters.",
    ),
]


@pytest.mark.parametrize("path", [("/signup/"), ("/login/")])
def test_get_signup(path: str, api_client: APIClient) -> None:
    """
    Test that sending a GET request to the signup/login page returns a 200 response
    """
    response = api_client.get(path)

    assert response.status_code == 200


@pytest.mark.django_db(True)
def test_post_valid_signup(api_client: APIClient) -> None:
    """
    Test that sending a POST request to the signup page with valid user data
    returns a 303 response and creates a new user with those details
    """
    data = {
        "username": "new_user",
        "email": "new.user@gmail.com",
        "password": "password1@",
    }

    response = api_client.post("/signup/", data)

    assert User.objects.filter(username=data["username"]).exists()
    assert response.status_code == 303
    assert response.url == config("FRONTEND_URL")


@pytest.mark.django_db(True)
@pytest.mark.parametrize("username, email, password, expected", invalid_signup_data)
def test_post_invalid_signup(
    api_client: APIClient, username: str, email: str, password: str, expected: str
) -> None:
    """
    Test that sending a POST request to the signup page with invalid user data
    returns a 400 response and shows the correct error messages
    """
    data = {"username": username, "email": email, "password": password}

    response = api_client.post("/signup/", data)
    errors = get_response_errors(response)

    assert response.status_code == 400
    assert expected in errors
