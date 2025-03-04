from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
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
                name="unique_category_name",
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
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        """Metadata for Label model"""

        constraints = [
            models.UniqueConstraint(
                models.functions.Lower("name"), name="unique_label_name"
            )
        ]

    def __str__(self):
        """Return string representation of label"""
        return self.name

    def as_dict(self):
        """Return dict representation of label"""
        return {"id": self.id, "name": self.name}


class Quiz(models.Model):
    """Model representing a quiz"""

    title = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    labels = models.ManyToManyField(Label, related_name="quiz", through="QuizLabels")

    class Meta:
        """Metadata for Quiz model"""

        constraints = [
            models.UniqueConstraint(
                models.functions.Lower("title"), name="unique_quiz_title"
            )
        ]

    def clean(self, *args, **kwargs):
        """
        Validate that quiz and label/category user are the same
        (i.e. user using own labels/category)
        """
        if self.user != self.category.user:
            raise ValidationError(
                {"category": ["You must use a category that you have created."]}
            )

    def save(self, *args, **kwargs):
        """Override save method so full_clean() (and thefore clean()) can be called"""
        self.full_clean()
        return super().save(*args, **kwargs)

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

    def as_dict(self):
        """Returns dictionary representation of quiz"""
        return {
            "id": self.id,
            "title": self.title,
            "user": self.user.id,
            "category": self.category.id,
            "labels": [label.as_dict() for label in self.labels.all()],
            "questions": [
                question.as_dict() for question in Question.objects.filter(quiz=self.id)
            ],
        }


class QuizLabels(models.Model):
    """Intermediate model between Quiz and Labels"""

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    label = models.ForeignKey(Label, on_delete=models.CASCADE)


class Question(models.Model):
    """Model representing a quiz's questions"""

    question = models.CharField(max_length=255)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    correct_answer = models.OneToOneField(
        "Answer",  # Have to put in quotes otherwise throws undefined
        on_delete=models.CASCADE,
        related_name="correct_answer",
        null=True,  # noqa E501 So that questions and answer instance can be made simult; See views.py
    )

    def as_dict(self):
        """Return dict representation of question"""
        return {
            "id": self.id,
            "question": self.question,
            "answers": [
                answer.as_dict() for answer in Answer.objects.filter(question=self)
            ],
            "correct_answer": self.correct_answer.id,
        }


class Answer(models.Model):
    """Model representing a question answer"""

    answer = models.CharField(max_length=128)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answer_to_question"
    )

    def as_dict(self):
        """Return dict representation of answer"""
        return {"id": self.id, "answer": self.answer}
