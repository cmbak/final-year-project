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

    def __str__(self):
        """Return string representation of user"""
        return f"{self.username} ({self.email})"

    def as_dict(self):
        """Return representation of user as a dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }


class Category(models.Model):
    """Model representing a quiz category"""

    name = models.CharField(max_length=30, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        """Metadata for Category model"""

        constraints = [
            models.UniqueConstraint(
                models.functions.Lower("name"),  # Irrespective of case
                name="unique category name",
            )
        ]

    def __str__(self):
        """Return string representation of category"""
        return self.name


class Label(models.Model):
    """Model representing a quiz label"""

    name = models.CharField(max_length=15, unique=True)

    class Meta:
        """Metadata for Label model"""

        constraints = [
            models.UniqueConstraint(
                models.functions.Lower("name"), name="unique label name"
            )
        ]

    def __str__(self):
        """Return string representation of label"""
        return self.name


class Quiz(models.Model):
    """Model representing a quiz"""

    title = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    labels = models.ManyToManyField(Label, related_name="quiz")

    class Meta:
        """Metadata for Quiz model"""

        constraints = [
            models.UniqueConstraint(
                models.functions.Lower("title"), name="unique quiz title"
            )
        ]
