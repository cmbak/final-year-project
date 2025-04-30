// import CreateModal from "../CreateModal/CreateModal";
import styles from "./AllQuizzes.module.css";
import { Link } from "react-router";
import Quizzes from "../Quizzes/Quizzes";

export default function AllQuizzes() {
  return (
    <main className="center-container">
      <h1 className={styles.heading}>my quizzes</h1>
      {/* TODO Search bar here */}
      <button className={`btn btn-primary ${styles.btn}`}>
        <Link to="../create-quiz" className={styles.createLink}>
          create quiz
        </Link>
      </button>
      <div className={styles.quizzes}>
        <Quizzes />
      </div>
      <div className={`${styles.modalBtnContainers}`}>
        {/* <CreateModal
          endpoint="/api/labels/"
          inputId="create-label-name"
          title="create label"
        /> */}
      </div>
    </main>
  );
}
