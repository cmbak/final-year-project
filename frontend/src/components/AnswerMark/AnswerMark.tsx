import styles from "./AnswerMark.module.css";

type AnswerMarkProps = {
  id: number;
  selected: boolean;
  correct: boolean;
};

export default function AnswerMark({ id, selected, correct }: AnswerMarkProps) {
  // Answer selected and correct : checkmark
  // -> means that correct answers which haven't been selected don't have a checkmark
  // Answer selected and incorrect : no checkmark
  if (selected) {
    return correct ? (
      <i className={`bi bi-check ${styles.check}`}></i>
    ) : (
      <i className={`bi bi-x ${styles.cross}`}></i>
    );
  }
  return null;
}
