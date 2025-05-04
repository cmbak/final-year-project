import { useQuery } from "@tanstack/react-query";
import styles from "./StatsCard.module.css";
import useUser from "../../hooks/useUser";
import { fetchQuizAttempts } from "../../utils/fetchQuizAttempts";
import PassFail from "../Graphs/PassFail";
import { useState } from "react";

type StatsCardProps = {
  id: number;
  title: string;
};

export default function StatsCard({ id, title }: StatsCardProps) {
  const [passes, setPasses] = useState(0);
  const [fails, setFails] = useState(0);
  const user = useUser();
  const userId = user.data?.id;
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quiz_attempts", userId, id],
    queryFn: async () => {
      const data = await fetchQuizAttempts(userId, id);
      let pass = 0;
      let fail = 0;
      data.forEach((attempt) => {
        if (attempt.score >= 5) {
          pass += 1;
        } else {
          fail += 1;
        }
      });
      setFails(fail);
      setPasses(pass);

      return data;
    },
    enabled: Boolean(userId && id),
  });

  if (isPending) {
    return;
  }

  return (
    <div className={styles.card}>
      {isError ? (
        <div></div>
      ) : (
        <>
          <div>
            <h2 className={styles.title}>{title}</h2>
            <p>Highest Score: 4</p>
            <p>Lowest Score: 5</p>
            <p>Average Score: 7</p>
            <p>Last Attempt: Today</p>
          </div>
          <div>
            <PassFail fails={fails} passes={passes} />
          </div>
        </>
      )}
    </div>
  );
}
