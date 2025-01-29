import useCategories from "../../hooks/useCategories";
import BackButton from "../BackButton/BackButton";
import LabelSelect from "../LabelSelect/LabelSelect";
import styles from "./CreateQuiz.module.css";

export default function CreateQuiz() {
  const { isPending, isError, data, error, userId } = useCategories(); // TODO pending error

  return (
    <>
      <div className={styles.header}>
        <BackButton />
        <h2>create quiz</h2>
      </div>
      <form className={`flex flex-col ${styles.form}`}>
        <input
          name="video"
          id="file"
          type="file"
          className="btn btn-secondary"
          required
        />
        <label className="form-item" htmlFor="category">
          category
          <select name="category" id="category" className="input">
            <option disabled>Please select a category</option>
            {data?.map(({ id, name }) => (
              <option value={name} key={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-item">
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
