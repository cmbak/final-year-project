import clsx from "clsx";
import { Question as QuestionType, StateSetter } from "../../types";
import styles from "./Question.module.css";

type QuestionProps = {
  number: number;
  selectedAnswer: number;
  setSelectedAnswers: StateSetter<number[]>;
  showCorrectAnswers: boolean;
  correctA: number;
} & QuestionType;

export default function Question({
  question,
  number,
  answers,
  selectedAnswer,
  setSelectedAnswers,
  showCorrectAnswers,
  correctA,
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
            className={clsx({
              [styles.answer]: true,
              [styles.selected]: selectedAnswer === id,
              [styles.correct]: showCorrectAnswers && correctA === id,
              [styles.incorrect]: showCorrectAnswers && correctA !== id,
            })}
            onClick={() => handleClick(id)}
          >
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
}
