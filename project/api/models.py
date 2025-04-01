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

    YOUTUBE = "YT"
    UPLOAD = "UP"
    VIDEO_TYPE_CHOICES = {YOUTUBE: "Youtube", UPLOAD: "Upload"}

    title = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    labels = models.ManyToManyField(Label, related_name="quiz", through="QuizLabels")
    type = models.CharField(
        max_length=7, choices=VIDEO_TYPE_CHOICES
    )  # Used to see if timestamp should be displayed or not
    embed_url = models.CharField(unique=True, blank=True, null=True)

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
        label_names = ""
        all_labels: list[Label] = self.labels.all()

        # Format as label | label2 | label3 etc.
        for i, l in enumerate(all_labels):
            label_names += l.name
            if i != len(all_labels) - 1:
                label_names += ", "

        return f"{self.title} | {self.type} | {label_names} | {self.user.username}"  # noqa e501

    def as_dict(self):
        """Returns dictionary representation of quiz"""
        return {
            "id": self.id,
            "title": self.title,
            "user": self.user.id,
            "labels": [label.as_dict() for label in self.labels.all()],
            "questions": [
                question.as_dict() for question in Question.objects.filter(quiz=self.id)
            ],
            "type": self.type,
        }


class QuizLabels(models.Model):
    """Intermediate model between Quiz and Labels"""

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    label = models.ForeignKey(Label, on_delete=models.CASCADE)


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
