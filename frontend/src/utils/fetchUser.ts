import { instance } from "../axiosConfig";
import { User } from "../types";

export const fetchUser = async (): Promise<User> => {
  const response = await instance.get("/api/current-user/");
  return response.data.user;
};
