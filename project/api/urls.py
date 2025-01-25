from api.views import current_user_view, user_list_create_view, create_category_view
from django.urls import path

urlpatterns = [
    path("users/", user_list_create_view, name="user-list-create"),
    path("current-user/", current_user_view, name="current-user"),
    path("categories/", create_category_view, name="create-categories"),
]
