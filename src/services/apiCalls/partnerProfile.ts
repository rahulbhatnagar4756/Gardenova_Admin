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
   * Create a new partner profile.
   *
   * @param data The payload containing partner profile information.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  create: (data: PartnerProfileRequest) =>
    apiService.post<ApiResponse<null>>(API_ROUTES.partnerProfile.create, data),

  /**
   * Get all partner profiles with optional pagination.
   *
   * @param params Pagination parameters including page and limit.
   * @returns A promise resolving to an ApiResponse with paginated partner profiles.
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
   * Fetch a single partner profile by ID.
   *
   * @param id Unique identifier of the partner profile.
   * @returns A promise resolving to an ApiResponse with the partner profile.
   */
  getById: (id: string): Promise<ApiResponse<PartnerProfileResponse>> => {
    return apiService.get<PartnerProfileResponse>(
      `${API_ROUTES.partnerProfile.getById}/${id}`
    );
  },

  /**
   * Update an existing partner profile by ID.
   *
   * @param id Unique identifier of the partner profile.
   * @param data Partial partner profile details to update.
   * @returns A promise resolving to an ApiResponse with the updated profile.
   */
  update: (id: string, data: Partial<PartnerProfileRequest>) =>
    apiService.put<ApiResponse<PartnerProfileResponse>>(
      `${API_ROUTES.partnerProfile.update}/${id}`,
      data
    ),

  /**
   * Delete a partner profile by ID.
   *
   * @param id Unique identifier of the partner profile.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  delete: (id: string) =>
    apiService.delete<ApiResponse<null>>(
      `${API_ROUTES.partnerProfile.delete}/${id}`
    ),

  /**
   * Update the rating of a partner.
   *
   * @param data Object containing partnerId and new rating value.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  updateRating: (data: PartnerRatingUpdateRequest) =>
    apiService.patch<ApiResponse<null>>(
      API_ROUTES.partnerProfile.updateRating,
      data
    ),

  /**
   * Update the status of a partner.
   *
   * @param data Object containing partnerId and status value.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  updateStatus: (data: PartnerStatusUpdateRequest) =>
    apiService.patch<ApiResponse<null>>(
      API_ROUTES.partnerProfile.updateStatus,
      data
    ),
};
