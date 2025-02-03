import { instance } from "../axiosConfig";
import { Quiz } from "../types";

// Fetch all of a user's quizzes
export const fetchQuizzes = async (
  userId: number | undefined,
): Promise<Quiz[]> => {
  const response = await instance.get(`/api/users/${userId}/quizzes/`);
  return response.data;
};
