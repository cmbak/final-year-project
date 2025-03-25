import styles from "./AnswerMark.module.css";

type AnswerMarkProps = {
  id: number;
  selectedId: number;
  correctAnswerIds: number[];
};

export default function AnswerMark({
  id,
  selectedId,
  correctAnswerIds: correctAnswers,
}: AnswerMarkProps) {
  // Always show check mark next to correct answer
  if (correctAnswers.includes(id)) {
    return <i className={`bi bi-check ${styles.check}`}></i>;
  }

  // If answer is selected, show whether it's correct or incorrect (via check/cross)
  if (id === selectedId) {
    return correctAnswers.includes(id) ? (
      <i className={`bi bi-check ${styles.check}`}></i>
    ) : (
      <i className={`bi bi-x ${styles.cross}`}></i>
    );
  }
  return null;
}
