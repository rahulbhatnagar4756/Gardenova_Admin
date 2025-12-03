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
import type {
  DashboardLineChartProps,
  TrendFilter,
  TrendPoint,
} from "../../types/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/**
 * Dashboard line chart component that visualizes lead trends
 * based on selected time filters.
 *
 * @param {DashboardLineChartProps} props Component props
 * @param {object} props.data Trend dataset for all lead types
 * @returns {JSX.Element | null} Line chart component
 */
export const DashboardLineChart = ({ data }: DashboardLineChartProps) => {
  const [filter, setFilter] = useState<TrendFilter>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  /**
   * Sorts an array of trend points by date in ascending order.
   *
   * @param {TrendPoint[]} arr Trend data array
   * @returns {TrendPoint[]} Sorted trend data
   */
  const sortByDate = (arr: TrendPoint[]) =>
    [...arr].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  /**
   * Filters trend data based on selected filter type:
   * - monthly → last 30 entries
   * - yearly → last 12 entries
   * - custom → between selected dates
   *
   * @param {TrendPoint[]} arr Trend data to filter
   * @returns {TrendPoint[]} Filtered trend data
   */
  const filterRange = useCallback(
    (arr: TrendPoint[]) => {
      const sorted = sortByDate(arr);

      switch (filter) {
        case "monthly":
          return sorted.slice(-30);
        case "yearly":
          return sorted.slice(-12);
        case "custom":
          if (!customStart || !customEnd) return sorted;
          return sorted.filter((d) => {
            const dt = new Date(d.date);
            return dt >= new Date(customStart) && dt <= new Date(customEnd);
          });
        default:
          return sorted;
      }
    },
    [filter, customStart, customEnd]
  );

  /** Filter all datasets */
  const filtered = useMemo(() => {
    if (!data) return null;
    return {
      all: filterRange(data.all),
      new: filterRange(data.new),
      closed: filterRange(data.closed),
      contacted: filterRange(data.contacted),
    };
  }, [data, filterRange]);

  if (!filtered) return null;

  /**
   * MERGE ALL UNIQUE DATES FOR X-AXIS
   */
  const labels = Array.from(
    new Set([
      ...filtered.all.map((p) => p.date),
      ...filtered.new.map((p) => p.date),
      ...filtered.closed.map((p) => p.date),
      ...filtered.contacted.map((p) => p.date),
    ])
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  /**
   * Maps an array of trend points into an array aligned to the merged label list.
   *
   * @param {TrendPoint[]} arr Trend data for a specific lead category
   * @returns {number[]} Array of aligned count values
   */
  const mapToLabels = (arr: TrendPoint[]) =>
    labels.map((date) => arr.find((p) => p.date === date)?.count || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "All Leads",
        data: mapToLabels(filtered.all),
        borderColor: "#8C5E2B",
        backgroundColor: "#8C5E2B",
        tension: 0.4,
      },
      {
        label: "New Leads",
        data: mapToLabels(filtered.new),
        borderColor: "#D9C29A",
        backgroundColor: "#D9C29A",
        tension: 0.4,
      },
      {
        label: "Closed Leads",
        data: mapToLabels(filtered.closed),
        borderColor: "#6D7F73",
        backgroundColor: "#6D7F73",
        tension: 0.4,
      },
      {
        label: "Contacted Leads",
        data: mapToLabels(filtered.contacted),
        borderColor: "#FBBC05",
        backgroundColor: "#FBBC05",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

      <div style={{ width: "100%", height: "340px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
