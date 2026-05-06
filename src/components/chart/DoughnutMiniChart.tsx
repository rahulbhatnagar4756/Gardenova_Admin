import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { DoughnutMiniChartProps } from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);
/**
 * Creates or returns the existing custom tooltip element.
 *
 * @returns {HTMLDivElement} Tooltip DOM element
 */
const getOrCreateTooltip = () => {
  let tooltip = document.getElementById("doughnut-mini-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "doughnut-mini-tooltip";
    tooltip.style.cssText = `
      position: fixed;
      background: #1e1e1e;
      color: #fff;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-family: Inter, sans-serif;
      pointer-events: none;
      z-index: 99999;
      white-space: nowrap;
      transition: opacity 0.15s ease;
      opacity: 0;
    `;
    document.body.appendChild(tooltip);
  }
  return tooltip;
};
/**
 * Custom external tooltip handler for Chart.js.
 *
 * @param context  Chart.js tooltip context
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const externalTooltipHandler = (context: any) => {
  const tooltip = getOrCreateTooltip();
  const { opacity, dataPoints, caretX, caretY } = context.tooltip;

  if (!opacity || !dataPoints?.length) {
    tooltip.style.opacity = "0";
    return;
  }

  const label = dataPoints[0].label ?? "";
  const value = dataPoints[0].formattedValue ?? "";
  tooltip.innerHTML = `<strong>${label}</strong>: ${value}`;

  const rect = context.chart.canvas.getBoundingClientRect();
  const x = rect.left + caretX;
  const y = rect.top + caretY;

  tooltip.style.opacity = "1";
  tooltip.style.left = `${x}px`;
  tooltip.style.left = `${x - 40}px`; // center it better horizontally
  tooltip.style.top = `${y - 50}px`; // offset above cursor
};
/**
 * Small doughnut chart displaying today's value vs remaining.
 *
 * @param props  Component props
 * @param props.total  Total value
 * @param props.today  Today's value
 * @returns JSX.Element
 */
export const DoughnutMiniChart = ({ total, today }: DoughnutMiniChartProps) => {
  const remaining = Math.max(total - today, 0);

  const data = {
    labels: ["Today", "Remaining"],
    datasets: [
      {
        data: [today, remaining],
        backgroundColor: ["#2E3A30", "#004a24"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,           // disable built-in tooltip
        external: externalTooltipHandler,  // use body-level tooltip
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: 60, height: 60 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};