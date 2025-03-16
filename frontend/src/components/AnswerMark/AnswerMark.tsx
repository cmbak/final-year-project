import styles from "./AnswerMark.module.css";

type AnswerMarkProps = {
  id: number;
  selectedId: number;
  correctId: number;
};

export default function AnswerMark({
  id,
  selectedId,
  correctId,
}: AnswerMarkProps) {
  // Always show check mark next to correct answer
  if (id === correctId) {
    return <i className={`bi bi-check ${styles.check}`}></i>;
  }

  // If answer is selected, show whether it's correct or incorrect (via check/cross)
  if (id === selectedId) {
    return id === correctId ? (
      <i className={`bi bi-check ${styles.check}`}></i>
    ) : (
      <i className={`bi bi-x ${styles.cross}`}></i>
    );
  }
  return null;
}
