import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { DoughnutMiniChartProps } from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutMiniChart = ({ total, today }: DoughnutMiniChartProps) => {
  const remaining = Math.max(total - today, 0);

  const data = {
    labels: ["Today", "Remaining"],
    datasets: [
      {
        data: [today, remaining],
        backgroundColor: [
          "#2E3A30", // TODAY
          "#B48A3E", // REMAINING
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "65%", // inner white spacing
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: 60, height: 60 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};
