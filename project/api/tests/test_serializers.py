import pytest
from api.serializers import UserSerializer

from .test_models import create_db_user


def test_email_already_exists():
    pass


def test_password_too_short():
    pass


def test_password_too_long():
    pass


@pytest.mark.django_db(True)
def test_valid_user():
    user = create_db_user()
    serializer = UserSerializer(instance=user)
    assert serializer.data == user.as_dict()
