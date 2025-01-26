import CreateModal from "../CreateModal/CreateModal";
import styles from "./Dashboard.module.css";
import Categories from "../Categories/Categories";

export default function Dashboard() {
  return (
    <main className={`flex flex-col ${styles.container}`}>
      <h1 className={styles.heading}>my quizzes</h1>
      {/* TODO Search bar, create quiz button here */}
      <Categories />
      <div className={`flex ${styles.modalBtnContainers}`}>
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
