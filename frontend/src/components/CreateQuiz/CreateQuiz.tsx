import { useActionState, useState } from "react";
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { isPending, isError, data, error, userId } = useCategories(); // TODO pending error
  const [state, formAction, formPending] = useActionState(createQuiz, {
    errors: {} as FormErrors,
  });

  async function createQuiz(prevState: unknown, formData: FormData) {
    const category = formData.get("category");
    const title = formData.get("quiz-title");
    const video = formData.get("video");
    const user = userId;
    try {
      const response = await instance.postForm(
        "/api/quizzes/",
        { category, title, user, labels: selectedIds, video },
        { withXSRFToken: true },
      );

      // Add questions generated from summarised video to quiz
      await instance.post(
        `/api/users/${userId}/quizzes/${response.data.id}/`,
        { questions: response.data.questions },
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
      <form
        className={`flex flex-col ${styles.form}`}
        action={formAction}
        encType="multipart/form-data"
      >
        <input
          name="video"
          id="video"
          type="file"
          accept=".mp4" // TODO check on backend
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
        <div className="form-item">
          <p>labels</p>
          <FormError error={state?.errors.labels} />
          <LabelSelect userId={userId} setSelectedIds={setSelectedIds} />
        </div>
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
