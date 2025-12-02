import { useEffect, useState } from "react";
import { dashboardService } from "../services/apiCalls/dashboard";
import type { DashboardResponse } from "../types/dashboard";

/**
 * Custom hook to fetch and manage dashboard statistics data.
 *
 * @returns {{
 *   dashboard: DashboardResponse | null,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => Promise<void>,
 *   clearError: () => void
 * }} Dashboard data, loading state, error state, and utility functions.
 */
export const useDashboardData = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches dashboard statistics from the server.
   *
   * @returns {Promise<void>} Resolves when dashboard data is fetched.
   */
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

  /**
   * Refetches the dashboard statistics.
   *
   * @returns {Promise<void>} Resolves when data is refreshed.
   */
  const refetch = () => fetchDashboard();

  /**
   * Clears any dashboard-related error.
   *
   * @returns {void}
   */
  const clearError = () => setError(null);

  return {
    dashboard,
    loading,
    error,
    refetch,
    clearError,
  };
};
