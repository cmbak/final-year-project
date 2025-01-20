import { instance } from "../axiosConfig";

export const fetchUser = async () => {
  const response = await instance.get("/api/current-user/");
  return response.data.user;
};
