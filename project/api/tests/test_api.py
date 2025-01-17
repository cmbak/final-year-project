import pytest
from api.models import User
from rest_framework.test import APIClient

# Users API Endpoint


@pytest.mark.django_db(True)
def test_get_users_auth(standard_user: User, api_client: APIClient) -> None:
    """
    Test that an authenticated user sending a GET request to the users endpoint
    receives a 200 response and a list of all users
    """
    api_client.force_authenticate(user=standard_user)
    response = api_client.get("/api/users/")

    assert response.status_code == 200


@pytest.mark.django_db(True)
def test_get_users_not_auth(api_client: APIClient) -> None:
    """
    Test that an unauthenticated user sending a GET request to the users endpoint
    recieves a 403 response
    """
    api_client.force_authenticate(None)
    response = api_client.get("/api/users/")

    assert response.status_code == 403


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
    recieves a 403 response
    """
    api_client.force_authenticate(None)
    response = api_client.post("/api/users/")

    assert response.status_code == 403


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
