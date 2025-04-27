import { Link } from "react-router";
import styles from "./QuizCard.module.css";
import { Quiz } from "../../types";

type QuizCardProps = Pick<Quiz, "id" | "title" | "thumbnail_url">;

export default function QuizCard({ id, title, thumbnail_url }: QuizCardProps) {
  return (
    <div className={styles.container}>
      <Link to={`../take-quiz/${id}`}>
        <img src={thumbnail_url} />
        <div className={styles.details}>{title}</div>
      </Link>
    </div>
  );
}
