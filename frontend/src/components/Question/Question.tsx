import clsx from "clsx";
import { Question as QuestionType, StateSetter } from "../../types";
import styles from "./Question.module.css";

type QuestionProps = {
  number: number;
  selected: boolean;
  setSelectedAnswers: StateSetter<number[]>;
} & QuestionType;

export default function Question({
  id,
  quizId,
  question,
  correctAnswer,
  number,
  answers,
  selected,
  setSelectedAnswers,
}: QuestionProps) {
  function handleClick(answerID: number) {
    // Change id of selected answer for this question
    setSelectedAnswers((prevSelected) => {
      let newSelected = [...prevSelected];
      newSelected[number - 1] = answerID; // Question number starts from 0
      return newSelected;
    });
  }

  return (
    <div>
      <h2 className={styles.question}>
        {number}. {question}
      </h2>
      <ul>
        {answers.map(({ id, answer }) => (
          <li
            key={id}
            className={clsx(styles.answer, selected && styles.selected)}
            onClick={() => handleClick(id)}
          >
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
}
