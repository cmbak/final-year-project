import { Outlet } from "react-router";
import useUser from "../../hooks/useUser";
import { isEmpty } from "../../utils/isEmpty";

export default function ProtectedRoute() {
  const { data, isError, error, isPending } = useUser();

  const redirectToLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login/`;
  };

  // TODO remove flicker of loading before data fetched
  // on slower internet it would be longer than a flicker

  if (isPending) {
    return;
    // return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error: {error?.message}</h1>;
  }

  if (data === undefined || isEmpty(data)) {
    redirectToLogin();
    return null;
  }
  return <Outlet />;
}
