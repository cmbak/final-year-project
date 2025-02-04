import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizQuestions } from "../../utils/fetchQuizQuestions";
import useUser from "../../hooks/useUser";

export default function TakeQuiz() {
  let { quizId } = useParams();
  const userData = useUser();
  const { isError, isPending, data } = useQuery({
    queryKey: ["quiz-questions", userData.data?.id, quizId],
    queryFn: () => fetchQuizQuestions(userData.data?.id, quizId),
    enabled: Boolean(quizId) && Boolean(userData.data?.id),
  });

  // TODO look nice
  if (isPending) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error...</h2>;
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

  return <div>TakeQuiz: {quizId}</div>;
}

/*

query which fetches quiz questions for this page

If there's an error
- Alert that no quiz found or gen error
- Redirect?

If no errors then show questions

*/
