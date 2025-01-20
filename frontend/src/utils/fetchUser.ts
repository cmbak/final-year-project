import { api } from "../axiosConfig";

export const fetchUser = async () => {
  const response = await api.get("/current-user/");
  return response.data.user;
};
