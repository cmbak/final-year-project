import pytest
from api.models import User, Category, Label
from django.db.utils import IntegrityError

from .conftest import custom_user


@pytest.mark.django_db(True)
def test_create_user(
    standard_user: User, username: str, email: str, password: str
) -> None:
    """Test user creation functionality with valid user details"""
    user = standard_user
    assert user.username == username
    assert user.email == email
    assert user.password == password


@pytest.mark.django_db(True)
def test_unique_user_username(standard_user: User) -> None:
    """
    Test that creating a user with the same username as an existing user is not allowed
    """
    with pytest.raises(IntegrityError):
        custom_user(email="john.doe@gmail.com")


@pytest.mark.django_db(True)
def test_unique_user_email(standard_user: User) -> None:
    """
    Test that creating a user with the same email as an exisiting user is not allowed
    """
    with pytest.raises(IntegrityError):
        custom_user(username="John Doe")


@pytest.mark.django_db(True)
def test_user_string(standard_user: User) -> None:
    """
    Test that string method of User returns the correctly formatted string:
    ``` username (email) ```
    """
    assert str(standard_user) == f"{standard_user.username} ({standard_user.email})"


@pytest.mark.django_db(True)
def test_category_valid_fields(standard_user: None) -> None:
    """Test category creation functionality with valid name and user"""
    category = Category.objects.create(name="category", user=standard_user)
    assert category.name == "category"
    assert category.user == standard_user


@pytest.mark.django_db(True)
def test_category_name_unique(standard_user: User) -> None:
    """Test that the name of a category should be unique irrespective of case"""
    Category.objects.create(name="category", user=standard_user)
    with pytest.raises(IntegrityError):
        Category.objects.create(name="Category", user=standard_user)


@pytest.mark.django_db(True)
def test_category_cascade_on_user_deletion() -> None:
    """
    Test that a category gets deleted when the user its foreign key
    references also gets deleted
    """
    user = custom_user(username="john_doe")
    Category.objects.create(name="Fun Category", user=user)

    user.delete()

    assert not User.objects.filter(username="john_due").exists()
    assert not Category.objects.filter(name="Fun Category").exists()
    assert Category.objects.count() == 0


@pytest.mark.django_db(True)
def test_category_string(standard_user: User) -> None:
    """
    Test that the Category string method returns the name of the category
    """
    category = Category.objects.create(name="Fun Category", user=standard_user)
    assert str(category) == category.name


# TODO what happens to related model instances when category is deleted?


@pytest.mark.django_db(True)
def test_label_valid_fields() -> None:
    """Test label creation functionality with valid label name"""
    label = Label.objects.create(name="label")
    assert label.name == "label"


@pytest.mark.django_db(True)
def test_label_name_unique() -> None:
    """Test that the name of a label should be unique irrespective of case"""
    Label.objects.create(name="label")
    with pytest.raises(IntegrityError):
        Label.objects.create(name="LABEL")


@pytest.mark.django_db(True)
def test_label_string() -> None:
    """Test that the Label string method returns the label name"""
    label = Label.objects.create(name="label")
    assert str(label) == label.name
