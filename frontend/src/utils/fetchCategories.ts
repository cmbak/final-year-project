import { instance } from "../axiosConfig";

export const fetchCategories = async (userId: number) => {
  const response = await instance.get(`/api/users/${userId}/categories/`);
  return response.data;
};
