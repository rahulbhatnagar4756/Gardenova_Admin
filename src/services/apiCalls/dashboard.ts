import { apiService } from "..";
import type { ApiResponse } from "../../types";
import { API_ROUTES } from "../apiRoutes";

// Types
export interface DashboardLeadCounts {
  count: number;
  today: number;
  message: string;
}

export interface DashboardActiveProfessionals {
  count: number;
  today: number;
  message: string;
}

export interface LeadStatusCount {
  status: string;
  count: number;
}

export interface LeadTrendItem {
  date: string;
  count: number;
}

export interface DashboardClosedLeads {
  total: number;
  this_month: number;
  message: string;
}

export interface DashboardTrend {
  all_leads: LeadTrendItem[];
  new_leads: LeadTrendItem[];
  closed_leads: LeadTrendItem[];
  contacted_leads: LeadTrendItem[];
}

export interface DashboardResponse {
  total_leads: DashboardLeadCounts;
  active_professionals: DashboardActiveProfessionals;
  closed_leads: DashboardClosedLeads;
  lead_status_counts: LeadStatusCount[];
  lead_trend: DashboardTrend;
}

/**
 * Dashboard Service - Contains all dashboard-related API calls
 */
export const dashboardService = {
  /**
   * Get dashboard stats
   * GET /admin/dashboard
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardResponse>> => {
    return apiService.get<DashboardResponse>(API_ROUTES.admin.dashboard);
  },
};
