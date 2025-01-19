from api.serializers import LoginSerializer, UserSerializer
from decouple import config
from django.contrib.auth import login
from django.http.response import HttpResponseRedirectBase, JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User


class HttpResponseSeeOther(HttpResponseRedirectBase):
    """Redirect using 303 See Other"""

    status_code = 303


class UserListCreateAPIView(generics.ListCreateAPIView):
    """API endpoint for retrieving users or creating a user"""

    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


user_list_create_view = UserListCreateAPIView.as_view()


class SignupView(APIView):
    """
    View for user to signup and create user account from form details
    and get redirected to main page
    """

    renderer_classes = [TemplateHTMLRenderer]
    template_name = "signup.html"
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Handle GET request to signup page"""
        serializer = UserSerializer
        return Response({"serializer": serializer}, status=status.HTTP_200_OK)

    def post(self, request):
        """Handle POST request to signup page"""

        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            # Show invalid field errors to user
            return Response(
                {"serializer": serializer, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()
        login(request, user)
        return HttpResponseSeeOther(config("FRONTEND_URL"))


user_signup_view = SignupView.as_view()


class LoginView(APIView):
    """View for user to login with their details and be redirected to main page"""

    renderer_classes = [TemplateHTMLRenderer]
    template_name = "login.html"
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Handle GET request to login page"""
        serializer = LoginSerializer()
        return Response({"serializer": serializer}, status=status.HTTP_200_OK)

    def post(self, request):
        """Handle POST request to login page"""
        # Check if form data is valid
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            # Show errors on form
            return Response(
                {"serializer": serializer, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, User.objects.get(username=request.data["username"]))
        return HttpResponseSeeOther(config("FRONTEND_URL"))


user_login_view = LoginView.as_view()


class CurrentUserView(APIView):
    """View for retriving the details of the currently signed in user"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Handle GET request to current user page"""
        print(request.user)
        print(request.user.is_authenticated)
        return JsonResponse({"user": request.user.as_dict()})


current_user_view = CurrentUserView.as_view()
