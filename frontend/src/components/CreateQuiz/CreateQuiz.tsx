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
  video?: error;
  category?: error;
  labels?: error;
  title?: error;
  user?: error;
};

type VideoType = "YouTube" | "Upload"; // TODO verify that url is for YT video

export default function CreateQuiz() {
  const [videoType, setVideoType] = useState<VideoType>("YouTube");
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
    const url = formData.get("url");
    mutate({
      category,
      title,
      userId,
      labels: selectedIds,
      video,
      url,
    });
  }

  // Quiz being made
  if (isPending) {
    return <Loading text="creating quiz" bottomText="generating questions" />;
  }

  return (
    <>
      <div className={styles.header}>
        <BackButton />
      </div>
      <form className={`flex flex-col ${styles.form}`} action={formAction}>
        <div className="form-item">
          <label htmlFor="videoType">Video Type</label>
          {formErrors.video && videoType === "Upload" && (
            <FormError error={formErrors.video} />
          )}
          <select
            className="input"
            name="videoType"
            id="videoType"
            onChange={(e) => setVideoType(e.target.value as VideoType)}
            required
          >
            <option value="Upload">Upload</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>
        {videoType ===
        "Upload" /* Either show file input or url (text) input */ ? (
          <input
            name="video"
            id="video"
            type="file"
            accept=".mp4" // TODO check on backend
            className="btn btn-secondary"
            required
          />
        ) : (
          <div className="form-item">
            <label htmlFor="url">YouTube URL</label>
            {formErrors.video && <FormError error={formErrors.video} />}
            <input name="url" type="text" id="url" required />
          </div>
        )}
        <div className="form-item">
          <label htmlFor="category">category</label>
          {formErrors.category && <FormError error={formErrors.category} />}
          <select name="category" id="category" className="input" required>
            <option disabled>Please select a category</option>
            {data?.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-item">
          <p>labels</p>
          {formErrors.labels && <FormError error={formErrors.labels} />}
          <LabelSelect userId={userId} setSelectedIds={setSelectedIds} />
        </div>
        <div className="form-item">
          <label htmlFor="quiz-title">quiz title</label>
          {formErrors.title && <FormError error={formErrors.title} />}
          <input
            type="text"
            name="quiz-title"
            id="quiz-title"
            maxLength={50}
            required
          />
        </div>
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
