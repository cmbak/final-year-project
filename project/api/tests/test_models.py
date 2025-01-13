import pytest
from api.models import User


@pytest.mark.django_db(True)
def test_create_user():
    """Test user creation functionality with valid user details"""
    user = User.objects.create(
        username="bob", email="bob@gmail.com", password="password1@"
    )
    assert user.username == "bob"
