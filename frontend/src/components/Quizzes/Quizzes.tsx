import { useQuery } from "@tanstack/react-query";
import { fetchQuizzes } from "../../utils/fetchQuizzes";
import styles from "./Quizzes.module.css";

type QuizzesProps = {
  userId: number | undefined; // See Categories component
  // TODO better way of doing
  categoryId: number;
};

export default function Quizzes({ userId, categoryId }: QuizzesProps) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quizzes", userId, categoryId],
    queryFn: () => fetchQuizzes(userId, categoryId),
    enabled: Boolean(userId) && Boolean(categoryId),
  });

  if (isPending) {
    return <h1>TEMP Loading...</h1>;
  }

  if (isError) {
    return <h1>TEMP Error {error.message}</h1>;
  }

  return (
    <ul className={styles.quizzes}>
      {data.length == 0 ? (
        <p className={styles.noQuizzes}>No Quizzes</p>
      ) : (
        data.map(({ id, title }) => (
          <li key={id}>{title}</li> // TODO show labels here?
        ))
      )}
    </ul>
  );
}
