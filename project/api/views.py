import json
import os
import urllib.parse

from api.serializers import (
    AnswerSerializer,
    LoginSerializer,
    QuestionSerializer,
    QuizSerializer,
    UserSerializer,
)
from decouple import config
from django.contrib.auth import login, logout
from django.core.exceptions import FieldError
from django.http.response import HttpResponseRedirectBase, JsonResponse
from download_video import download_video
from google.api_core.exceptions import GoogleAPICallError, ServerError, TooManyRequests
from rest_framework import generics, permissions, status
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView
from summarise import summarise_video
from yt_dlp.utils import DownloadError

from .models import Answer, Question, Quiz, User


def handle_invalid_serializer(serializer: ModelSerializer) -> Response:
    """Returns response with code 400 containing serializer and its errors"""
    # Can be used to show errors on DJANGO forms
    return Response(
        {"serializer": serializer, "errors": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


def video_error_json(error_message: str, status_code: int) -> JsonResponse:
    """
    Return JsonResponse for video field with the error message and status code specified
    """
    return JsonResponse({"errors": {"video": [error_message]}}, status=status_code)


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


class QuizCreateView(CreateSpecifyErrorsMixin, generics.CreateAPIView):
    """API Endpoint for creating a quiz"""

    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_name = request.FILES.get("video")
        url = request.data.get("url")

        # Should only enter URL OR upload video (XOR)
        if (file_name is None and url is None) or (
            file_name is not None and url is not None
        ):
            return video_error_json(
                "You must upload either an mp4 or upload a YouTube video",
                status.HTTP_400_BAD_REQUEST,
            )

        # URL shouldn't be empty
        if url is not None and len(url) == 0:
            return JsonResponse(
                {"errors": {"video": ["You must not enter an empty URL"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # https://stackoverflow.com/questions/26274021/simply-save-file-to-folder-in-django

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create Quiz instance
        self.perform_create(serializer)
        quiz = Quiz.objects.get(id=serializer.data["id"])

        # Delete created quiz if error thrown when summarising
        try:
            # Download youtube video and set embed_url field
            if url is not None:
                file_name, embed_url, thumbnail_url, video_id = download_video(url)
                quiz.file_name = f"{video_id}.mp4"
                quiz.embed_url = embed_url
                quiz.thumbnail_url = thumbnail_url
                quiz.save()
            else:
                # file gets hosted using http-server
                # so need to know title as encoded string so can be used as video source
                quiz.file_name = urllib.parse.quote(file_name.name)
                quiz.save()
                file_name = os.getcwd() + "/media/" + file_name.name

            # Summarise video
            summarised_questions = summarise_video(file_name)
            summarised_questions = json.loads(summarised_questions)

            # Return response with new quiz id and questions
            return JsonResponse(
                {"id": serializer.data["id"], "questions": summarised_questions},
                status=status.HTTP_201_CREATED,
            )
        except DownloadError as e:
            print(f"Something went wrong when trying to download video from {url}")
            print(e.msg)
            quiz.delete()

            if "is not a valid URL" in e.msg:
                return video_error_json(
                    "Please enter a valid url for a YouTube video",
                    status.HTTP_400_BAD_REQUEST,
                )
            else:
                return video_error_json(
                    f"Something went wrong when downloading video from url {url}",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except TooManyRequests as e:
            print("Too many requests sent to Gemini API (429)")
            print(e.code, e.message)
            quiz.delete()
            # File name without path
            return video_error_json(
                "Recieved response 429 when trying to summarise video",
                e.code,
            )
        except ServerError as e:
            print("Something went wrong when trying to summarise video")
            print(e.code, e.message)
            return video_error_json(
                f"Recieved {e.code} response when trying to summarise video",
                e.code,
            )
        # Other API related error not caught by ^
        except GoogleAPICallError as e:
            print("Something went wrong when trying to summarise video")
            print(e.code, e.message)
            return video_error_json(
                "Something went wrong when trying to summarise video",
                e.code,
            )


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
            queryset = self.get_queryset().filter(user=user_id, **field_names)
        except FieldError as e:
            # If model has no user field, then just filter by kwargs
            print(
                f"Error: {e}\nModel does not have a user field. Trying to filter without including user..."  # noqa e501
            )
            queryset = self.get_queryset().filter(**field_names)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserAllQuizzesView(UsersModelsMixins, generics.ListAPIView):
    """
    API Endpoint which returns all of the quizzes they have created
    Given that they're trying to fetch their own quizzes
    """

    queryset = Quiz.objects.all().order_by("id")
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]


user_all_quizzes_view = UserAllQuizzesView.as_view()


class UserQuizView(
    UsersModelsMixins, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView
):
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

    def delete(self, request, user_id, quiz_id):
        quiz = Quiz.objects.get(user=user_id, id=quiz_id)
        quiz.delete()
        return JsonResponse({}, status=status.HTTP_200_OK)

    def put(self, request, user_id, quiz_id):
        quiz = Quiz.objects.get(user=user_id, id=quiz_id)
        quiz.title = request.data.get("title")
        quiz.save()
        return JsonResponse({"quiz": quiz.as_dict()})

    # TODO more of a put request?
    # TODO is endpoint rest?
    def create(self, request, user_id, quiz_id, *args, **kwargs):
        # Add questions to Quiz only if there's data!
        if len(request.data.get("questions", [])) == 0:
            return JsonResponse(
                {"error": "No questions provided."}, status=status.HTTP_400_BAD_REQUEST
            )

        quiz = Quiz.objects.get(id=quiz_id, user_id=user_id)

        # TODO try catch with specified error?
        for question_data in request.data["questions"]:
            # Create Question
            question = Question.objects.create(
                question=question_data["question"],
                quiz=quiz,
                timestamp=question_data["timestamp"],
            )

            # Create Answers
            for answer in question_data["answers"]:
                a = Answer.objects.create(answer=answer, question=question)
                # Add correct answer to Question if it's one of the correct answers
                if answer in question_data["correct_answers"]:
                    a.correct_answer_for = question
                a.save()

            question.save()
        quiz.save()
        return JsonResponse({"quiz": quiz.as_dict()})


user_quizzes_view = UserQuizView.as_view()


class UserQuizQuestions(generics.ListAPIView):
    """API Endpoint which returns the questions for a specified quiz"""

    queryset = Question.objects.all().order_by("id")
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, quiz_id):  # From UsersModelsMixin
        # Check that id of user sending request is requesting their own data
        if user_id != request.user.id:
            return JsonResponse(
                {"error": "You cannot access this"}, status=status.HTTP_403_FORBIDDEN
            )  # TODO change message

        # Questions with id, quiz id, question and correct answer
        queryset = self.get_queryset().filter(quiz_id=quiz_id)
        serializer = self.get_serializer(queryset, many=True)  # TODO type?

        # Need to get answers for each question
        for question in serializer.data:  # TODO type; question is object
            answers = Answer.objects.filter(
                question=question["id"]
            )  # TODO more efficient way?
            serialized_answers = AnswerSerializer(answers, many=True)
            question["answers"] = (
                serialized_answers.data
            )  # Add answers array as new key

        return Response(serializer.data)


user_quiz_questions = UserQuizQuestions.as_view()
