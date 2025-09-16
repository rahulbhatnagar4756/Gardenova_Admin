import "./dashboardCard.css";

interface DashboardCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export const DashboardCard = ({
  title,
  value,
  className = "",
}: DashboardCardProps) => {
  return (
    <div className={`dashboard-card-wrapper ${className}`}>
      <h3 className="dashboard-card-title">{title}</h3>
      <div className="dashboard-card-value">{value}</div>
    </div>
  );
};
