import "chart.js/auto";
import { Chart as ChartJS } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";

type PassFailProps = {
  passes: number;
  fails: number;
};

export default function PassFail({ passes, fails }: PassFailProps) {
  const data = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [passes, fails],
        backgroundColor: ["#26b347", "red"],
      },
    ],
  };

  return (
    <Pie
      data={data}
      // responsive?
      options={{
        maintainAspectRatio: false,
        plugins: { legend: { position: "center" } },
      }}
    />
  );
}
