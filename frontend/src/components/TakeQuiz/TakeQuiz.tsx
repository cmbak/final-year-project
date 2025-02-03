import { useParams } from "react-router";

export default function TakeQuiz() {
  let { quizId } = useParams();
  return <div>TakeQuiz: {quizId}</div>;
}
