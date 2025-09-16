import { useState, useEffect } from "react";
import { mockService } from "../services/mockService";
import type { DashboardData } from "../types";

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await mockService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData, loading, error };
};
