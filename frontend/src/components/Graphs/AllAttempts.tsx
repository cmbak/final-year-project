import "chart.js/auto";
import { Chart as ChartJS } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Attempt, Quiz } from "../../types";
import { useEffect, useState } from "react";

type AllAttemptsProps = {
  attempts: Attempt[] | undefined;
  quizzes: Quiz[] | undefined;
};

export default function AllAtempts({ attempts, quizzes }: AllAttemptsProps) {
  const [names, setNames] = useState<String[]>([]);
  const [numEachAttempts, setNumEachAttempts] = useState<Number[]>([]);
  const [colours, setColours] = useState<String[]>();

  // https://stackoverflow.com/questions/31243892/random-fill-colors-in-chart-js
  function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    if (attempts !== null && attempts !== undefined && quizzes !== undefined) {
      const attempted = attempts.map((attempt) => attempt.quiz);
      let titles: string[] = [];
      let numAttempts: number[] = [];
      let bgColours: string[] = [];

      // Add name to names if quiz has been attempted
      quizzes.forEach((quiz) => {
        if (attempted.includes(quiz.id)) {
          titles.push(quiz.title);

          // Add number of attempts for this quiz to state array
          let quizAttempts = attempts.filter((a) => a.quiz === quiz.id);
          numAttempts.push(quizAttempts.length);

          // Generate random colour
          bgColours.push(getRandomColor());
        }
      });
      setNames(titles);
      setNumEachAttempts(numAttempts);
      setColours(bgColours);
    }
  }, [attempts, quizzes]);

  const data = {
    labels: names,
    datasets: [
      {
        label: "# of Attempts",
        data: numEachAttempts,
        backgroundColor: colours,
      },
    ],
  };

  return (
    <Pie
      data={data}
      width={"400rem"}
      height={"400rem"}
      // responsive?
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", align: "center", fullSize: false },
        },
      }}
    />
  );
}
