import { useActionState, useState } from "react";
import useCategories from "../../hooks/useCategories";
import BackButton from "../BackButton/BackButton";
import LabelSelect from "../LabelSelect/LabelSelect";
import styles from "./CreateQuiz.module.css";
import FormError from "../FormError/FormError";
import { useMutation } from "@tanstack/react-query";
import { createQuiz } from "../../utils/createQuiz";
import { CreateQuizDetails, FormError as error } from "../../types";
import Loading from "../Loading/Loading";

type FormErrors = {
  category?: error;
  labels?: error;
  title?: error;
  user?: error;
};

export default function CreateQuiz() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { isError, data, error, userId } = useCategories(); // TODO pending error
  const { mutate, isPending } = useMutation({
    mutationFn: (newQuiz: CreateQuizDetails) => createQuiz(newQuiz),
    onError: (error: any) => {
      if (error.response) setFormErrors(error.response.data.errors);
    },
  });
  const [state, formAction, formPending] = useActionState(onFormSubmit, null);

  async function onFormSubmit(prevState: unknown, formData: FormData) {
    const category = formData.get("category");
    const title = formData.get("quiz-title");
    const video = formData.get("video");
    mutate({
      category,
      title,
      userId,
      labels: selectedIds,
      video,
    });
  }

  // Quiz being made
  if (isPending) {
    return <Loading text="Creating Quiz..." />;
  }

  return (
    <>
      <div className={styles.header}>
        <BackButton />
      </div>
      <Loading text="creating quiz" bottomText="generating questions" />
      <form className={`flex flex-col ${styles.form}`} action={formAction}>
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
          {formErrors.category && <FormError error={formErrors.category} />}
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
          {formErrors.labels && <FormError error={formErrors.labels} />}
          <LabelSelect userId={userId} setSelectedIds={setSelectedIds} />
        </div>
        <label className="form-item">
          quiz title
          {formErrors.title && <FormError error={formErrors.title} />}
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
