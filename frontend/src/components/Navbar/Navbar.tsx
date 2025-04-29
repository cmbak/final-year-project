import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { isEmpty } from "../../utils/isEmpty";
import { instance } from "../../axiosConfig";
import styles from "./Navbar.module.css";
import useUser from "../../hooks/useUser";

export default function Navbar() {
  const queryClient = useQueryClient();
  const { data } = useUser();

  return (
    <nav className={`flex ${styles.nav}`}>
      <Link to="/" className={styles.name}>
        QuizMe
      </Link>
      <div className={`flex ${styles.links}`}>
        {/* If user hasn't logged in, only show login */}
        {data !== undefined && isEmpty(data) ? (
          <a href={`${import.meta.env.VITE_BACKEND_URL}/login/`}>login</a>
        ) : (
          <>
            <Link to="dashboard">dashboard</Link>
            <button
              className="btn btn-primary"
              onClick={async () => {
                await instance.post("/logout/", {}, { withXSRFToken: true });
                // Query data out of date since user now logged out
                queryClient.invalidateQueries({ queryKey: ["user"] });
              }}
            >
              logout {data?.username}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
