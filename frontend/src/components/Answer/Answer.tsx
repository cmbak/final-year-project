import clsx from "clsx";
import styles from "./Answer.module.css";
import AnswerMark from "../AnswerMark/AnswerMark";
import { StateSetter } from "../../types";
import { useState } from "react";

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
  const selected = selectedAnswers.includes(id);
  const correctAnswer = correctAnswerIds.includes(id);

  function handleClick(answerID: number) {
    // Add or remove answer id to selected answers for this questions
    // depending on if it's been added to array or not
    let newAnswers = [...selectedAnswers];

    if (newAnswers.includes(answerID)) {
      // Answer already selected, so clicking unselects it
      newAnswers = newAnswers.filter((id) => id !== answerID);
    } else {
      // Only select 1 answer at time for questions w/ 1 correct
      if (!hasMultAnswers && selectedAnswers.length === 1) {
        return;
      }
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
        [styles.selected]: selected,
        [styles.hover]: !showCorrect,
        [styles.correct]: selected && showCorrect && correctAnswer,
        [styles.missingCorrect]: showCorrect && correctAnswer,
        [styles.incorrect]: selected && showCorrect && !correctAnswer,
      })}
      onClick={() => !showCorrect && handleClick(id)} // Only allow selection if haven't checked answers
    >
      {/* {hasMultAnswers ? "true" : "false"} */}
      {hasMultAnswers && <input type="checkbox" />}
      <li className={styles.answer}>{answer}</li>
      {/* Show if answer correct/incorrect only if answers being checked */}
      {showCorrect && (
        <AnswerMark id={id} selected={selected} correct={correctAnswer} />
      )}
    </div>
  );
}
