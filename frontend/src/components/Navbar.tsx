import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { fetchUser } from "../utils/fetchUser";
import { isEmpty } from "../utils/isEmpty";
import { instance } from "../axiosConfig";

export default function Navbar() {
  const queryClient = useQueryClient();
  let { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  return (
    <nav>
      <Link to="/">Name</Link>
      {/* If user hasn't logged in, only show login */}
      {isEmpty(data) ? (
        <Link to="login">Login</Link>
      ) : (
        <>
          <Link to="dashboard">Dashboard</Link>
          <button
            onClick={async () => {
              await instance.post("/logout/", {}, { withXSRFToken: true });
              // Query data out of date since user now logged out
              queryClient.invalidateQueries({ queryKey: ["user"] });
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
