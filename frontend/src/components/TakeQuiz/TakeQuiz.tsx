import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizQuestions } from "../../utils/fetchQuizQuestions";
import useUser from "../../hooks/useUser";
import { fetchQuiz } from "../../utils/fetchQuiz";
import Question from "../Question/Question";
import styles from "./TakeQuiz.module.css";
import { useState } from "react";

// {
//   1: false;
// }

export default function TakeQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(10).fill(-1), // Array of answer IDs;
  );
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

  function checkAnswers() {
    console.log(selectedAnswers);
  }

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
    <div className="center-container">
      <h1 className={styles.title}>{quizData.data.title}</h1>
      <div className={`flex flex-col ${styles.questions}`}>
        {data.map((question, index) => (
          <Question
            key={index}
            {...question}
            number={index + 1}
            selectedAnswer={selectedAnswers[index]}
            setSelectedAnswers={setSelectedAnswers}
          />
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={checkAnswers}>
        Check Answers
      </button>
    </div>
  );
}
