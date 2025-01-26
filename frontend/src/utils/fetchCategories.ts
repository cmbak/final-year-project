import { instance } from "../axiosConfig";
import { Category } from "../types";

export const fetchCategories = async (
  userId: number | undefined,
): Promise<Category[]> => {
  // Possible for userId from user query to be undefined https://tkdodo.eu/blog/type-safe-react-query
  if (typeof userId === undefined) {
    Promise.reject(new Error("User id not defined"));
  }
  const response = await instance.get(`/api/users/${userId}/categories/`);
  return response.data;
};
