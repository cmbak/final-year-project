import "chart.js/auto";
import { Chart as ChartJS } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

type ScoreDistProps = {
  scores: number[];
};

export default function ScoreDist({ scores }: ScoreDistProps) {
  const data = {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    datasets: [
      {
        label: "Score Distribution",
        data: [scores],
        backgroundColor: ["rgba(54, 162, 235, 0.6)"],
      },
    ],
  };

  return (
    <Bar
      data={data}
      // width={"450px"} // 450px for dounu
      // height={"450px"}
      width={"450px"}
      height={"450px"}
      // responsive?
      options={{ maintainAspectRatio: false }}
    />
  );
}
