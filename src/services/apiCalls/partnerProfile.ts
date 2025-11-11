import { apiService } from "..";
import type { ApiResponse } from "../../types";
import { API_ROUTES } from "../apiRoutes";

export type PartnerProfileStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended";

export interface PartnerAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface PartnerProfileRequest {
  email: string; // Partner's email
  mobileNumber?: string;
  companyName?: string;
  speciality?: string[]; // Array of specializations
  address?: PartnerAddress;
  website?: string;
  contactPerson?: string;
  projectImageUrl?: string; // Base64 or URL
  status?: PartnerProfileStatus;
  rating?: string;
}

export interface PartnerProfileResponse extends PartnerProfileRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Pagination parameters interface
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Paginated response interface matching your backend
export interface PaginatedPartnerProfilesResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  profiles: PartnerProfileResponse[];
}

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
};
