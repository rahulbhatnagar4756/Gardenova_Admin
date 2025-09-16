import "./chart.css";

interface ChartProps {
  data?: number[];
}

export const Chart = ({
  data = [10, 20, 15, 25, 30, 35, 28, 40, 45, 50],
}: ChartProps) => {
  const maxValue = Math.max(...data);

  return (
    <div className="chart-component-container">
      <h3 className="chart-component-title">Lead Generation Trend</h3>
      <div className="chart-component-graph">
        <svg viewBox="0 0 400 200" className="chart-component-svg">
          <polyline
            points={data
              .map(
                (value, index) =>
                  `${(index * 400) / (data.length - 1)},${
                    200 - (value / maxValue) * 180
                  }`
              )
              .join(" ")}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((value, index) => (
            <circle
              key={index}
              cx={(index * 400) / (data.length - 1)}
              cy={200 - (value / maxValue) * 180}
              r="4"
              fill="#4f46e5"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
