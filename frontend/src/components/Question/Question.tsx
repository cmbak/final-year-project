import clsx from "clsx";
import { Answer as AnswerType, StateSetter } from "../../types";
import styles from "./Question.module.css";
import useIntersection from "../../hooks/useIntersection";
import Answer from "../Answer/Answer";
import { strToTimestamp } from "../../utils/strToTimestamp";
import { useEffect, useState } from "react";

type QuestionProps = {
  number: number;
  question: string;
  answers: AnswerType[];
  selectedAnswers: number[];
  setSelectedAnswers: StateSetter<number[][]>;
  showCorrect: boolean;
  correctAnswerIds: number[];
  vidTimestamp: string;
  setCurTimestamp: StateSetter<number>;
  setTimestampClicked: StateSetter<boolean>;
};

export default function Question({
  question,
  number,
  answers,
  selectedAnswers,
  setSelectedAnswers,
  showCorrect,
  correctAnswerIds,
  vidTimestamp,
  setCurTimestamp,
  setTimestampClicked,
}: QuestionProps) {
  const { elementRef, isVisible } = useIntersection<HTMLDivElement>({
    threshold: 1.0,
  });
  const [hasMultAnswers, setHasMultAnswers] = useState(false);

  useEffect(() => {
    if (correctAnswerIds.length > 1) {
      setHasMultAnswers(true);
    } else {
      setHasMultAnswers(false);
    }
  }, [correctAnswerIds, showCorrect]);

  function handleClick() {
    setCurTimestamp(strToTimestamp(vidTimestamp));
    setTimestampClicked(true);
  }

  // Return the number of correct answers chosen (for mcq)
  function selectedAllCorrect(): boolean {
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
        <div className={styles.questContainer}>
          <h3
            className={clsx({
              [styles.question]: true,
              [styles.correct]: showCorrect && selectedAllCorrect(),
              [styles.incorrect]: showCorrect && !selectedAllCorrect(),
            })}
          >
            {number}. {question}{" "}
            {correctAnswerIds.length > 1 && "(Select all that apply)"}{" "}
            {showCorrect && (
              // Only show timestamps when checking answers for yt quiz
              <a className={styles.timestamp} onClick={handleClick}>
                [{vidTimestamp}]
              </a>
            )}
          </h3>
          {showCorrect && (
            <h4>[{showCorrect && selectedAllCorrect() ? "1" : "0"}/1 mark]</h4>
          )}
        </div>
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
              hasMultAnswers={hasMultAnswers}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
