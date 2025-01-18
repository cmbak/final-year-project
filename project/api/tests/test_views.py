import pytest
from api.models import User
from rest_framework.test import APIClient

# Signup View


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
    Test that sending a POST request to the signup page
    with valid user data returns a 303 response
    and creates a new user with those details
    """
    data = {
        "username": "new_user",
        "email": "new.user@gmail.com",
        "password": "password1@",
    }

    response = api_client.post("/signup/", data)

    assert User.objects.filter(username=data["username"]).exists()
    assert response.status_code == 303


# Login View


@pytest.mark.django_db(True)
def test_post_valid_login(api_client: APIClient) -> None:
    """
    Test that sending a POST request to the login page with valid user data
    returns a 303 response and redirects the user to the main page
    """
    # Create user to be logged in by signing up
    api_client.post(
        "/signup/",
        {
            "username": "new_user",
            "email": "new_user@gmail.com",
            "password": "password1@",
        },
    )
    # Data for POST
    data = {"username": "new_user", "password": "password1@"}

    response = api_client.post("/login/", data)

    assert response.status_code == 303
    assert "new url" == "main page"


invalid_logins = [
    ("username", "", "This field may not be blank."),
    ("", "password", "This field may not be blank."),
    ("username", "password", "Invalid username or password"),
]


@pytest.mark.django_db(True)
@pytest.mark.parametrize("username, password, expected", invalid_logins)
def test_post_invalid_login(
    api_client: APIClient, username: str, password: str, expected: str
) -> None:
    """
    Test that sending a POST requets to the login page with invalid user data
    returs a 400 response and shows the correct error message
    """
    data = {"username": username, "password": password}

    response = api_client.post("/login/", data)
    errors = response.data["errors"]
    all_errors = []

    if errors.get("username") is not None:
        for e in errors.get("username"):
            all_errors.append(str(e))

    if errors.get("password") is not None:
        for e in errors.get("password"):
            all_errors.append(str(e))

    assert response.status_code == 400
    assert expected in all_errors


# TODO e2e testing for specific form errors...
