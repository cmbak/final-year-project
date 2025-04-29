import clsx from "clsx";
import { Answer as AnswerType, StateSetter } from "../../types";
import styles from "./Question.module.css";
import useIntersection from "../../hooks/useIntersection";
import Answer from "../Answer/Answer";

type QuestionProps = {
  number: number;
  question: string;
  answers: AnswerType[];
  selectedAnswers: number[];
  setSelectedAnswers: StateSetter<number[][]>;
  showCorrect: boolean;
  correctAnswerIds: number[];
  type: "YT" | "UP";
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

  // Return the number of correct answers chosen (for mcq)
  function selectedAllCorrect(): boolean {
    console.log("boop");
    for (let index = 0; index < correctAnswerIds.length; index++) {
      const element = correctAnswerIds[index];
      if (!selectedAnswers.includes(element)) {
        return false;
      }
    }
    return true;
  }

  return (
    <div>
      {/* Add ref here for question visibility animation */}
      {/* container to prevent animation from flickering because of scale anim */}
      <div
        className={clsx({
          [styles.container]: true,
          [styles.visible]: isVisible,
        })}
      >
        {/* Question */}
        <h3
          className={clsx({
            [styles.question]: true,
            [styles.correct]: showCorrect && selectedAllCorrect(),
            [styles.incorrect]: showCorrect && !selectedAllCorrect(),
          })}
        >
          {number}. {question}{" "}
          {showCorrect &&
            type === "YT" && ( // Only show timestamps when checking answers for yt quiz
              <span className={styles.timestamp}>[{timestamp}]</span>
            )}
        </h3>
        <ul className={`flex flex-col ${styles.answers}`}>
          {/* Answers */}
          {answers.map(({ id, answer }) => (
            <Answer
              key={id}
              id={id}
              answer={answer}
              correctAnswerIds={correctAnswerIds}
              showCorrect={showCorrect}
              selectedAnswers={selectedAnswers}
              setSelectedAnswers={setSelectedAnswers}
              number={number}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
