import pytest
from rest_framework.test import APIClient


# Signup View


def test_get_signup(api_client: APIClient) -> None:
    """Test that sending a GET request to the signup page returns a 200 response"""
    response = api_client.get("/signup/")

    assert response.status_code == 200


@pytest.mark.django_db(True)
def test_post_valid_signup(api_client: APIClient) -> None:
    """
    Test that sending a POST request to the signup page
    with valid user data returns a 303 response
    """
    data = {
        "username": "new_user",
        "email": "new.user@gmail.com",
        "password": "password1@",
    }

    response = api_client.post("/signup/", data)

    assert response.status_code == 303


# e2e testing for specific form errors...
