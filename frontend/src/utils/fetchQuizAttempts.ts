import { instance } from "../axiosConfig";
import { Attempt } from "../types";

export const fetchQuizAttempts = async (
  userId: number | undefined,
  quizId: number,
): Promise<Attempt[]> => {
  if (userId === undefined) {
    return Promise.reject(new Error("User ID is undefined"));
  }
  const response = await instance.get(
    `/api/users/${userId}/quizzes/${quizId}/attempts/`,
  );
  return response.data;
};
