from api.views import (
    current_user_view,
    label_create_view,
    quiz_create_view,
    user_all_quizzes_view,
    user_labels_view,
    user_list_create_view,
    user_quiz_questions,
    user_quizzes_view,
)
from django.urls import path

urlpatterns = [
    path(
        "users/<int:user_id>/quizzes/", user_all_quizzes_view, name="user_all_quizzes"
    ),
    path(
        "users/<int:user_id>/quizzes/<int:quiz_id>/",
        user_quizzes_view,
        name="user_quizzes",
    ),
    path(
        "users/<int:user_id>/quizzes/<int:quiz_id>/questions/",
        user_quiz_questions,
        name="user_quiz_questions",
    ),
    path("users/<int:user_id>/labels/", user_labels_view, name="user-labels"),
    path("users/", user_list_create_view, name="user-list-create"),
    path("current-user/", current_user_view, name="current-user"),
    path("labels/", label_create_view, name="label-create"),
    path("quizzes/", quiz_create_view, name="quiz-create"),
]
