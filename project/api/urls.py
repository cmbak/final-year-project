from django.urls import path

from api.views import user_list_create_view

urlpatterns = [
    path("users/", user_list_create_view, name="user-list-create"),
]
