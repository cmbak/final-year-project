import time

import google.generativeai as genai
import typing_extensions as typing
from decouple import config
from google.generativeai.types import File

genai.configure(api_key=config("API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")


class Question(typing.TypedDict):
    """Type for Question"""

    question: str
    answers: list[str]
    correct_answers: list[str]
    timestamp: str


def upload_video(file_name: str) -> File:
    """Upload video titled {file_name} to File API"""
    print(f"Uploading file from {file_name}")
    video_file = genai.upload_file(file_name)

    # Check that video is ready to be used
    while video_file.state.name == "PROCESSING":
        print("Processing Video...")
        video_file = genai.get_file(video_file.name)
        time.sleep(10)

    if video_file.state.name == "FAILED":
        raise ValueError(video_file.state.name)
    return video_file


def summarise_video(file_name: str):
    """Summarises video using Gemini 2.0 Flash"""
    video_file = upload_video(file_name)

    prompt = """
    You are a helpful tool which tests a person's understanding of the content of a video.
    You provide them with a series of 10 multiple choice questions, each with 3 possible answers - with either 1 or 2 of these being correct - and the timestamp for the part of the video which corresponds to the question and.

    You might be used to help understand complex content, so ensure that each question and corresponding answer(s) have plenty of detail to test the user's comprehension of the content.
    You must make sure that some questions have 2 correct answers, and some only have 1 correct answer.

    You should use the JSON schema as supplied through the model configuration.
    You must make sure that, for each question, the values of the 'correct_answers' list contains the values of the correct answers within that question's 'answers' list.
    You must make sure that there is only one timestamp for each question - this should be formatted as MM:SS with M indicating a minute and S indicating a second.
    You must ensure that there are 3 answers options in total
    You must make sure that there are at least 2 questions which have 2 answers - this should be reflected in the length of the correct_answers list.

    """

    print("Creating summary...")
    response = model.generate_content(
        [video_file, prompt],
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", response_schema=list[Question]
        ),
        request_options={"timeout": 600},
    )
    print(response.text)
    return response.text
