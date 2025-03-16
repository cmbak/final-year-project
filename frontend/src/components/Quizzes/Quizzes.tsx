import styles from "./Quizzes.module.css";
import { Quiz } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizzes } from "../../utils/fetchQuizzes";
import useUser from "../../hooks/useUser";
import { Link } from "react-router";

export default function Quizzes() {
  const userData = useUser();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quizzes", userData.data?.id],
    queryFn: () => fetchQuizzes(userData.data?.id),
    enabled: Boolean(userData.data?.id),
  });

  if (isPending) {
    return <h1>TEMP Loading...</h1>;
  }

  if (isError) {
    return <h1>TEMP Error {error && error.message}</h1>;
  }

  return (
    <ul className={styles.quizzes}>
      {(data && data.length == 0) || data.length === 0 ? (
        <p className={styles.noQuizzes}>No Quizzes</p>
      ) : (
        data.map(({ id, title }: Quiz) => (
          <li key={id}>
            <Link to={`../take-quiz/${id}`}>{title}</Link>
          </li> // TODO show labels here?
        ))
      )}
    </ul>
  );
}
