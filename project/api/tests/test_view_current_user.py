import pytest
from api.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db(True)
def test_get_current_user_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a GET request from an authenticated user
    returns a 200 response and the user for the current session
    """
    api_client.force_authenticate(user=standard_user)

    response = api_client.get("/api/current-user/")
    user = response.json()["user"]

    assert response.status_code == 200
    assert user == standard_user.as_dict()


def test_get_current_user_not_auth(api_client: APIClient) -> None:
    """Test that a GET request from an unauthenticated user returns a 401 response"""
    response = api_client.get("/api/current-user/")

    assert response.status_code == 401
