import { apiService } from "..";
import type { ApiResponse } from "../../types";
import { API_ROUTES } from "../apiRoutes";

export interface Lead {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  leadsStatus: string;
  partners: {
    partnerId: string;
    companyName: string;
  }[];
}

export interface LeadPartner {
  partner_id: string;
  company_name: string;
}

export interface LeadUser {
  user_id: string;
  user_name: string;
  user_email: string;
}

export interface RawLead {
  lead_id: string;
  leads_status: string;
  user: LeadUser;
  partners: LeadPartner[];
}

/**
 * Pagination wrapper returned by API
 */
export interface LeadsResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  leads: RawLead[];
}

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
