import pytest
from rest_framework.test import APIClient
from .test_view_signup import get_response_errors

invalid_logins = [
    ("username", "", "This field may not be blank."),
    ("", "password", "This field may not be blank."),
    ("username", "password", "Invalid username or password"),
]


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
    errors = get_response_errors(response)

    assert response.status_code == 400
    assert expected in errors
