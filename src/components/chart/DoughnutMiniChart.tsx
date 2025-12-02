import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { DoughnutMiniChartProps } from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * A compact doughnut chart component used to display a comparison
 * between today's value and the total value. Useful for dashboard
 * summary widgets showing quick progress indicators.
 *
 * @param {DoughnutMiniChartProps} root0 Component props.
 * @param {number} root0.total Total count or maximum value represented.
 * @param {number} root0.today Value recorded for today's count.
 * @returns {JSX.Element} A rendered doughnut mini chart.
 */
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
