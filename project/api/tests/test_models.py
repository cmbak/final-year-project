import pytest
from api.models import Category, Label, Quiz, User
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
def test_category_deleted_on_user_deletion() -> None:
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


@pytest.mark.django_db(True)
def test_quiz_valid_fields(quiz: Quiz, username: str) -> None:
    """Test quiz creation functionality with valid quiz fields"""
    assert quiz.title == "quiz"
    assert quiz.user.username == username
    assert quiz.category.name == "category"
    assert quiz.labels.filter(name="label").exists()


@pytest.mark.django_db(True)
def test_quiz_string(quiz: Quiz, username: str) -> None:
    """Test quiz string method returns the details of the quiz"""
    assert str(quiz) == f"quiz | category | label | {username}"


@pytest.mark.django_db(True)
def test_quiz_unique_title(quiz: Quiz) -> None:
    """Test that title of a quiz should be unique irrespective of case"""
    user = custom_user("new_user", "new_user@gmail.com")

    with pytest.raises(IntegrityError):
        Quiz.objects.create(
            title="quiz",
            user=user,
            category=Category.objects.create(name="category two"),
        )


@pytest.mark.django_db(True)
def test_quiz_label_deletion(quiz: Quiz) -> None:
    """
    Test that after a label is deleted,
    it's been removed from its (previously) associated quizzes
    """
    label = Label.objects.get(name="label")  # Created in fixture

    label.delete()

    assert quiz.labels.count() == 0


@pytest.mark.django_db(True)
def test_quiz_deleted_on_user_deletion(quiz: Quiz) -> None:
    """Test that after a user is deleted, their quizzes should also be deleted"""
    user = quiz.user

    user.delete()

    assert not Quiz.objects.filter(title="quiz").exists()
    assert Quiz.objects.count() == 0


@pytest.mark.django_db(True)
def test_quiz_category_null_on_category_deletion(quiz: Quiz) -> None:
    """
    Test that after a category is deleted, their quizzes should also be deleted
    """
    category = quiz.category

    category.delete()

    assert not Quiz.objects.filter(title="quiz").exists()
    assert Quiz.objects.count() == 0


# TODO after mvp maybe allow null categories?
