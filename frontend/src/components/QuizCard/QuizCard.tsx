import { Link } from "react-router";
import styles from "./QuizCard.module.css";
import { Quiz } from "../../types";
import Modal from "../Modal/Modal";
import { SetStateAction, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuiz } from "../../utils/deleteQuiz";
import useUser from "../../hooks/useUser";
import { editQuiz } from "../../utils/editQuiz";

type QuizCardProps = Pick<Quiz, "id" | "title" | "thumbnail_url">;

export default function QuizCard({ id, title, thumbnail_url }: QuizCardProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const queryClient = useQueryClient();
  const { data } = useUser();
  const userId = data?.id;

  const mutation = useMutation({
    mutationFn: async (mutType: "edit" | "delete") => {
      let res;
      if (mutType === "delete") {
        res = await deleteQuiz(id, userId);
      } else {
        res = await editQuiz(id, userId, newTitle);
      }
      queryClient.refetchQueries({ queryKey: ["quizzes", userId] });
      return res;
    },
  });

  return (
    <>
      <Modal
        title="Delete Quiz"
        type={"normal"}
        active={showDelete}
        setActive={setShowDelete}
        margin={"0 -5rem"} // To counteract 5rem of inline padding on div container in Quizzes
        submitAction={() => mutation.mutate("delete")}
      >
        <h1>Are you sure you want to delete the quiz titled '{title}'?</h1>
      </Modal>
      <Modal
        title="Edit Quiz Title"
        type="normal"
        active={showEdit}
        setActive={setShowEdit}
        margin="0 -5rem"
        submitAction={() => mutation.mutate("edit")}
      >
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        ></input>
      </Modal>
      <div className={styles.container}>
        <img src={thumbnail_url} className={styles.thumbnail} />
        <div className={styles.details}>
          <span>{title}</span>
          <div className={styles.btns}>
            <Link to={`../take-quiz/${id}`}>
              <button className="btn btn-primary">Start</button>
            </Link>
            <button
              className={styles.editBtn}
              onClick={() => setShowEdit((prevShowEdit) => !prevShowEdit)}
            >
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button
              onClick={() => setShowDelete((prevShowDelete) => !prevShowDelete)}
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
