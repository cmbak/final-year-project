import clsx from "clsx";
import { Answer, StateSetter } from "../../types";
import styles from "./Question.module.css";
import useIntersection from "../../hooks/useIntersection";
import AnswerMark from "../AnswerMark/AnswerMark";

type QuestionProps = {
  number: number;
  question: string;
  answers: Answer[];
  selectedAnswers: number[];
  setSelectedAnswers: StateSetter<number[][]>;
  showCorrect: boolean;
  correctAnswerIds: number[];
  type: "YouTube" | "Upload";
  timestamp: string;
};

export default function Question({
  question,
  number,
  answers,
  selectedAnswers,
  setSelectedAnswers,
  showCorrect,
  correctAnswerIds,
  timestamp,
  type,
}: QuestionProps) {
  const { elementRef, isVisible } = useIntersection<HTMLDivElement>({
    threshold: 1.0,
  });

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
    <div ref={elementRef}>
      {/* container to prevent animation from flickering because of scale anim */}
      <div
        className={clsx({
          [styles.container]: true,
          [styles.visible]: isVisible,
        })}
      >
        {/* Question */}
        <h3 className={styles.question}>
          {number}. {question}{" "}
          {showCorrect &&
            type === "YouTube" && ( // Only show timestamps when checking answers for yt quiz
              <span className={styles.timestamp}>[{timestamp}]</span>
            )}
        </h3>
        <ul className={`flex flex-col ${styles.answers}`}>
          {/* Answers */}
          {answers.map(({ id, answer }) => (
            <div key={id} className={styles.answerContainer}>
              <li
                className={clsx({
                  [styles.answer]: true,
                  [styles.selected]: selectedAnswers.includes(id),
                  [styles.correct]:
                    showCorrect && correctAnswerIds.includes(id),
                  [styles.incorrect]:
                    showCorrect && correctAnswerIds.includes(id),
                  ["hover-underline"]:
                    !showCorrect && !selectedAnswers.includes(id),
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
          ))}
        </ul>
      </div>
    </div>
  );
}
