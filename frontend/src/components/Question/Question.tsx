import clsx from "clsx";
import { Question as QuestionType, StateSetter } from "../../types";
import styles from "./Question.module.css";
import useIntersection from "../../hooks/useIntersection";
import AnswerMark from "../AnswerMark/AnswerMark";

type QuestionProps = {
  number: number;
  selectedAnswer: number;
  setSelectedAnswers: StateSetter<number[]>;
  showCorrect: boolean;
  correctId: number;
} & QuestionType;

export default function Question({
  question,
  number,
  answers,
  selectedAnswer,
  setSelectedAnswers,
  showCorrect,
  correctId,
}: QuestionProps) {
  const { elementRef, isVisible } = useIntersection<HTMLDivElement>({
    threshold: 1.0,
  });

  function handleClick(answerID: number) {
    // Change id of selected answer for this question
    setSelectedAnswers((prevSelected) => {
      let newSelected = [...prevSelected];
      newSelected[number - 1] = answerID; // Question number starts from 0
      return newSelected;
    });
  }

  return (
    <div ref={elementRef}>
      {/* container to prevent animation from flickering because of scale anim*/}
      <div
        className={clsx({
          [styles.container]: true,
          [styles.visible]: isVisible,
        })}
      >
        {/* Question */}
        <h3 className={styles.question}>
          {number}. {question}
        </h3>
        <ul className={`flex flex-col ${styles.answers}`}>
          {/* Answers */}
          {answers.map(({ id, answer }) => (
            <div key={id} className={styles.answerContainer}>
              <li
                className={clsx({
                  [styles.answer]: true,
                  [styles.selected]: selectedAnswer === id,
                  [styles.correct]: showCorrect && correctId === id,
                  [styles.incorrect]: showCorrect && correctId !== id,
                  ["hover-underline"]: !showCorrect && selectedAnswer !== id,
                })}
                onClick={() => !showCorrect && handleClick(id)} // Only allow selection if haven't checked answers
              >
                {answer}
              </li>
              {/* Show if answer correct/incorrect only if answers being checked */}
              {showCorrect && (
                <AnswerMark
                  id={id}
                  selectedId={selectedAnswer}
                  correctId={correctId}
                />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* 

Animate on scroll

- Color goes from transparent black to non transparent

*/
