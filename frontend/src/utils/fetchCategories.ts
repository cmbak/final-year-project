import { instance } from "../axiosConfig";
import { Category } from "../types";

export const fetchCategories = async (userId: number): Promise<Category[]> => {
  const response = await instance.get(`/api/users/${userId}/categories/`);
  return response.data;
};
