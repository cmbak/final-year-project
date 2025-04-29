import { Link } from "react-router";
import styles from "./QuizCard.module.css";
import { Quiz } from "../../types";
import Modal from "../Modal/Modal";
import { SetStateAction, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuiz } from "../../utils/deleteQuiz";
import useUser from "../../hooks/useUser";

type QuizCardProps = Pick<Quiz, "id" | "title" | "thumbnail_url">;

export default function QuizCard({ id, title, thumbnail_url }: QuizCardProps) {
  const queryClient = useQueryClient();
  const { data } = useUser();
  const userId = data?.id;
  const [showModal, setShowModal] = useState(false);
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await deleteQuiz(id, userId);
      queryClient.refetchQueries({ queryKey: ["quizzes", userId] });
      return res;
    },
  });

  return (
    <>
      <Modal
        title="Delete Quiz"
        type={"normal"}
        active={showModal}
        setActive={setShowModal}
        margin={"0 -5rem"} // To counteract 5rem of inline padding on div container in Quizzes
        submitAction={() => mutation.mutate()}
      >
        <h1>Are you sure you want to delete the quiz titled '{title}'?</h1>
      </Modal>
      <div className={styles.container}>
        <img src={thumbnail_url} />
        <div className={styles.details}>
          <span>{title}</span>
          <div className={styles.btns}>
            <Link to={`../take-quiz/${id}`}>
              <button className="btn btn-primary">Start</button>
            </Link>
            <button
              onClick={() => setShowModal((prevShowModal) => !prevShowModal)}
              className={styles.trash}
            >
              <i className="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
