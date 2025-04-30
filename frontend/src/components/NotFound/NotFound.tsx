import { Link } from "react-router";
import styles from "./NotFound.module.css";
export default function NotFound() {
  return (
    <div className={`center-container ${styles.container}`}>
      <span className={styles.error}>404</span>
      <h1>Looks like the page you were looking for doesn't exist</h1>
      <Link to="quizzes" className={"hover-underline"}>
        Go to your quizzes
      </Link>
    </div>
  );
}
