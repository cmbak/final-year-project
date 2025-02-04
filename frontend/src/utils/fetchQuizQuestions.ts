import { instance } from "../axiosConfig";
import { Question } from "../types";

export const fetchQuizQuestions = async (
  userId: number | undefined,
  quizId: string | undefined,
): Promise<Question[]> => {
  if (userId === undefined) {
    return Promise.reject(new Error("User ID is undefined"));
  }

  if (quizId === undefined) {
    return Promise.reject(new Error("Quiz ID is undefined"));
  }

  const response = await instance.get(
    `/api/users/${userId}/quizzes/${quizId}/questions/`,
  );
  return response.data;
};
