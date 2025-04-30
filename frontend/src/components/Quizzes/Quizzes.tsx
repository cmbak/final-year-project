import styles from "./Quizzes.module.css";
import { Quiz } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizzes } from "../../utils/fetchQuizzes";
import useUser from "../../hooks/useUser";
import QuizCard from "../QuizCard/QuizCard";

export default function Quizzes() {
  const userData = useUser();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quizzes", userData.data?.id],
    queryFn: () => fetchQuizzes(userData.data?.id),
    enabled: Boolean(userData.data?.id),
  });

  if (isPending) {
    return;
    // return <h1>TEMP Loading...</h1>;
  }

  if (isError) {
    return <h1>TEMP Error {error && error.message}</h1>;
  }

  return (
    <div className={styles.quizzes}>
      {(data && data.length == 0) || data.length === 0 ? (
        <p className={styles.noQuizzes}>No Quizzes</p>
      ) : (
        data.map(({ id, title, thumbnail_url }: Quiz) => (
          <QuizCard
            key={id}
            id={id}
            title={title}
            thumbnail_url={thumbnail_url}
          />
        ))
      )}
    </div>
  );
}
