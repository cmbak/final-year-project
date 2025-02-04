import { Question as QuestionProps } from "../../types";

export default function Question({
  id,
  quizId,
  question,
  correctAnswerId,
}: QuestionProps) {
  return (
    <div>
      <h3>{question}</h3>
    </div>
  ); // Check heading semantics
}
