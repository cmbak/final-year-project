import { instance } from "../axiosConfig";
import { Attempt } from "../types";

export const fetchAttempts = async (
  userId: number | undefined,
): Promise<Attempt[]> => {
  if (userId === undefined) {
    return Promise.reject(new Error("User ID is undefined"));
  }
  const response = await instance.get(`/api/users/${userId}/attempts/`);
  return response.data;
};
