import { Doughnut, Bar, Line } from "react-chartjs-2";
import styles from "./Dashboard.module.css";
// import { Tooltip, Legend } from "chart.js";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import { fetchAttempts } from "../../utils/fetchAttempts";
import useUser from "../../hooks/useUser";
import { fetchQuizzes } from "../../utils/fetchQuizzes";
import { Quiz } from "../../types";
import StatsCard from "../StatsCard/StatsCard";

// ChartJs.register(Tooltip, Legend);

export default function Dashboard() {
  const user = useUser();
  const userId = user.data?.id;
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quizzes", userId],
    queryFn: () => fetchQuizzes(userId),
    enabled: Boolean(userId),
  });

  if (isPending) {
    return;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
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

// export default function Dashboard() {
//   const user = useUser();
//   const userId = user.data?.id;
//   const { isPending, data } = useQuery({
//     queryKey: ["attempts", userId],
//     queryFn: async () => {
//       const res = await fetchAttempts(userId);
//       return res;
//     },
//   });

//   let scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//   let avg = 0;

//   useEffect(() => {
//     if (data === undefined) return;

//     data.forEach((attempt) => {
//       scores[attempt.score - 1] += 1;
//       avg += attempt.score;
//     });

//     console.log(avg);
//     avg = avg / data.length;
//     console.log(avg);
//   }, [data]);

//   const ref = useRef<any>(null);

//   const doData = {
//     labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
//     datasets: [
//       {
//         label: "Score",
//         data: scores,
//         // backgroundColor:
//       },
//     ],
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Dashboard</h1>
//       <h2 className={styles.subtitle}>Quiz Scores</h2>

//       {data !== undefined && (
//         <div>
//           <Doughnut
//             data={doData}
//             ref={ref}
//             className={styles.graph}
//             width={"450px"} // 450px for dounu
//             height={"450px"}
//             options={{ maintainAspectRatio: false }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
