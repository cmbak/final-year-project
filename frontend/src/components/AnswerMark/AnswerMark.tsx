import clsx from "clsx";
import styles from "./AnswerMark.module.css";

type AnswerMarkProps = {
  id: number;
  selected: boolean;
  correct: boolean;
};

export default function AnswerMark({ id, selected, correct }: AnswerMarkProps) {
  // Correct answer
  if (correct) {
    return (
      <i
        className={clsx({
          [`bi bi-check-circle-fill`]: true,
          [styles.selected]: selected, // Selected and Correct
          [styles.notSelectCheck]: !selected, // Not selected and Correct (i.e. should've been selected)
        })}
      ></i>
    );
  }

  // Incorrect answer
  if (!correct) {
    // Not necessarily needed, but clearer
    return (
      <i
        className={clsx({
          [`bi bi-x-circle-fill`]: true,
          [styles.cross]: selected, // Selected and Incorrect
          [styles.wrong]: !selected, // Not selected and Incorrect
        })}
      ></i>
    );
  }
}
