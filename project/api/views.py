from api.serializers import (
    CategorySerializer,
    LabelSerializer,
    LoginSerializer,
    QuestionSerializer,
    QuizSerializer,
    UserSerializer,
)
from decouple import config
from django.contrib.auth import login, logout
from django.core.exceptions import FieldError
from django.http.response import HttpResponseRedirectBase, JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView

from .models import Answer, Category, Label, Question, Quiz, User


def handle_invalid_serializer(serializer: ModelSerializer):
    """Returns response with code 400 containing serializer and its errors"""
    # Can be used to show errors on DJANGO forms
    return Response(
        {"serializer": serializer, "errors": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


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
            return handle_invalid_serializer(serializer)

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
            return handle_invalid_serializer(serializer)

        login(request, User.objects.get(username=request.data["username"]))
        return HttpResponseSeeOther(config("FRONTEND_URL"))


user_login_view = LoginView.as_view()


class CurrentUserView(APIView):
    """View for retriving the details of the currently signed in user"""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Handle GET request to current user page"""
        if request.user.is_anonymous:
            return JsonResponse({"user": {}})
        return JsonResponse({"user": request.user.as_dict()})


current_user_view = CurrentUserView.as_view()


class LogoutView(APIView):
    """View for logging out the currently signed in user"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Handle POST request to login page"""
        logout(request)
        return JsonResponse({"user": str(request.user)}, status=status.HTTP_200_OK)


logout_view = LogoutView.as_view()


class CreateSpecifyErrorsMixin:
    """
    Mixin similar to the CreateModelMixin, but the 'errors' key
    contains the serializer fields and their errors.
    This is instead of there just being the field names as keys,
    and the array of their error messages as the values.
    """

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return JsonResponse(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class CategoryListCreateView(CreateSpecifyErrorsMixin, generics.ListCreateAPIView):
    """API Endpoint for retrieving categories or creating a category"""

    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


category_list_create_view = CategoryListCreateView.as_view()


class LabelCreateView(CreateSpecifyErrorsMixin, generics.CreateAPIView):
    """API Endpoint for retrieving labels or creating a label"""

    queryset = Label.objects.all().order_by("id")
    serializer_class = LabelSerializer
    permission_classes = [permissions.IsAuthenticated]


label_create_view = LabelCreateView.as_view()


class QuizCreateView(CreateSpecifyErrorsMixin, generics.CreateAPIView):
    """API Endpoint for creating a quiz"""

    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]


quiz_create_view = QuizCreateView.as_view()


class UsersModelsMixins:
    """Mixin which returns the model instances which belong to the requested user"""

    def get(self, request, user_id, **field_names):
        # Check that id of user sending request is requesting their own data
        if user_id != request.user.id:
            return JsonResponse(
                {"error": "You cannot access this"}, status=status.HTTP_403_FORBIDDEN
            )  # TODO change message

        # Try getting models where user id is same as the one requesting
        try:
            queryset = self.queryset.filter(user=user_id, **field_names)
        except FieldError as e:
            # If model has no user field, then just filter by kwargs
            print(
                f"Error: {e}\nModel does not have a user field. Trying to filter without including user..."  # noqa e501
            )
            queryset = self.queryset.filter(**field_names)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserCategoryView(UsersModelsMixins, generics.ListAPIView):
    """
    API Endpoint which returns the categories a user has created
    given that they're trying to fetch their own categories
    """

    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


user_categories_view = UserCategoryView.as_view()


class UserLabelsView(UsersModelsMixins, generics.ListAPIView):
    """
    API Endpoint which returns the labels a user has created
    given that they're trying to fetch their own labels
    """

    queryset = Label.objects.all().order_by("id")
    serializer_class = LabelSerializer
    permission_classes = [permissions.IsAuthenticated]


user_labels_view = UserLabelsView.as_view()


class UserAllQuizzesView(UsersModelsMixins, generics.ListAPIView):
    """
    API Endpoint which returns all of the quizzes they have created
    Given that they're trying to fetch their own quizzes
    """

    queryset = Quiz.objects.all().order_by("id")
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]


user_all_quizzes_view = UserAllQuizzesView.as_view()


class UserQuizView(UsersModelsMixins, generics.ListCreateAPIView):
    """
    API Endpoint which returns the quiz a user has created (given the id)
    And allows them to create a quiz
    Given that they're trying to fetch their own quizzes
    """

    queryset = Quiz.objects.all().order_by("id")
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, quiz_id, **field_names):
        return super().get(request, user_id, id=quiz_id, **field_names)

    # TODO more of a put request?
    # TODO is endpoint rest?
    def create(self, request, user_id, quiz_id, *args, **kwargs):
        # Add questions to Quiz only if there's data!
        if len(request.data["questions"]) == 0:
            return JsonResponse(
                {"error": "No questions provided."}, status=status.HTTP_400_BAD_REQUEST
            )

        quiz = Quiz.objects.get(id=quiz_id, user_id=user_id)

        # TODO try catch with specified error?
        # try:
        for question_data in request.data["questions"]:
            # Create Question
            question = Question.objects.create(
                question=question_data["question"], quiz=quiz
            )

            # Create Answers
            for answer in question_data["answers"]:
                a = Answer.objects.create(answer=answer, question=question)
                # Add correct answer to Question
                if answer == question_data["correct_answer"]:
                    question.correct_answer = a
                    question.save()
                a.save()
            question.save()
        quiz.save()
        return JsonResponse({"hi": "hello"})
        # return JsonResponse({"quiz": quiz.as_dict()}) TODO implement as_dict()


user_quizzes_view = UserQuizView.as_view()


class UserQuizByCatView(UsersModelsMixins, generics.ListAPIView):
    """
    API Endpoint which returns the quizzes of a specific category a user has created
    given that they're trying to fetch their own quizzes
    """

    queryset = Quiz.objects.all().order_by("id")
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, cat_id):
        return super().get(request, user_id, category=cat_id)


user_quizzes_by_cat_view = UserQuizByCatView.as_view()


class UserQuizQuestions(UsersModelsMixins, generics.ListAPIView):
    """API Endpoint which returns the questions for a specified quiz"""

    queryset = Question.objects.all().order_by("id")
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, quiz_id):
        return super().get(request, user_id, quiz_id=quiz_id)


user_quiz_questions = UserQuizQuestions.as_view()
