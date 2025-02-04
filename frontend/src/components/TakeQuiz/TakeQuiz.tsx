import { useParams } from "react-router";
import { instance } from "../../axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizQuestions } from "../../utils/fetchQuizQuestions";
import useUser from "../../hooks/useUser";

export default function TakeQuiz() {
  let { quizId } = useParams();
  const { data } = useUser();
  const questionData = useQuery({
    queryKey: ["quiz-questions"],
    queryFn: () => fetchQuizQuestions(data?.id, quizId),
    enabled: Boolean(quizId) && Boolean(data?.id),
  });

  async function testing() {
    await instance.post(
      `/api/users/${1}/quizzes/${14}/`,
      {
        questions: [
          {
            question: "What is the capital of England?",
            answers: ["London", "Ontario", "Lagos"],
            correct_answer: "London",
          },
        ],
      },
      { withXSRFToken: true },
    );
  }

  return (
    <div>
      TakeQuiz: {quizId} <button onClick={testing}>CREATE QUIZ QUESTION</button>
    </div>
  );
}

/*

query which fetches quiz questions for this page

If there's an error
- Alert that no quiz found or gen error
- Redirect?

If no errors then show questions

*/
