import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type { DashboardResponse } from "../../types/dashboard";
import { API_ROUTES } from "../apiRoutes";

/**
 * Dashboard Service - Contains all dashboard-related API calls.
 */
export const dashboardService = {
  /**
   * Get dashboard stats.
   * GET /admin/dashboard
   *
   * @returns A promise resolving to an ApiResponse containing dashboard statistics.
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardResponse>> => {
    return apiService.get<DashboardResponse>(API_ROUTES.admin.dashboard);
  },
};
