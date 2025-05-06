import { Outlet } from "react-router";
import useUser from "../../hooks/useUser";
import { isEmpty } from "../../utils/isEmpty";

export default function ProtectedRoute() {
  const { data, isError, error, isPending } = useUser();

  const redirectToLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login/`;
  };

  if (isPending) {
    return;
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
