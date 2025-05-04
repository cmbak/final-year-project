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
        backgroundColor: ["green", "red"],
      },
    ],
  };

  return (
    <Pie
      data={data}
      // ref={ref}
      width={"450px"} // 450px for dounu
      height={"450px"}
      // options={{ maintainAspectRatio: false }}
    />
  );
}
