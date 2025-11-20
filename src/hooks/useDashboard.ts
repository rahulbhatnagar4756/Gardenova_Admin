import { useEffect, useState } from "react";
import {
  dashboardService,
  type DashboardResponse,
} from "../services/apiCalls/dashboard";

export const useDashboardData = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await dashboardService.getDashboardStats();

      if (response.success) {
        setDashboard(response.data);
        setError(null);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const refetch = () => fetchDashboard();

  const clearError = () => setError(null);

  return {
    dashboard,
    loading,
    error,
    refetch,
    clearError,
  };
};
