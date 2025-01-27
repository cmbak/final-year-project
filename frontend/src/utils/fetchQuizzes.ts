import { instance } from "../axiosConfig";
import { Quiz } from "../types";

export const fetchQuizzes = async (
  userId: number | undefined,
  categoryId: number,
): Promise<Quiz[]> => {
  const response = await instance.get(
    `/api/users/${userId}/categories/${categoryId}/`,
  );
  console.log(response.data);
  return response.data;
};
