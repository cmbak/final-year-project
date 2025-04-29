import { instance } from "../axiosConfig";

export const deleteQuiz = async (
  quizId: number,
  userId: number | undefined,
) => {
  const response = await instance.delete(
    `/api/users/${userId}/quizzes/${quizId}/`,
    { withXSRFToken: true },
  );
  return response.data[0];
};
