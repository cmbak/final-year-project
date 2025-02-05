import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizQuestions } from "../../utils/fetchQuizQuestions";
import useUser from "../../hooks/useUser";
import { fetchQuiz } from "../../utils/fetchQuiz";
import Question from "../Question/Question";

export default function TakeQuiz() {
  let { quizId } = useParams();
  const user = useUser();
  const quizData = useQuery({
    queryKey: ["individual-quiz", quizId, user.data?.id],
    queryFn: () => fetchQuiz(user.data?.id, quizId),
    enabled: Boolean(quizId) && Boolean(user.data?.id),
  });
  const { isError, isPending, data } = useQuery({
    queryKey: ["quiz-questions", user.data?.id, quizId],
    queryFn: () => fetchQuizQuestions(user.data?.id, quizId),
    enabled: Boolean(quizId) && Boolean(user.data?.id),
  });

  // TODO look nice
  if (isPending) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error...</h2>;
  }

  if (quizData.data === undefined) {
    // FIXME see fetch quiz - accesses first item in array?
    return <h2>Uh oh, Quiz data is undefined</h2>;
  }

  if (data.length === 0) {
    // No quiz or no questions for that quiz
    return (
      <h2>
        Uh oh!
        <br /> Looks like there's no questions for this quiz (or it doesn't
        exist)
      </h2>
    );
  }

  return (
    <div>
      <h1>{quizData.data.title}</h1>
      {data.map((question, index) => (
        <Question key={index} {...question} />
      ))}
    </div>
  );
}
