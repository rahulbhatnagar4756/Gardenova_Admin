// services/apiCalls/partnerProfile.ts
import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  PaginatedPartnerProfilesResponse,
  PaginationParams,
  PartnerProfileRequest,
  PartnerProfileResponse,
  PartnerRatingUpdateRequest,
  // PartnerProfileRequest,
  // PartnerProfileResponse,
  // PartnerRatingUpdateRequest,
  PartnerRegisterRequest,
} from "../../types/partnerProfile";
import { API_ROUTES } from "../apiRoutes";

export const partnerProfileService = {
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
      ? `${API_ROUTES.PROFESSIONALS.getAll}?${queryParams}`
      : API_ROUTES.PROFESSIONALS.getAll;

    return apiService.get<PaginatedPartnerProfilesResponse>(url);
  },

  /**
   * Fetch a single partner profile by ID.
   *
   * @param id Unique identifier of the partner profile.
   * @returns A promise resolving to an ApiResponse with the partner profile.
   */
  getById: (id: string): Promise<ApiResponse<PartnerProfileResponse>> =>
    apiService.get<PartnerProfileResponse>(
      `${API_ROUTES.PROFESSIONALS.getById}/${id}`
    ),

  /**
   * Update an existing partner profile by ID.
   *
   * @param id Unique identifier of the partner profile.
   * @param data Partial partner profile details to update.
   * @returns A promise resolving to an ApiResponse with the updated profile.
   */
  update: (id: string, data: Partial<PartnerProfileRequest>) =>
    apiService.put<ApiResponse<PartnerProfileResponse>>(
      `${API_ROUTES.PROFESSIONALS.updateById}/${id}`,
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
      API_ROUTES.PROFESSIONALS.updateRating,
      data
    ),

  /**
   * Register a partner — transitions status from pending → registered.
   * Sends partnerId and email to the backend.
   *
   * @param data Object containing partnerId and email.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  register: (data: PartnerRegisterRequest): Promise<ApiResponse<null>> =>
    apiService.post<null>(
      API_ROUTES.PROFESSIONALS.register,
      data
    ),
  /**
   * Bulk upload partner profiles via CSV file.
   * Does not set Content-Type — browser sets multipart/form-data boundary automatically.
   *
   * @param formData FormData containing the CSV file under the key "file".
   * @returns A promise resolving to an ApiResponse with null data.
   */
  uploadCsv: (formData: FormData): Promise<ApiResponse<null>> =>
    apiService.uploadFile<null>(
      API_ROUTES.PROFESSIONALS.upload,
      formData
    ),
};