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

    def as_dict(self):
        """Return dictionary representation of category"""
        # user = User.objects.get(id=self.user)
        return {"id": self.id, "name": self.name, "user": self.user}


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

    def __str__(self):
        """Returns string representation of quiz"""
        label_names = ""
        all_labels: list[Label] = self.labels.all()

        # Format as label | label2 | label3 etc.
        for i, l in enumerate(all_labels):
            label_names += l.name
            if i != len(all_labels) - 1:
                label_names += ", "

        return f"{self.title} | {self.category.name} | {label_names} | {self.user.username}"  # noqa e501
