import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizQuestions } from "../../utils/fetchQuizQuestions";
import useUser from "../../hooks/useUser";
import { fetchQuiz } from "../../utils/fetchQuiz";
import Question from "../Question/Question";
import styles from "./TakeQuiz.module.css";
import { useRef, useState } from "react";

export default function TakeQuiz() {
  const [numCorrect, setNumCorrect] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showCorrect, setShowCorrect] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(10).fill(-1), // Array of answer IDs;
  );
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { quizId } = useParams();
  const user = useUser();
  const quizData = useQuery({
    // Fetch quiz name
    queryKey: ["individual-quiz", quizId, user.data?.id],
    queryFn: () => fetchQuiz(user.data?.id, quizId),
    enabled: Boolean(quizId) && Boolean(user.data?.id),
  });
  const { isError, isPending, data } = useQuery({
    // Fetch quiz questions
    queryKey: ["quiz-questions", user.data?.id, quizId],
    queryFn: async () => {
      const response = await fetchQuizQuestions(user.data?.id, quizId);
      setCorrectAnswers(response.map((question) => question.correct_answer.id));
      return response;
    },
    enabled: Boolean(quizId) && Boolean(user.data?.id),
  });

  // Show correct answers and number got correct
  function handleClick() {
    setShowCorrect(true);
    // Tally num of correct answers
    let correct = 0;
    correctAnswers.forEach((num, index) => {
      if (selectedAnswers[index] === num) correct++;
    });
    setNumCorrect(correct);
    // Scroll page up to title (to show number correct)
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Disable button if they haven't answered all questions
  // Or if they've already seen the answers
  function btnIsDisabled() {
    const unselected = selectedAnswers.filter((id) => id !== -1);
    if (unselected.length < 10) {
      return true;
    }
    return showCorrect;
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
      <h1 className={styles.title} ref={titleRef}>
        {quizData.data.title}
      </h1>
      {showCorrect && (
        <h2 className={styles.numCorrect}>You got {numCorrect}/10 correct</h2>
      )}
      <div className={`flex flex-col ${styles.questions}`}>
        {data.map((question, index) => (
          <Question
            key={index}
            {...question}
            number={index + 1}
            selectedAnswer={selectedAnswers[index]}
            setSelectedAnswers={setSelectedAnswers}
            showCorrect={showCorrect}
            correctId={question.correct_answer.id}
          />
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary ${styles.checkBtn}"
        onClick={handleClick}
        disabled={btnIsDisabled()}
      >
        <a href="#title">Check Answers</a>
      </button>
    </div>
  );
}
