import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet } from "react-router";

export default function ProtectedRoute() {
  const auth = useContext(AuthContext);
  return auth ? <Outlet /> : <h1>You are not authenticated</h1>;
}
