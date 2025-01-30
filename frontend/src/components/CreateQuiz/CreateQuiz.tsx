import { useActionState } from "react";
import useCategories from "../../hooks/useCategories";
import BackButton from "../BackButton/BackButton";
import LabelSelect from "../LabelSelect/LabelSelect";
import styles from "./CreateQuiz.module.css";
import { instance } from "../../axiosConfig";
import FormError from "../FormError/FormError";

type error = string[];

type FormErrors = {
  category?: error;
  labels?: error;
  title?: error;
  user?: error;
};

export default function CreateQuiz() {
  const { isPending, isError, data, error, userId } = useCategories(); // TODO pending error
  const [state, formAction, formPending] = useActionState(createQuiz, {
    errors: {} as FormErrors,
  });

  async function createQuiz(prevState: unknown, formData: FormData) {
    const category = formData.get("category");
    const title = formData.get("quiz-title");
    const user = userId;

    try {
      const response = await instance.post(
        "/api/quizzes/",
        { category, title, user },
        { withXSRFToken: true },
      );
    } catch (error: any) {
      return {
        errors: error.response.data.errors,
      };
    }
  }

  return (
    <>
      <div className={styles.header}>
        <BackButton />
        <h2>create quiz</h2>
      </div>
      <form className={`flex flex-col ${styles.form}`} action={formAction}>
        <input
          name="video"
          id="file"
          type="file"
          className="btn btn-secondary"
          required
        />
        <label className="form-item" htmlFor="category">
          category
          <FormError error={state?.errors.category} />
          <select name="category" id="category" className="input">
            <option disabled>Please select a category</option>
            {data?.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-item">
          {/* TODO should this be a label? or a p*/}
          labels
          <FormError error={state?.errors.labels} />
          <LabelSelect userId={userId} />
        </label>
        <label className="form-item">
          quiz title
          <FormError error={state?.errors.title} />
          <input type="text" name="quiz-title" required maxLength={50} />
        </label>
        <input /* Change to button? */
          type="submit"
          className="btn btn-secondary"
          value="Create Quiz"
          disabled={formPending}
        />
      </form>
    </>
  );
}
