import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  PaginatedPartnerProfilesResponse,
  PaginationParams,
  PartnerProfileRequest,
  PartnerProfileResponse,
  PartnerRatingUpdateRequest,
  PartnerStatusUpdateRequest,
} from "../../types/partnerProfile";
import { API_ROUTES } from "../apiRoutes";

export const partnerProfileService = {
  /**
   * Create a new partner profile
   */
  create: (data: PartnerProfileRequest) =>
    apiService.post<ApiResponse<null>>(API_ROUTES.partnerProfile.create, data),

  /**
   * Get all partner profiles with pagination
   * @param params - Pagination parameters (page, limit)
   */
  /**
   * Get all partner profiles with pagination
   */
  getAll: (
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedPartnerProfilesResponse>> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = queryParams.toString()
      ? `${API_ROUTES.partnerProfile.getAll}?${queryParams}`
      : API_ROUTES.partnerProfile.getAll;

    return apiService.get<PaginatedPartnerProfilesResponse>(url);
  },

  /**
   * ✅ Get partner profile by ID
   * @param id - Unique ID of the partner profile
   */
  getById: (id: string): Promise<ApiResponse<PartnerProfileResponse>> => {
    return apiService.get<PartnerProfileResponse>(
      `${API_ROUTES.partnerProfile.getById}/${id}`
    );
  },

  /**
   * Update a partner profile by ID
   */
  update: (id: string, data: Partial<PartnerProfileRequest>) =>
    apiService.put<ApiResponse<PartnerProfileResponse>>(
      `${API_ROUTES.partnerProfile.update}/${id}`,
      data
    ),

  /**
   * Delete a partner profile by ID
   */
  delete: (id: string) =>
    apiService.delete<ApiResponse<null>>(
      `${API_ROUTES.partnerProfile.delete}/${id}`
    ),

  /**
   * Update partner rating
   * @param data - Object containing partnerId and rating
   */
  updateRating: (data: PartnerRatingUpdateRequest) =>
    apiService.patch<ApiResponse<null>>(
      API_ROUTES.partnerProfile.updateRating,
      data
    ),

  /**
   * Update partner status
   * @param data - Object containing partnerId and status
   */
  updateStatus: (data: PartnerStatusUpdateRequest) =>
    apiService.patch<ApiResponse<null>>(
      API_ROUTES.partnerProfile.updateStatus,
      data
    ),
};
