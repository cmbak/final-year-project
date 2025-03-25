import { instance } from "../axiosConfig";
import { CreateQuizDetails } from "../types";

export const createQuiz = async ({
  title,
  userId,
  labels,
  video,
  url,
  videoType,
}: CreateQuizDetails) => {
  const response = await instance.postForm(
    "/api/quizzes/",
    { title, user: userId, labels, video, url, type: videoType },
    { withXSRFToken: true },
  );

  // Add questions generated from summarised video to quiz
  await instance.post(
    `/api/users/${userId}/quizzes/${response.data.id}/`,
    { questions: response.data.questions },
    { withXSRFToken: true },
  );
};
