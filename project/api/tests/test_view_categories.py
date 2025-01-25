import pytest
from api.models import User, Category
from rest_framework.test import APIClient
from .conftest import get_response_errors


@pytest.mark.django_db(True)
def test_post_category_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a POST request from an authenticated user with a valid category name
    returns a 201 response and creates a Category with that name
    """
    data = {"name": "New Category", "user": standard_user.id}
    api_client.force_authenticate(user=standard_user)

    response = api_client.post("/api/categories/", data)
    print(Category.objects.all())

    assert response.status_code == 201
    assert Category.objects.filter(name=data["name"]).exists()


@pytest.mark.django_db(True)
def test_post_category_not_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a POST request from an unauthenticated user with a valid category name
    returns a 401 response and doesn't create a new Category
    """
    data = {"name": "New Category", "user": standard_user.id}

    response = api_client.post("/api/categories/", data)

    assert response.status_code == 401
    assert not Category.objects.filter(name=data["name"]).exists()


@pytest.mark.django_db(True)
@pytest.mark.parametrize(
    "name, expected",
    [
        ("", "This field may not be blank."),
        (
            "a very long and invalid category name",
            "Ensure this field has no more than 30 characters.",
        ),
    ],
)
def test_post_invalid_signup(
    api_client: APIClient, standard_user: User, name: str, expected: str
) -> None:
    """
    Test that sending a POST request with an invalid category name
    returns a 400 response and shows the correct error messages
    """
    data = {"name": name, "user": standard_user.id}

    response = api_client.post("/api/categories/", data)
    errors = get_response_errors(response)

    assert response.status_code == 400
    assert expected in errors
