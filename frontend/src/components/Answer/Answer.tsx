import clsx from "clsx";
import styles from "./Answer.module.css";
import AnswerMark from "../AnswerMark/AnswerMark";
import { StateSetter } from "../../types";
import { useRef } from "react";

type AnswerProps = {
  id: number;
  answer: string;
  showCorrect: boolean;
  correctAnswerIds: number[];
  selectedAnswers: number[];
  setSelectedAnswers: StateSetter<number[][]>;
  number: number;
  hasMultAnswers: boolean;
};

export default function Answer({
  id,
  answer,
  showCorrect,
  correctAnswerIds,
  selectedAnswers,
  setSelectedAnswers,
  number,
  hasMultAnswers,
}: AnswerProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const selected = selectedAnswers.includes(id);
  const correctAnswer = correctAnswerIds.includes(id);

  function handleCheckClick() {
    if (showCorrect) {
      return false;
    }
  }

  function handleClick(answerID: number) {
    // Add or remove answer id to selected answers for this questions
    // depending on if it's been added to array or not
    let newAnswers = [...selectedAnswers];

    if (newAnswers.includes(answerID)) {
      // Answer already selected, so clicking unselects it
      newAnswers = newAnswers.filter((id) => id !== answerID);
      if (checkboxRef.current !== null) {
        checkboxRef.current.checked = false;
      }
    } else {
      // Only select 1 answer at time for questions w/ 1 correct
      if (!hasMultAnswers && selectedAnswers.length === 1) {
        return;
      }
      // Answer not selected, so clicking selects it
      newAnswers = [...newAnswers, answerID];
      if (checkboxRef.current !== null) {
        checkboxRef.current.checked = true;
      }
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
        [styles.selected]: selected,
        [styles.hover]: !showCorrect,
        [styles.correct]: selected && showCorrect && correctAnswer,
        [styles.missingCorrect]: showCorrect && correctAnswer,
        [styles.incorrect]: selected && showCorrect && !correctAnswer,
      })}
      onClick={() => !showCorrect && handleClick(id)} // Only allow selection if haven't checked answers
    >
      <div className={styles.checkContainer}>
        {hasMultAnswers && (
          <input
            type="checkbox"
            ref={checkboxRef}
            onClick={handleCheckClick}
            disabled={showCorrect}
          />
        )}
        <li className={styles.answer}>{answer}</li>
      </div>
      {/* Show if answer correct/incorrect only if answers being checked */}
      {showCorrect && (
        <AnswerMark id={id} selected={selected} correct={correctAnswer} />
      )}
    </div>
  );
}
