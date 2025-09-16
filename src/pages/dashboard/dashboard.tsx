import { Search } from "lucide-react";
import { Chart } from "../../components/chart/chart";
import { DashboardCard } from "../../components/dashboardCard/dashboardCard";
import { useDashboard } from "../../hooks/useDashboard";
import "./dashboard.css";
import { DiagnosticQuestions } from "../diagnosticQuestions/diagnosticQuestions";
import { PartnerProfiles } from "../partnerProfiles/partnerProfiles";
import { Leads } from "../leads/leads";

export const Dashboard = () => {
  const { dashboardData, loading, error } = useDashboard();

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error)
    return <div className="error">Error loading dashboard: {error}</div>;

  return (
    <div className="dashboard">
      {/* Header with search */}
      <div className="dashboard-header">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="search"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      {/* Left section - Just Cards */}
      <div className="dashboard-left-section">
        <div className="dashboard-cards">
          <DashboardCard
            title="Total Leads"
            value={dashboardData?.totalLeads || 300}
            className="card-primary"
          />
          <DashboardCard
            title="Active Partners"
            value={dashboardData?.activePartners || 25}
            className="card-secondary"
          />
          <DashboardCard
            title="Number of Questions"
            value={dashboardData?.totalQuestions || 150}
            className="card-tertiary"
          />
          <DashboardCard
            title="Conversion %"
            value={`${dashboardData?.conversionRate || 8}%`}
            className="card-accent"
          />
        </div>
      </div>

      {/* Right section - Chart */}
      <div className="dashboard-chart">
        <Chart data={dashboardData?.chartData} />
      </div>

      {/* Bottom row - Diagnostic Questions and Partner Profiles side by side */}
      <div className="dashboard-bottom-row">
        <div className="dashboard-questions-card">
          <DiagnosticQuestions limit={2} isActionShow={false} />
        </div>

        <div className="dashboard-partners-card">
          <PartnerProfiles limit={2} />
        </div>
      </div>
      {/* Leads Table (Full Width Below) */}
      <div className="dashboard-leads-card">
        <Leads limit={2} />
      </div>
    </div>
  );
};
