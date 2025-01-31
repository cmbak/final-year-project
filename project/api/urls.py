from api.views import (
    category_list_create_view,
    current_user_view,
    label_create_view,
    quiz_create_view,
    user_categories_view,
    user_labels_view,
    user_list_create_view,
    user_quizzes_view,
)
from django.urls import path

urlpatterns = [
    path(
        "users/<int:user_id>/categories/",
        user_categories_view,
        name="user-categories",
    ),
    path(
        "users/<int:user_id>/categories/<int:cat_id>/",
        user_quizzes_view,
        name="user-quizzes",
    ),
    path("users/<int:user_id>/labels/", user_labels_view, name="user-labels"),
    path("users/", user_list_create_view, name="user-list-create"),
    path("current-user/", current_user_view, name="current-user"),
    path("categories/", category_list_create_view, name="create-categories"),
    path("labels/", label_create_view, name="label-create"),
    path("quizzes/", quiz_create_view, name="quiz-create"),
]
