import { instance } from "../axiosConfig";
import { Label } from "../types";

export const fetchLabels = async (
  userId: number | undefined,
): Promise<Label[]> => {
  if (userId === undefined) Promise.reject(new Error("User id is undefined"));
  const response = await instance.get(`/api/users/${userId}/labels/`);
  return response.data;
};
