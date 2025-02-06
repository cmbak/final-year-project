import { Question as QuestionType } from "../../types";
import styles from "./Question.module.css";

type QuestionProps = {
  number: number;
} & QuestionType;

export default function Question({
  id,
  quizId,
  question,
  correctAnswer,
  number,
  answers,
}: QuestionProps) {
  return (
    <div>
      <h2 className={styles.question}>
        {number}. {question}
      </h2>
      <ul>
        {answers.map(({ id, answer }) => (
          <li key={id}>{answer}</li>
        ))}
      </ul>
    </div>
  );
}
