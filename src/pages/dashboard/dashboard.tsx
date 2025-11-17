import { Chart } from "../../components/chart/chart";
import { useDashboard } from "../../hooks/useDashboard";
import "./dashboard.css";
export const Dashboard = () => {
  const { dashboardData, loading, error } = useDashboard();

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error)
    return <div className="error">Error loading dashboard: {error}</div>;

  return (
    <div className="dashboard">
      {/* Header with search */}
      {/* <div className="dashboard-header">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="search"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div> */}

      {/* Left section - Just Cards */}
      <div className="dashboard-left-section">
        <div className="dashboard-cards">
          <div className="dashboard-cards-inner">
            <div className="dashboard-card-left">
              <h3 className="dashboard-card-title">Total Leads</h3>
              <h4 className="dashboard-card-value">500</h4>
              <p className="dashboard-card-discript">
                Today we will receive 20 leads
              </p>
            </div>
            <div className="dashboard-card-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M39.9294 1.69087C35.4743 0.128258 30.7134 -0.360838 26.0336 0.263355C21.3539 0.887549 16.8876 2.60741 12.9978 5.28308C9.10808 7.95874 5.90473 11.5147 3.64828 15.6617C1.39183 19.8087 0.145991 24.4298 0.0120716 29.149L14.5799 29.5624C14.6488 27.1357 15.2894 24.7596 16.4497 22.6271C17.61 20.4947 19.2572 18.6662 21.2573 17.2903C23.2575 15.9145 25.5541 15.0301 27.9605 14.7092C30.3668 14.3882 32.815 14.6397 35.1058 15.4432L39.9294 1.69087Z"
                  fill="#2E3A30"
                />
                <path
                  d="M0.243027 26.1892C-0.485411 31.8772 0.43163 37.6548 2.88553 42.8377C5.33943 48.0205 9.22737 52.3916 14.0888 55.4329C18.9503 58.4743 24.5816 60.0587 30.3158 59.9983C36.0499 59.938 41.6466 58.2355 46.443 55.0924C51.2393 51.9494 55.0344 47.4975 57.3787 42.2641C59.7229 37.0307 60.5182 31.2351 59.6702 25.5636C58.8222 19.8922 56.3665 14.5827 52.5939 10.2639C48.8214 5.94509 43.8901 2.79801 38.3842 1.19539L34.3112 15.1884C37.1424 16.0125 39.6781 17.6308 41.618 19.8515C43.5579 22.0723 44.8206 24.8025 45.2567 27.7188C45.6927 30.6351 45.2838 33.6152 44.0784 36.3063C42.8729 38.9974 40.9215 41.2865 38.4551 42.9027C35.9888 44.5189 33.1109 45.3944 30.1624 45.4254C27.2138 45.4564 24.3182 44.6418 21.8183 43.0778C19.3185 41.5139 17.3193 39.2663 16.0575 36.6012C14.7957 33.9361 14.3241 30.9652 14.6987 28.0404L0.243027 26.1892Z"
                  fill="#B48A3E"
                />
              </svg>
            </div>
          </div>

          <div className="dashboard-cards-inner">
            <div className="dashboard-card-left">
              <h3 className="dashboard-card-title">Active Professtionals</h3>
              <h4 className="dashboard-card-value">150</h4>
              <p className="dashboard-card-discript">
                Today, 20 professionals joined us.
              </p>
            </div>
            <div className="dashboard-card-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M39.9294 1.69087C35.4743 0.128258 30.7134 -0.360838 26.0336 0.263355C21.3539 0.887549 16.8876 2.60741 12.9978 5.28308C9.10808 7.95874 5.90473 11.5147 3.64828 15.6617C1.39183 19.8087 0.145991 24.4298 0.0120716 29.149L14.5799 29.5624C14.6488 27.1357 15.2894 24.7596 16.4497 22.6271C17.61 20.4947 19.2572 18.6662 21.2573 17.2903C23.2575 15.9145 25.5541 15.0301 27.9605 14.7092C30.3668 14.3882 32.815 14.6397 35.1058 15.4432L39.9294 1.69087Z"
                  fill="#2E3A30"
                />
                <path
                  d="M0.243027 26.1892C-0.485411 31.8772 0.43163 37.6548 2.88553 42.8377C5.33943 48.0205 9.22737 52.3916 14.0888 55.4329C18.9503 58.4743 24.5816 60.0587 30.3158 59.9983C36.0499 59.938 41.6466 58.2355 46.443 55.0924C51.2393 51.9494 55.0344 47.4975 57.3787 42.2641C59.7229 37.0307 60.5182 31.2351 59.6702 25.5636C58.8222 19.8922 56.3665 14.5827 52.5939 10.2639C48.8214 5.94509 43.8901 2.79801 38.3842 1.19539L34.3112 15.1884C37.1424 16.0125 39.6781 17.6308 41.618 19.8515C43.5579 22.0723 44.8206 24.8025 45.2567 27.7188C45.6927 30.6351 45.2838 33.6152 44.0784 36.3063C42.8729 38.9974 40.9215 41.2865 38.4551 42.9027C35.9888 44.5189 33.1109 45.3944 30.1624 45.4254C27.2138 45.4564 24.3182 44.6418 21.8183 43.0778C19.3185 41.5139 17.3193 39.2663 16.0575 36.6012C14.7957 33.9361 14.3241 30.9652 14.6987 28.0404L0.243027 26.1892Z"
                  fill="#B48A3E"
                />
              </svg>
            </div>
          </div>

          <div className="dashboard-cards-inner">
            <div className="dashboard-card-left">
              <h3 className="dashboard-card-title">Conversion Percentage</h3>
              <h4 className="dashboard-card-value">66%</h4>
              <p className="dashboard-card-discript">
                Conversion rate increased this month
              </p>
            </div>
            <div className="dashboard-card-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M39.9294 1.69087C35.4743 0.128258 30.7134 -0.360838 26.0336 0.263355C21.3539 0.887549 16.8876 2.60741 12.9978 5.28308C9.10808 7.95874 5.90473 11.5147 3.64828 15.6617C1.39183 19.8087 0.145991 24.4298 0.0120716 29.149L14.5799 29.5624C14.6488 27.1357 15.2894 24.7596 16.4497 22.6271C17.61 20.4947 19.2572 18.6662 21.2573 17.2903C23.2575 15.9145 25.5541 15.0301 27.9605 14.7092C30.3668 14.3882 32.815 14.6397 35.1058 15.4432L39.9294 1.69087Z"
                  fill="#2E3A30"
                />
                <path
                  d="M0.243027 26.1892C-0.485411 31.8772 0.43163 37.6548 2.88553 42.8377C5.33943 48.0205 9.22737 52.3916 14.0888 55.4329C18.9503 58.4743 24.5816 60.0587 30.3158 59.9983C36.0499 59.938 41.6466 58.2355 46.443 55.0924C51.2393 51.9494 55.0344 47.4975 57.3787 42.2641C59.7229 37.0307 60.5182 31.2351 59.6702 25.5636C58.8222 19.8922 56.3665 14.5827 52.5939 10.2639C48.8214 5.94509 43.8901 2.79801 38.3842 1.19539L34.3112 15.1884C37.1424 16.0125 39.6781 17.6308 41.618 19.8515C43.5579 22.0723 44.8206 24.8025 45.2567 27.7188C45.6927 30.6351 45.2838 33.6152 44.0784 36.3063C42.8729 38.9974 40.9215 41.2865 38.4551 42.9027C35.9888 44.5189 33.1109 45.3944 30.1624 45.4254C27.2138 45.4564 24.3182 44.6418 21.8183 43.0778C19.3185 41.5139 17.3193 39.2663 16.0575 36.6012C14.7957 33.9361 14.3241 30.9652 14.6987 28.0404L0.243027 26.1892Z"
                  fill="#B48A3E"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - Chart */}
      <div className="dashboard-chart">
        <Chart data={dashboardData?.chartData} />
      </div>

      <div className="recommended_items">
        <div className="recommended_items_inner">
          <h3 className="recomm_items-title">Most Recommended Items </h3>
        </div>

        <div className="progressbar">
          <div className="progressbar_item">
            <div className="progress_label_outter">
              <p className="progress_label">Husqvarna Robotic Mower</p>
              <p className="progress_number">70%</p>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar" style={{ width: "70%" }}></div>
            </div>
          </div>

          <div className="progressbar_item">
            <div className="progress_label_outter">
              <p className="progress_label">Rain Bird systems</p>
              <p className="progress_number">40%</p>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={25}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar" style={{ width: "40%" }}></div>
            </div>
          </div>

          <div className="progressbar_item">
            <div className="progress_label_outter">
              <p className="progress_label">Philips Hue Outdoor line</p>
              <p className="progress_number">60%</p>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={50}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar" style={{ width: "60%" }}></div>
            </div>
          </div>

          <div className="progressbar_item">
            <div className="progress_label_outter">
              <p className="progress_label">Philips Hue Outdoor line</p>
              <p className="progress_number">80%</p>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={75}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar" style={{ width: "80%" }}></div>
            </div>
          </div>
          <div className="progressbar_item">
            <div className="progress_label_outter">
              <p className="progress_label">Others</p>
              <p className="progress_number">20%</p>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar" style={{ width: "20%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
