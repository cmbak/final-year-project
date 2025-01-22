import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "../../utils/isEmpty";
import { fetchUser } from "../../utils/fetchUser";

export default function ProtectedRoute() {
  const { data, isError, error, isFetched } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const redirectToLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login/`;
  };

  // Otherwise 'Loading...' will flicker briefly before url changed
  // if (isPending) {
  //   // return <h1>Loading...<h1/>;
  //   // return null;
  // }
  // TODO slow internet might mean they can see dashboard
  // also what if not fetched and is empty returns false?

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  if (isEmpty(data)) {
    redirectToLogin();
    return null;
  }
  return <Outlet />;
}
