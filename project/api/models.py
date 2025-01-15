from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Model representing system User"""

    email = models.EmailField(
        verbose_name="email address",
        unique=True,
        max_length=255,
        blank=False,  # Email required on forms
    )

    def as_dict(self):
        """Returns representation of user as a dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
