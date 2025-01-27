import BackButton from "../BackButton/BackButton";
import styles from "./CreateQuiz.module.css";

export default function CreateQuiz() {
  return (
    <div className={styles.header}>
      <BackButton />
      <h2>create quiz</h2>
    </div>
  );
}
