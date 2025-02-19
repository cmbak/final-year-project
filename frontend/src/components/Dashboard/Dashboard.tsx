import CreateModal from "../CreateModal/CreateModal";
import styles from "./Dashboard.module.css";
import Categories from "../Categories/Categories";
import { Link } from "react-router";

export default function Dashboard() {
  return (
    <main className="center-container">
      <h1 className={styles.heading}>my quizzes</h1>
      {/* TODO Search bar here */}
      <Link to="../create-quiz">create quiz</Link>
      <Categories />
      <div className={`${styles.modalBtnContainers}`}>
        <CreateModal
          endpoint="/api/categories/"
          inputId="create-category-name"
          title="create category"
        />
        <CreateModal
          endpoint="/api/labels/"
          inputId="create-label-name"
          title="create label"
        />
      </div>
    </main>
  );
}
