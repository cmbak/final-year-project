from api.views import (
    current_user_view,
    category_list_create_view,
    user_list_create_view,
    label_list_create_view,
)
from django.urls import path

urlpatterns = [
    path("users/", user_list_create_view, name="user-list-create"),
    path("current-user/", current_user_view, name="current-user"),
    path("categories/", category_list_create_view, name="create-categories"),
    path("labels/", label_list_create_view, name="label-list-create"),
]
