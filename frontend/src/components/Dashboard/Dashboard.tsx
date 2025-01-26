import CreateModal from "../CreateModal/CreateModal";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>my quizzes</h1>
      {/* Search bar, create quiz button here */}
      <div>{/* Quiz categories here */}</div>
      <div className={styles.modalBtnContainers}>
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
