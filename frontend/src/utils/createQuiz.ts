import { instance } from "../axiosConfig";
import { CreateQuizDetails } from "../types";

export const createQuiz = async ({
  category,
  title,
  userId,
  labels,
  video,
  url,
}: CreateQuizDetails) => {
  const response = await instance.postForm(
    "/api/quizzes/",
    { category, title, user: userId, labels, video, url },
    { withXSRFToken: true },
  );

  // Add questions generated from summarised video to quiz
  await instance.post(
    `/api/users/${userId}/quizzes/${response.data.id}/`,
    { questions: response.data.questions },
    { withXSRFToken: true },
  );
};
