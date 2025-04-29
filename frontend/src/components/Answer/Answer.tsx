import clsx from "clsx";
import styles from "./Answer.module.css";
import AnswerMark from "../AnswerMark/AnswerMark";
import { StateSetter } from "../../types";

type AnswerProps = {
  id: number;
  answer: string;
  showCorrect: boolean;
  correctAnswerIds: number[];
  selectedAnswers: number[];
  setSelectedAnswers: StateSetter<number[][]>;
  number: number;
};

export default function Answer({
  id,
  answer,
  showCorrect,
  correctAnswerIds,
  selectedAnswers,
  setSelectedAnswers,
  number,
}: AnswerProps) {
  function handleClick(answerID: number) {
    // Add or remove answer id to selected answers for this questions
    // depending on if it's been added to array or not
    let newAnswers = [...selectedAnswers];

    if (newAnswers.includes(answerID)) {
      // Answer already selected, so clicking unselects it
      newAnswers = newAnswers.filter((id) => id !== answerID);
    } else {
      // Answer not selected, so clicking selects it
      newAnswers = [...newAnswers, answerID];
    }

    // Update array containing selected answers for all questions
    setSelectedAnswers((prevSelectedAnswers) =>
      prevSelectedAnswers.map((answerIds, index) => {
        if (index === number - 1) {
          return newAnswers;
        }
        return answerIds;
      }),
    );
  }

  return (
    <div
      key={id}
      className={clsx({
        [styles.answerContainer]: true,
        [styles.selected]: selectedAnswers.includes(id),
      })}
    >
      <li
        className={clsx({
          [styles.answer]: true,
          [styles.hoverAnswer]: !showCorrect,
          [styles.selected]: selectedAnswers.includes(id),
          [styles.correct]: showCorrect && correctAnswerIds.includes(id),
          [styles.incorrect]: showCorrect && correctAnswerIds.includes(id),
          // ["hover-underline"]:
          //   !showCorrect && !selectedAnswers.includes(id),
        })}
        onClick={() => !showCorrect && handleClick(id)} // Only allow selection if haven't checked answers
      >
        {answer}
      </li>
      {/* Show if answer correct/incorrect only if answers being checked */}
      {showCorrect && (
        <AnswerMark
          id={id}
          selectedAnswers={selectedAnswers}
          correctAnswerIds={correctAnswerIds}
        />
      )}
    </div>
  );
}
