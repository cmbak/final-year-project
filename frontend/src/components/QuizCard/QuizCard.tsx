import { Link } from "react-router";
import styles from "./QuizCard.module.css";
import { Quiz } from "../../types";
import Modal from "../Modal/Modal";
import { SetStateAction, useState } from "react";

type QuizCardProps = Pick<Quiz, "id" | "title" | "thumbnail_url">;

export default function QuizCard({ id, title, thumbnail_url }: QuizCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal
        title="Delete Quiz"
        type={"normal"}
        active={showModal}
        setActive={setShowModal}
        margin={"0 -5rem"} // To counteract 5rem of inline padding on div container in Quizzes
      >
        <h1>hi</h1>
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
