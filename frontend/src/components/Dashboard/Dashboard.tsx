import styles from "./Dashboard.module.css";
import { useQuery } from "@tanstack/react-query";
import useUser from "../../hooks/useUser";
import { fetchQuizzes } from "../../utils/fetchQuizzes";
import { Quiz } from "../../types";
import StatsCard from "../StatsCard/StatsCard";
import { fetchAttempts } from "../../utils/fetchAttempts";
import AllAtempts from "../Graphs/AllAttempts";

export default function Dashboard() {
  const user = useUser();
  const userId = user.data?.id;
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quizzes", userId],
    queryFn: () => fetchQuizzes(userId),
    enabled: Boolean(userId),
  });

  const attemptsData = useQuery({
    queryKey: ["all_attempts", userId],
    queryFn: () => fetchAttempts(userId),
    enabled: Boolean(userId),
  });

  if (isPending) {
    return;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      {attemptsData.isError ? (
        <h1>Error {error && error.message}</h1>
      ) : (
        <div className={styles.attemptsGraph}>
          <h2>Number of attempts by Quiz</h2>
          {/* <p>Only for attempted quizzes</p> */}
          <div className={styles.attemptsContainer}>
            <AllAtempts attempts={attemptsData.data} quizzes={data} />
          </div>
        </div>
      )}
      <h1 className={styles.statsTitle}>Stats for each Quiz</h1>
      <div className={!isError ? styles.statsGrid : ""}>
        {isError ? (
          <h1>Error {error && error.message}</h1>
        ) : (
          data.map(({ id, title }: Quiz) => (
            <StatsCard key={id} id={id} title={title} />
          ))
        )}
      </div>
    </div>
  );
}
