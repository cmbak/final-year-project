import pytest
from api.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db(True)
def test_get_logout_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a GET request from an logged in user logs out the user
    and returns a 200 response
    """
    api_client.force_authenticate(user=standard_user)

    response = api_client.post("/logout/")

    assert response.status_code == 200
    assert response.json()["user"] == "AnonymousUser"


def test_get_logout_not_auth(api_client: APIClient) -> None:
    """
    Test that a GET request from an anonymous user (i.e. not logged in)
    returns a 401 response
    """
    response = api_client.post("/logout/")

    assert response.status_code == 401
