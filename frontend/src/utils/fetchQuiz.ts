import { instance } from "../axiosConfig";
import { Quiz } from "../types";

export const fetchQuiz = async (
  userId: number | undefined,
  quizId: string | undefined,
): Promise<Quiz> => {
  if (userId === undefined) {
    return Promise.reject(new Error("User ID is undefined"));
  }
  if (quizId === undefined) {
    return Promise.reject(new Error("Quiz ID is undefined"));
  }
  const response = await instance.get(
    `/api/users/${userId}/quizzes/${quizId}/`,
  );
  return response.data[0];
};
