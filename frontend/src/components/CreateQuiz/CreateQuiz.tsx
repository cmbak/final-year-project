import useCategories from "../../hooks/useCategories";
import BackButton from "../BackButton/BackButton";
import LabelSelect from "../LabelSelect/LabelSelect";
import styles from "./CreateQuiz.module.css";

export default function CreateQuiz() {
  const { isPending, isError, data, error, userId } = useCategories();

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
        <select name="category" id="category">
          <option disabled>Please select a category</option>
          {data?.map(({ id, name }) => (
            <option value={name} key={id}>
              {name}
            </option>
          ))}
        </select>
        <label className="form-item">
          {" "}
          {/* TODO should this be a label? or a p*/}
          labels
          <LabelSelect userId={userId} />
        </label>
        <label className="form-item">
          quiz name
          <input type="text" name="quiz-name" required maxLength={50} />
        </label>
        <input /* Change to button? */
          type="submit"
          className="btn btn-secondary"
          value="Create Quiz"
        />
      </form>
    </>
  );
}
