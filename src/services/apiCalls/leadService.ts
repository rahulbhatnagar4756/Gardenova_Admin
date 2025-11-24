import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type { LeadsResponse, RawLead } from "../../types/lead";
import { API_ROUTES } from "../apiRoutes";

export const leadService = {
  getAllLeads: async (
    page: number = 1,
    limit: number = 5
  ): Promise<ApiResponse<LeadsResponse>> => {
    return apiService.get<LeadsResponse>(
      `${API_ROUTES.leads.getAll}?page=${page}&limit=${limit}`
    );
  },

  updateLeadStatus: async (id: string, data: { leads_status: string }) => {
    return apiService.put<RawLead>(
      `${API_ROUTES.leads.updateStatus}${id}/status`,
      data
    );
  },
};
