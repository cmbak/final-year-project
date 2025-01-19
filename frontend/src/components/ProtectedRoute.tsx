import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../axiosConfig";

export default function ProtectedRoute() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/current-user/");
      return response.data.user;
    },
  });

  // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
  const isEmpty = (object: Object): boolean => {
    for (var _ in object) return false;
    return true;
  };

  const redirectToLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login`;
  };

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  return isEmpty(data) ? redirectToLogin() : <Outlet />;
}
