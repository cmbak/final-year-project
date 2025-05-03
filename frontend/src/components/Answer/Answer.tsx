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
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = selectedAnswers.includes(id);
  const correctAnswer = correctAnswerIds.includes(id);

  function handleCheckClick() {
    if (showCorrect) {
      return false;
    }
  }

  // Add or remove answer id to selected answers for this questions
  // depending on if it's been added to array or not
  function handleClick(answerID: number) {
    let newAnswers = [...selectedAnswers];

    if (newAnswers.includes(answerID)) {
      // Answer already selected, so clicking unselects it
      newAnswers = newAnswers.filter((id) => id !== answerID);
      if (inputRef.current !== null) {
        inputRef.current.checked = false;
      }
    } else {
      // Only select 1 answer at time for questions w/ 1 correct
      if (!hasMultAnswers && selectedAnswers.length === 1) {
        return;
      }
      // Answer not selected, so clicking selects it
      newAnswers = [...newAnswers, answerID];
      if (inputRef.current !== null) {
        inputRef.current.checked = true;
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

  // If another answer is selected, then don't allow this radio to be checked
  function handleRadioClick() {
    if (!selected && inputRef.current !== null) {
      inputRef.current.checked = false;
    }
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
        <div className={styles.markContainer}>
          {hasMultAnswers ? (
            <input
              type="checkbox"
              ref={inputRef}
              onClick={handleCheckClick}
              disabled={showCorrect}
            />
          ) : (
            <input
              type="radio"
              ref={inputRef}
              onClick={handleRadioClick}
              disabled={showCorrect}
            />
          )}
          <li className={styles.answer}>{answer}</li>
          {showCorrect && (
            <AnswerMark id={id} selected={selected} correct={correctAnswer} />
          )}
        </div>
      </div>
    </div>
  );
}
