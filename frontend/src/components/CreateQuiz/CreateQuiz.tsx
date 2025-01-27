import BackButton from "../BackButton/BackButton";
import styles from "./CreateQuiz.module.css";

export default function CreateQuiz() {
  return (
    <>
      <div className={styles.header}>
        <BackButton />
        <h2>create quiz</h2>
      </div>
      <form className={`flex flex-col ${styles.form}`}>
        <input name="video" type="file" required />
        <label className="form-item" htmlFor="category">
          category
        </label>
        <select name="category" id="category"></select>
        <label className="form-item" htmlFor="labels">
          labels
        </label>
        <select name="labels" id="labels"></select>
        <label className="form-item">
          quiz name
          <input required />
        </label>
        <input
          type="submit"
          className="btn btn-secondary"
          value="Create Quiz"
        />
      </form>
    </>
  );
}
