from api.views import (
    category_list_create_view,
    current_user_view,
    label_create_view,
    quiz_create_view,
    user_categories_view,
    user_labels_view,
    user_list_create_view,
    user_quiz_questions,
    user_quizzes_by_cat_view,
    user_quizzes_view,
    user_all_quizzes_view,
    user_question_answers,
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
    path(
        "users/<int:user_id>/questions/<int:question_id>/answers/",  # noqa e501
        user_question_answers,
        name="user_question_answers",
    ),
    path(
        "users/<int:user_id>/categories/",
        user_categories_view,
        name="user-categories",
    ),
    path(
        "users/<int:user_id>/categories/<int:cat_id>/",
        user_quizzes_by_cat_view,
        name="user_quizzes_by_category",
    ),
    path("users/<int:user_id>/labels/", user_labels_view, name="user-labels"),
    path("users/", user_list_create_view, name="user-list-create"),
    path("current-user/", current_user_view, name="current-user"),
    path("categories/", category_list_create_view, name="create-categories"),
    path("labels/", label_create_view, name="label-create"),
    path("quizzes/", quiz_create_view, name="quiz-create"),
]
