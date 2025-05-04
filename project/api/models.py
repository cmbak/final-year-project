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


class Quiz(models.Model):
    """Model representing a quiz"""

    YOUTUBE = "YT"
    UPLOAD = "UP"
    VIDEO_TYPE_CHOICES = {YOUTUBE: "Youtube", UPLOAD: "Upload"}

    title = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(
        max_length=7, choices=VIDEO_TYPE_CHOICES
    )  # Used to see if timestamp should be displayed or not
    embed_url = models.CharField(unique=False, blank=True, null=True)
    thumbnail_url = models.CharField(unique=False, blank=True, null=True)
    file_name = models.CharField(blank=True)
    # blank=True since field gets populated after quiz is created

    class Meta:
        """Metadata for Quiz model"""

        constraints = [
            models.UniqueConstraint(
                models.functions.Lower("title"), name="unique_quiz_title"
            )
        ]

    def save(self, *args, **kwargs):
        """Override save method so full_clean() (and thefore clean()) can be called"""
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        """Returns string representation of quiz"""
        return f"{self.title} | {self.type} | {self.user.username}"  # noqa e501

    def as_dict(self):
        """Returns dictionary representation of quiz"""
        return {
            "id": self.id,
            "title": self.title,
            "user": self.user.id,
            "questions": [
                question.as_dict() for question in Question.objects.filter(quiz=self.id)
            ],
            "type": self.type,
            "thumbnail_url": self.thumbnail_url,
            "file_name": self.file_name,
        }


class Question(models.Model):
    """Model representing a quiz's questions"""

    question = models.CharField()
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    timestamp = models.CharField(default="00:00")

    def as_dict(self):
        """Return dict representation of question"""
        return {
            "id": self.id,
            "question": self.question,
            "answers": [
                answer.as_dict() for answer in Answer.objects.filter(question=self)
            ],
            "correct_answers": [
                answer.as_dict()
                for answer in Answer.objects.filter(
                    question=self, correct_answer_for=self
                )
            ],
            "timestamp": self.timestamp,
        }


class Answer(models.Model):
    """Model representing a question answer"""

    answer = models.CharField()
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answer_to_question"
    )
    correct_answer_for = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="correct_answer_to_question",  # TODO shouldn't be required!
        default=None,
        null=True,
    )

    def as_dict(self):
        """Return dict representation of answer"""
        return {"id": self.id, "answer": self.answer}


class Attempt(models.Model):
    """Model representing a quiz attempt"""

    date = models.DateField()
    score = models.IntegerField()  # /10
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def as_dict(self):
        """Return dict rep of attempt"""
        return {
            "id": self.id,
            "date": self.date,
            "score": self.score,
            "quiz": self.quiz.as_dict(),
            "user": self.user.as_dict(),
        }
