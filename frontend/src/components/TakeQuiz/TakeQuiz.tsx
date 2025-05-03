import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchQuizQuestions } from "../../utils/fetchQuizQuestions";
import useUser from "../../hooks/useUser";
import { fetchQuiz } from "../../utils/fetchQuiz";
import { createMatrix } from "../../utils/createMatrix";
import Question from "../Question/Question";
import styles from "./TakeQuiz.module.css";
import { useRef, useState } from "react";
import { arraysEquals } from "../../utils/arraysEqual";
import { shuffle } from "../../utils/shuffle";
import Video from "../Video/Video";
import { createAttempt } from "../../utils/createAttempt";
import { Attempt } from "../../types";
import clsx from "clsx";

export default function TakeQuiz() {
  const [curTimestamp, setCurTimestamp] = useState(-1);
  const [timestampClicked, setTimestampClicked] = useState(false);
  const [numCorrect, setNumCorrect] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<number[][]>(
    createMatrix(10),
  ); // Each q has array of correct answer ids
  const [showCorrect, setShowCorrect] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[][]>(
    createMatrix(10),
  ); // 10 Questions, each with potentially multiple answers)
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { quizId } = useParams();
  const user = useUser();
  const userId = user.data?.id;

  // Fetch quiz ddata
  const quizData = useQuery({
    queryKey: ["individual-quiz", quizId, user.data?.id],
    queryFn: () => fetchQuiz(user.data?.id, quizId),
    enabled: Boolean(quizId) && Boolean(user.data?.id),
  });

  // Fetch quiz questions
  const { isError, isPending, data, error } = useQuery({
    queryKey: ["quiz-questions", user.data?.id, quizId],
    queryFn: async () => {
      let response = await fetchQuizQuestions(user.data?.id, quizId);
      // Shuffle questions whenever user takes quiz
      // response = shuffle(response); - FIXME shuffles whenever tab back onto page

      // Go through each question, and for each answer
      // If the answer is the correct answer for that question, append that answer id to correct answers array for that question
      let correctAnswers = createMatrix(10);
      response.forEach((question, index) =>
        question.answers.forEach((answer) => {
          // If this answer is a correct answer
          if (answer.correct_answer_for == question.id) {
            // Append correct answer to array for the current question
            correctAnswers[index].push(answer.id);
          }
        }),
      );

      // Set correct answers 2d state array to new array populated w/ ids of correct answers
      setCorrectAnswers(correctAnswers);
      return response;
    },
    enabled: Boolean(quizId) && Boolean(user.data?.id),
  });

  // To create new attempt upon checking answers
  const mutation = useMutation({
    mutationFn: async (newAttempt: Attempt) => {
      const res = await createAttempt(newAttempt);
      return res;
    },
  });

  // Show correct answers and number got correct
  async function handleClick() {
    // Scroll page up to title (to show number correct)
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setShowCorrect(true);
    // Tally num of correct answers
    let correct = 0;
    correctAnswers.forEach((correctIds, index) => {
      if (arraysEquals(selectedAnswers[index], correctIds)) correct++;
    });
    setNumCorrect(correct);

    // Create new attempts
    // Date needs to be formatted YYYY-MM-DD

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    await mutation.mutate({
      date: `${year}-${month}-${day}`,
      score: correct,
      quiz: Number(quizId),
      user: userId,
    });
  }

  // Disable button if they haven't answered all questions
  // Or if they've already seen the answers
  function btnIsDisabled() {
    for (let i = 0; i < selectedAnswers.length; i++) {
      if (selectedAnswers[i].length == 0) {
        return true;
      }
    }
    return showCorrect;
  }

  // TODO look nice
  if (isPending) {
    return;
    // return <h2>Loading...</h2>;
  }

  if (isError) {
    console.log(error);
    return <h2>Error: {error.message} </h2>; // TODO display errors like this
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
    <div className={"center-container"}>
      <h1 className={styles.title} ref={titleRef}>
        {quizData.data.title}
      </h1>
      {showCorrect && (
        <h2
          className={clsx({
            [styles.numCorrect]: true,
            [styles.pass]: numCorrect >= 5,
            [styles.fail]: numCorrect < 5,
          })}
        >
          You {numCorrect >= 5 ? "Passed" : "Failed"}! <br />
          You got {numCorrect}/10 correct!
        </h2>
      )}
      <div className={styles.embedContainer}>
        <Video
          name={`http://localhost:8080/${quizData.data.file_name}`}
          showCorrect={showCorrect}
          timestamp={curTimestamp}
          timestampClicked={timestampClicked}
          setTimestampClicked={setTimestampClicked}
        />
      </div>
      <div className={`flex flex-col ${styles.questions}`}>
        {data.map((question, index) => (
          <Question
            key={index}
            question={question.question}
            number={index + 1}
            answers={question.answers}
            selectedAnswers={selectedAnswers[index]}
            setSelectedAnswers={setSelectedAnswers}
            showCorrect={showCorrect}
            correctAnswerIds={correctAnswers[index]}
            vidTimestamp={question.timestamp}
            setCurTimestamp={setCurTimestamp}
            setTimestampClicked={setTimestampClicked}
          />
        ))}
      </div>
      <button
        type="button"
        className={`btn btn-primary ${styles.checkBtn}`}
        onClick={handleClick}
        disabled={btnIsDisabled()}
      >
        <a href="#title">Check Answers</a>
      </button>
    </div>
  );
}
