import { instance } from "../axiosConfig";

export const editQuiz = async (
  quizId: number,
  userId: number | undefined,
  title: string,
) => {
  const response = await instance.put(
    `/api/users/${userId}/quizzes/${quizId}/`,
    { title },
    { withXSRFToken: true },
  );
  return response.data[0];
};
