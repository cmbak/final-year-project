from api.views import user_list_create_view, current_user_view
from django.urls import path

urlpatterns = [
    path("users/", user_list_create_view, name="user-list-create"),
    path("current-user/", current_user_view, name="current-user"),
]
