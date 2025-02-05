import { Question as QuestionProps } from "../../types";
import styles from "./Question.module.css";

export default function Question({
  id,
  quizId,
  question,
  correctAnswer,
  answers,
}: QuestionProps) {
  return (
    <div>
      <h2 className={styles.question}>{question}</h2>
      <ul>
        {answers.map(({ id, answer }) => (
          <li key={id}>{answer}</li>
        ))}
      </ul>
    </div>
  ); // Check heading semantics
}
