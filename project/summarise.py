import time

import google.generativeai as genai
from typing import TypedDict  # vs typing_extenstions.TypedDict?
from decouple import config
from google.generativeai.types import File

genai.configure(api_key=config("API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")


class Question(TypedDict):
    """Type for Question"""

    question: str
    answers: list[str]
    correct_answer: str


def upload_video(file_path: str) -> File:
    """Upload video from path to File API"""
    video_file = genai.upload_file(file_path)

    # Check that video is ready to be used
    while video_file.state.name == "PROCESSING":
        time.sleep(10)
        video_file = genai.get_file(video_file.state.name)

    if video_file.state.name == "FAILED":
        raise ValueError(video_file.state.name)


def summarise_video(file_path: str):
    """Summarises video using Gemini 1.5 Flash"""
    video_file = upload_video(file_path)

    prompt = ""
    print("Creating summary...")
    response = model.generate_content(
        [video_file, prompt],
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", response_schema=list[Question]
        ),
        request_options={"timeout": 600},
    )
    print(response)
