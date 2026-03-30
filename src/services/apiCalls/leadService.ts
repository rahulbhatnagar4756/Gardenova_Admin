import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type { LeadsApiResponse } from "../../types/lead";
import { API_ROUTES } from "../apiRoutes";

export const leadService = {
  /**
   * Fetch all leads with pagination.
   *
   * @param page The page number to fetch (default: 1).
   * @param limit The number of items per page (default: 5).
   * @returns A promise resolving to an ApiResponse containing paginated leads.
   */  
  getAllLeads: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<LeadsApiResponse>> => {
    return apiService.get<LeadsApiResponse>(
      `${API_ROUTES.leads.getAll}?page=${page}&limit=${limit}`
    );
  },

//   updateLeadStatus: async (id: string, data: { leads_status: string }) => {
//     return apiService.put<RawLeadRow>(
//       `${API_ROUTES.leads.updateStatus}${id}/status`,
//       data
//     );
//   },
// };

  /**
   * Update the status of a lead.
   *
   * @param id Unique identifier of the lead to update.
   * @param data Object containing the updated status field.
   * @param data.leads_status New status value for the lead.
   * @returns A promise resolving to the updated lead data.
   */
//   updateLeadStatus: async (id: string, data: { leads_status: string }) => {
//     return apiService.put<RawLead>(
//       `${API_ROUTES.leads.updateStatus}${id}/status`,
//       data
//     );
//   },
}
