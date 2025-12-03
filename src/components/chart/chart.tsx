import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useCallback, useMemo, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/**
 * Represents a single data point in a trend graph.
 */
export interface TrendPoint {
  date: string;
  count: number;
}

/**
 * Represents grouped trend datasets for different lead statuses.
 */
interface TrendDataSet {
  all: TrendPoint[];
  new: TrendPoint[];
  closed: TrendPoint[];
  contacted: TrendPoint[];
}

/**
 * Filter options for generating trend data ranges.
 */
type TrendFilter = "all" | "monthly" | "yearly" | "custom";

/**
 * Props for the DashboardLineChart component.
 */
interface DashboardLineChartProps {
  data: TrendDataSet;
}

/**
 * Line chart component used to display trend statistics for leads
 * (all, new, closed, contacted) over time. Allows filtering of the
 * dataset by predefined or custom date ranges.
 *
 * @param {DashboardLineChartProps} root0 Component props.
 * @param {TrendDataSet} root0.data Dataset containing trend data.
 * @returns {JSX.Element} Rendered line chart component.
 */
export const DashboardLineChart = ({ data }: DashboardLineChartProps) => {
  const [filter, setFilter] = useState<TrendFilter>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  /**
   * Sorts an array of trend points in ascending order by date.
   *
   * @param {TrendPoint[]} arr Array of trend points.
   * @returns {TrendPoint[]} Sorted array of trend points.
   */
  const sortByDate = (arr: TrendPoint[]) =>
    [...arr].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const filterRange = useCallback(
    (arr: TrendPoint[]) => {
      switch (filter) {
        case "monthly":
          return sortByDate(arr).slice(-30);
        case "yearly":
          return sortByDate(arr).slice(-12);
        case "custom":
          if (!customStart || !customEnd) return sortByDate(arr);
          return sortByDate(arr).filter((d) => {
            const dt = new Date(d.date);
            return dt >= new Date(customStart) && dt <= new Date(customEnd);
          });
        default:
          return sortByDate(arr);
      }
    },
    [filter, customStart, customEnd]
  );

  const filtered = useMemo(() => {
    if (!data) return null;
    return {
      all: filterRange(data.all),
      new: filterRange(data.new),
      closed: filterRange(data.closed),
      contacted: filterRange(data.contacted),
    };
  }, [data, filterRange]);

  if (!filtered || !filtered.all.length) return null;

  const labels = filtered.all.map((p) => p.date);

  const chartData = {
    labels,
    datasets: [
      {
        label: "All Leads",
        data: filtered.all.map((i) => i.count),
        borderColor: "#8C5E2B",
        backgroundColor: "#8C5E2B",
        tension: 0.4,
        fill: false,
      },
      {
        label: "New Leads",
        data: filtered.new.map((i) => i.count),
        borderColor: "#D9C29A",
        backgroundColor: "#D9C29A",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Closed Leads",
        data: filtered.closed.map((i) => i.count),
        borderColor: "#6D7F73",
        backgroundColor: "#6D7F73",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Contacted Leads",
        data: filtered.contacted.map((i) => i.count),
        borderColor: "#FBBC05",
        backgroundColor: "#FBBC05",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height/width container sizing
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as TrendFilter)}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="all">All</option>
          <option value="monthly">Last 30 Days</option>
          <option value="yearly">Last 12 Months</option>
          <option value="custom">Custom Range</option>
        </select>

        {filter === "custom" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}
      </div>

      {/* Chart container sized to approx. box in screenshot */}
      <div style={{ width: "100%", height: "340px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
