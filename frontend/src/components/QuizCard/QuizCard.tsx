import { Link } from "react-router";
import styles from "./QuizCard.module.css";

type QuizCardProps = {
  id: number;
  title: string;
  colour: string;
};

export default function QuizCard({ id, title, colour }: QuizCardProps) {
  return (
    <div className={styles.container}>
      <Link to={`../take-quiz/${id}`} style={{ backgroundColor: colour }}>
        <div className={styles.block}></div>
        <div className={styles.details}>{title}</div>
      </Link>
    </div>
  );
}
