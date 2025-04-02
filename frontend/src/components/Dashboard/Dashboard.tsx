// import CreateModal from "../CreateModal/CreateModal";
import styles from "./Dashboard.module.css";
import { Link } from "react-router";
import Quizzes from "../Quizzes/Quizzes";

export default function Dashboard() {
  return (
    <main className="center-container">
      <h1 className={styles.heading}>my quizzes</h1>
      {/* TODO Search bar here */}
      <Link to="../create-quiz">create quiz</Link>
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
