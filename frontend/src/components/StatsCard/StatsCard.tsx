import { useQuery } from "@tanstack/react-query";
import styles from "./StatsCard.module.css";
import useUser from "../../hooks/useUser";
import { fetchQuizAttempts } from "../../utils/fetchQuizAttempts";
import PassFail from "../Graphs/PassFail";
import { useState } from "react";
import { Round } from "../../utils/round";
import ScoreDist from "../Graphs/ScoreDist";

type StatsCardProps = {
  id: number;
  title: string;
};

export default function StatsCard({ id, title }: StatsCardProps) {
  const [passes, setPasses] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [fails, setFails] = useState(0);
  const [topScore, setTopScore] = useState(0);
  const [worstScore, setWorstScore] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [date, setDate] = useState("N/A");
  const [scoreDist, setScoreDist] = useState(Array(11).fill(0)); // count of scores from 0-10

  const user = useUser();
  const userId = user.data?.id;
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quiz_attempts", userId, id],
    queryFn: async () => {
      const data = await fetchQuizAttempts(userId, id);
      const scores = data.map((attempt) => attempt.score);
      const dates = data.map((attempt) => attempt.date).sort(); // Sorts from earliest to latest
      const dist = Array(11).fill(0);
      let pass = 0;
      let fail = 0;
      let sum = 0;

      scores.forEach((score) => {
        if (score >= 5) {
          pass += 1;
        } else {
          fail += 1;
        }

        sum += score;
        // Tally attempts with each score from 0-10
        dist[score] += 1;
      });

      setAttempts(scores.length);
      if (scores.length > 0) {
        setFails(fail);
        setPasses(pass);
        setTopScore(Math.max.apply(Math, scores));
        setWorstScore(Math.min.apply(Math, scores));
        setAvgScore(Round(sum / scores.length));
        // Last date in array is latest date
        setDate(dates[dates.length - 1]);
        setScoreDist(dist);
      }

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
          <div className={styles.allInfo}>
            <div className={styles.content}>
              <h2 className={styles.title}>{title}</h2>
              <p>
                <span className={styles.heading}>Number of Attempts: </span>
                {attempts}
              </p>
              <p>
                <span className={styles.heading}>Highest Score: </span>
                {topScore}
              </p>
              <p>
                <span className={styles.heading}>Lowest Score: </span>
                {worstScore}
              </p>
              <p>
                <span className={styles.heading}>Average Score: </span>
                {avgScore}
              </p>
              <p>
                <span className={styles.heading}>Last Attempt:</span> {date}
              </p>
            </div>
            <div className={styles.graphs}>
              {date !== "N/A" && (
                <div className={styles.passGraph}>
                  <PassFail fails={fails} passes={passes} />
                </div>
              )}
              {/* {date !== "N/A" && (
                <div className={styles.scoreDistGraph}>
                  <ScoreDist scores={scoreDist} />
                </div>
              )} */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
