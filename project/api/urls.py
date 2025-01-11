from api.views import user_list_create_view
from django.urls import path

urlpatterns = [
    path("users/", user_list_create_view, name="user-list-create"),
]
