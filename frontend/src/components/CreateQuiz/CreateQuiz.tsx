import { useActionState, useState } from "react";
import styles from "./CreateQuiz.module.css";
import FormError from "../FormError/FormError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createQuiz } from "../../utils/createQuiz";
import { CreateQuizDetails, FormError as error } from "../../types";
import Loading from "../Loading/Loading";
import { fetchUser } from "../../utils/fetchUser";

type FormErrors = {
  video?: error;
  labels?: error;
  title?: error;
  user?: error;
  colour?: error;
};

type VideoType = "YT" | "UP"; // Same as Quiz model choices
// TODO verify that url is for YT video

export default function CreateQuiz() {
  const [videoType, setVideoType] = useState<VideoType>("UP");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const user = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  const userId = user.data?.id;
  const [state, formAction, formPending] = useActionState(onFormSubmit, null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (newQuiz: CreateQuizDetails) => await createQuiz(newQuiz),
    onError: (error: any) => {
      if (error.response) setFormErrors(error.response.data.errors);
    },
  });

  async function onFormSubmit(prevState: unknown, formData: FormData) {
    const title = formData.get("quiz-title");
    const video = formData.get("video");
    const url = formData.get("url");
    mutate({
      title,
      userId,
      video,
      url,
      videoType,
    });
  }

  // Quiz being made
  if (isPending) {
    return <Loading text="creating quiz" bottomText="generating questions" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Create Quiz</h1>
      </div>
      <form className={`flex flex-col ${styles.form}`} action={formAction}>
        <div className="form-item">
          <label htmlFor="videoType">Video Type</label>
          {formErrors.video && videoType === "UP" && (
            <FormError error={formErrors.video} />
          )}
          <select
            className="input"
            name="videoType"
            id="videoType"
            defaultValue={videoType}
            onChange={(e) => setVideoType(e.target.value as VideoType)}
            required
          >
            <option value="UP">Upload</option>
            <option value="YT">YouTube</option>
          </select>
        </div>
        {videoType === "UP" /* Either show file input or url (text) input */ ? (
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
    </div>
  );
}
