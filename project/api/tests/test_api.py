import pytest
from api.models import Category, Label, Quiz, User
from rest_framework.test import APIClient

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


# Categories API Endpoint
@pytest.mark.django_db(True)
def test_get_category_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a GET request from an authenticated user
    returns a 200 response and lists the categories
    """
    api_client.force_authenticate(user=standard_user)

    response = api_client.get("/api/categories/")
    categories = response.json()["results"]

    assert response.status_code == 200
    assert len(categories) == Category.objects.count()


@pytest.mark.django_db(True)
def test_get_category_not_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a GET request from an unauthenticated user returns a 401 response
    """
    response = api_client.get("/api/categories/")

    assert response.status_code == 401


@pytest.mark.django_db(True)
def test_post_category_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a POST request from an authenticated user with a valid category name
    returns a 201 response and creates a Category with that name
    """
    data = {"name": "New Category", "user": standard_user.id}
    api_client.force_authenticate(user=standard_user)

    response = api_client.post("/api/categories/", data)

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
def test_post_invalid_category(
    api_client: APIClient, standard_user: User, name: str, expected: str
) -> None:
    """
    Test that sending a POST request with an invalid category name
    returns a 400 response and shows the correct error messages
    """
    data = {"name": name, "user": standard_user.id}
    api_client.force_authenticate(user=standard_user)

    response = api_client.post("/api/categories/", data)
    errors = get_response_errors(response)

    assert response.status_code == 400
    assert expected in errors


# Creating Quiz


@pytest.mark.django_db(True)
def test_post_quiz_auth(
    standard_user: User,
    api_client: APIClient,
) -> None:
    """
    Test that a POST request from an authenticated user with valid quiz details
    returns 201 and creates a quiz with those details
    """
    label_one = Label.objects.create(name="Label One", user=standard_user)
    label_two = Label.objects.create(name="Label Two", user=standard_user)
    category = Category.objects.create(name="Category", user=standard_user)

    data = {
        "title": "Test Quiz",
        "labels": [label_one.id, label_two.id],
        "category": category.id,
        "user": standard_user.id,
    }
    api_client.force_authenticate(user=standard_user)

    response = api_client.post("/api/quizzes/", data)

    assert response.status_code == 201
    assert Quiz.objects.count() == 1


@pytest.mark.django_db(True)
def test_post_quiz_not_auth(standard_user: User, api_client: APIClient) -> None:
    """
    Test that a POST request from an unauthenticated user with returns 401
    """
    response = api_client.post("/api/quizzes/", {})
    assert response.status_code == 401


@pytest.mark.django_db(True)
def test_post_quiz_other_user_labels(
    standard_user: User, api_client: APIClient
) -> None:
    """
    Test that a POST request from an authenticated user with a quiz containing
    labels created by another user returns 400 and doesn't create the quiz
    """
    other_user = custom_user(username="other_user", email="other.user@gmail.com")
    category = Category.objects.create(name="Category", user=standard_user)
    label = Label.objects.create(name="other label", user=other_user)
    data = {
        "title": "Title",
        "labels": [label.id],
        "category": category.id,
        "user": standard_user.id,
    }
    api_client.force_authenticate(user=standard_user)

    response = api_client.post("/api/quizzes/", data)

    assert response.status_code == 400
    assert Quiz.objects.count() == 0


@pytest.mark.django_db(True)
def test_post_quiz_other_user_categories(
    standard_user: User, api_client: APIClient
) -> None:
    """
    Test that a POST request from an authenticated user with a quiz containing
    a category created by another user returns 400 and doesn't create the quiz
    """
    other_user = custom_user(username="other_user", email="other.user@gmail.com")
    category = Category.objects.create(name="Other Category", user=other_user)
    data = {
        "title": "Title",
        "labels": [],
        "category": category.id,
        "user": standard_user.id,
    }
    api_client.force_authenticate(user=standard_user)

    response = api_client.post("/api/quizzes/", data)

    assert response.status_code == 400
    assert Quiz.objects.count() == 0


# Users/id/categories/ endpoint


@pytest.mark.django_db(True)
def test_get_user_catgories_auth(api_client: APIClient, standard_user: User) -> None:
    """
    Test that a GET request to the user categories endpoint with an authenticated user
    returns 200 and their categories
    """
    Category.objects.create(name="standard category", user=standard_user)
    api_client.force_authenticate(user=standard_user)

    response = api_client.get(f"/api/users/{standard_user.id}/categories/")
    cat_user_ids = {
        category["user"] for category in response.json()
    }  # Set of all the categories user ids

    assert response.status_code == 200
    assert (
        len(response.json()) == Category.objects.filter(user=standard_user.id).count()
    )
    assert len(cat_user_ids) == 1  # Only one id...
    assert standard_user.id in cat_user_ids  # ... which is user's id


@pytest.mark.django_db(True)
def test_get_user_catgories_not_auth(
    api_client: APIClient, standard_user: User
) -> None:
    """
    Test that a GET request to the user categories endpoint with an unauthorised
    returns 401
    """
    response = api_client.get(f"/api/users/{standard_user.id}/categories/")

    assert response.status_code == 401


@pytest.mark.django_db(True)
def test_get_user_catgories_other_user(
    api_client: APIClient, standard_user: User
) -> None:
    """
    Test that a GET request to the endpoint for A DIFFERENT user's categories
    with an authorised user returns 403
    """
    other_id = standard_user.id + 1  # different id to standard_user's id
    api_client.force_authenticate(user=standard_user)
    response = api_client.get(f"/api/users/{other_id}/categories/")

    assert standard_user.id != other_id
    assert response.status_code == 403


# User's labels


@pytest.mark.django_db(True)
def test_get_user_labels_auth(standard_user: User, api_client: APIClient) -> None:
    """
    Test that a GET request to the user labels endpoint with an authenticated user
    returns 200 and their labels
    """
    Label.objects.create(name="new label", user=standard_user)
    api_client.force_authenticate(user=standard_user)

    response = api_client.get(f"/api/users/{standard_user.id}/labels/")
    labels = response.json()
    labels_user_ids = {label["user"] for label in labels}  # unique

    assert response.status_code == 200
    assert len(labels) == Label.objects.filter(user=standard_user).count()
    assert len(labels_user_ids) == 1  # only one id
    assert standard_user.id in labels_user_ids  # user's id


@pytest.mark.django_db(True)
def test_get_user_labels_not_auth(standard_user: User, api_client: APIClient) -> None:
    """
    Test that a GET request to the user labels endpoint with an unauthenticated user
    returns 401
    """
    Label.objects.create(name="new label", user=standard_user)

    response = api_client.get(f"/api/users/{standard_user.id}/labels/")

    assert response.status_code == 401


@pytest.mark.django_db(True)
def test_get_user_labels_other_user(standard_user: User, api_client: APIClient) -> None:
    """
    Test that a GET request to the user labels endpoint with an authenticated user
    for a different user's labels with an authorised user returns 403
    """
    Label.objects.create(name="new label", user=standard_user)
    api_client.force_authenticate(user=standard_user)

    response = api_client.get(f"/api/users/{standard_user.id+1}/labels/")

    assert response.status_code == 403


# User's quizzes in specified category


@pytest.mark.django_db(True)
def test_get_user_quiz_by_category_auth(api_client: APIClient, quiz: Quiz) -> None:
    """Test that a GET request to the user quiz-by-categories endpoint
    with an authenticated user returns 200 and their quizzes"""
    user = quiz.user
    api_client.force_authenticate(user=user)

    response = api_client.get(f"/api/users/{user.id}/categories/{quiz.category.id}/")
    response_quiz = response.json()[0]

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response_quiz["id"] == quiz.id
    assert response_quiz["category"] == quiz.category.id


@pytest.mark.django_db(True)
def test_get_user_quiz_by_category_not_auth(api_client: APIClient, quiz: Quiz) -> None:
    """Test that a GET request to the user quiz-by-categories endpoint
    with an unauthenticated user returns 401"""
    response = api_client.get(
        f"/api/users/{quiz.user.id}/categories/{quiz.category.id}/"
    )

    assert response.status_code == 401


@pytest.mark.django_db(True)
def test_get_user_quiz_by_category_other_user(
    api_client: APIClient, quiz: Quiz
) -> None:
    """Test that a GET request to the user quiz-by-categories endpoint
    with an authenticated user returns 403 and no quizzes"""
    api_client.force_authenticate(user=quiz.user)

    response = api_client.get(
        f"/api/users/{quiz.user.id+1}/categories/{quiz.category.id}/"
    )

    assert response.status_code == 403
    assert len(response.json()) == 1
    assert response.json()["error"] == "You cannot access this"
