# from django.shortcuts import render
from rest_framework import permissions, generics
from api.serializers import UserSerializer
from .models import User


class UserAPIView(generics.ListAPIView):
    """API endpoint which retrieves a list of all Users"""

    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


user_list_view = UserAPIView.as_view()
