# from django.shortcuts import render
from rest_framework import permissions, viewsets
from api.serializers import UserSerializer
from .models import User


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint which allows user to be viewed or edited"""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
