import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { fetchUser } from "../../utils/fetchUser";
import { isEmpty } from "../../utils/isEmpty";
import { instance } from "../../axiosConfig";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const queryClient = useQueryClient();
  let { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.name}>
        Name
      </Link>
      <div className={styles.links}>
        {/* If user hasn't logged in, only show login */}
        {isEmpty(data) ? (
          <button className="btn btn-primary">login</button>
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
              logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
