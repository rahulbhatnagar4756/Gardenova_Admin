import { useEffect } from "react";
import { DashboardLineChart } from "../../components/chart/chart";
import { DoughnutMiniChart } from "../../components/chart/DoughnutMiniChart";
import { useDashboardData } from "../../hooks/useDashboard";
import "./dashboard.css";
import { useToast } from "../../hooks/useToast";
import { Loader } from "../../components/loader";

/**
 * Dashboard page component that displays summary metrics and charts.
 *
 * @returns {JSX.Element} The dashboard component UI.
 */
export const Dashboard = () => {
  const { dashboard, loading, error } = useDashboardData();
  const { showError } = useToast();

  // Prepare chart data
  const trendData = {
    all: dashboard?.lead_trend?.all_leads ?? [],
    new: dashboard?.lead_trend?.new_leads ?? [],
    closed: dashboard?.lead_trend?.closed_leads ?? [],
    contacted: dashboard?.lead_trend?.contacted_leads ?? [],
  };

  useEffect(() => {
    if (error) {
      showError(`Error: ${error}`);
    }
  }, [error, showError]);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="dashboard">
      {/* Left Section - Cards */}
      <div className="dashboard-left-section">
        <div className="dashboard-cards">
          {/* Total Leads */}
          <div className="dashboard-cards-inner">
            <div className="dashboard-card-left">
              <h3 className="dashboard-card-title">Total Leads</h3>
              <h4 className="dashboard-card-value">
                {dashboard?.total_leads.count ?? 0}
              </h4>
              <p className="dashboard-card-discript">
                {dashboard?.total_leads.message}
              </p>
            </div>
            <div className="dashboard-card-right">
              <DoughnutMiniChart
                total={dashboard?.total_leads.count ?? 0}
                today={dashboard?.total_leads.today ?? 0}
              />
            </div>
          </div>

          {/* Active Professionals */}
          <div className="dashboard-cards-inner">
            <div className="dashboard-card-left">
              <h3 className="dashboard-card-title">Active Professionals</h3>
              <h4 className="dashboard-card-value">
                {dashboard?.active_professionals.count ?? 0}
              </h4>
              <p className="dashboard-card-discript">
                {dashboard?.active_professionals.message}
              </p>
            </div>
            <div className="dashboard-card-right">
              <DoughnutMiniChart
                total={dashboard?.active_professionals.count ?? 0}
                today={dashboard?.active_professionals.today ?? 0}
              />
            </div>
          </div>

          {/* Closed Rate – computed or fallback */}
          {/* Closed Leads */}
          <div className="dashboard-cards-inner">
            <div className="dashboard-card-left">
              <h3 className="dashboard-card-title">Closed Leads</h3>
              <h4 className="dashboard-card-value">
                {dashboard?.closed_leads.total ?? 0}
              </h4>
              <p className="dashboard-card-discript">
                {dashboard?.closed_leads.message}
              </p>
            </div>

            <div className="dashboard-card-right">
              <DoughnutMiniChart
                total={dashboard?.total_leads.count ?? 0}
                today={dashboard?.closed_leads.this_month ?? 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trend Graph Section */}
      <div className="dashboard-chart">
        <DashboardLineChart data={trendData} />
      </div>

      {/* Recommended Items (STATIC) */}
      <div className="recommended_items">
        <div className="recommended_items_inner">
          <h3 className="recomm_items-title">Most Recommended Items</h3>
        </div>

        <div className="progressbar">
          {[
            { name: "Husqvarna Robotic Mower", value: 70 },
            { name: "Rain Bird systems", value: 40 },
            { name: "Philips Hue Outdoor line", value: 60 },
            { name: "Philips Hue Outdoor line", value: 80 },
            { name: "Others", value: 20 },
          ].map((item, index) => (
            <div key={index} className="progressbar_item">
              <div className="progress_label_outter">
                <p className="progress_label">{item.name}</p>
                <p className="progress_number">{item.value}%</p>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
