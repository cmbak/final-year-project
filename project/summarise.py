import time
import typing_extensions as typing  # vs typing.TypedDict?

import google.generativeai as genai
from decouple import config
from google.generativeai.types import File

genai.configure(api_key=config("API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# TODO safety settings
# TODO move prompts etc. here


class Question(typing.TypedDict):
    """Type for Question"""

    question: str
    answers: list[str]
    correct_answer: str


def upload_video(file_path: str) -> File:
    print(f"./media/{file_path}")
    """Upload video from path to File API"""
    print("Uploading file...")
    video_file = genai.upload_file(f"./media/{file_path}")

    # Check that video is ready to be used
    while video_file.state.name == "PROCESSING":
        time.sleep(10)
        print("Processing Video...")
        video_file = genai.get_file(video_file.name)

    if video_file.state.name == "FAILED":
        raise ValueError(video_file.state.name)
    return video_file


def summarise_video(file_path: str):
    """Summarises video using Gemini 1.5 Flash"""
    video_file = upload_video(file_path)

    prompt = """
    You are a video summariser tool which summarises a video into a series of 10 multiple choice questions, each with 3 possible answers with only 1 of these being the correct one.
    
    Each question should have a maximum length of 255 characters and each answer should have a maximum length of 128 characters. However try to keep your questions and answers conscise, yet descriptive to ensure that all the content convered in the video.
    Ideally Each questions should have a length of around 50-75 characters and each answer should ideally have a length of 15-35 characters.
    
    You should use the JSON schema as supplied through the model configuration.
    You must make sure that, for each question, the value of the 'correct_answer' is the value of the correct answer within that question's 'answers' list.
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
