from api.serializers import UserSerializer
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.renderers import TemplateHTMLRenderer

from rest_framework import response

from .models import User


class UserListCreateAPIView(generics.ListCreateAPIView):
    """API endpoint for retrieving users or creating a user"""

    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


user_list_create_view = UserListCreateAPIView.as_view()


class SignupView(APIView):
    """View for user to signup and create user account from form details"""

    renderer_classes = [TemplateHTMLRenderer]
    template_name = "signup.html"
    permission_classes = [permissions.AllowAny]
    style = {"template_pack": "rest_framework/vertical/"}  # TODO delete

    def get(self, request):
        """Handle GET request to signup page"""
        serializer = UserSerializer
        return response.Response({"serializer": serializer, "style": self.style})

    def post(self, request):
        """Handle POST request to signup page"""
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            # Show invalid field errors to user
            return response.Response({"serializer": serializer})
        serializer.save()
        # TODO redirect to login page


user_signup_view = SignupView.as_view()
