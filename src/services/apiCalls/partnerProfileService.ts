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
  profileImage?: string; // Base64 or URL
  status?: PartnerProfileStatus;
}

export interface PartnerProfileResponse extends PartnerProfileRequest {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export const partnerProfileService = {
  /**
   * Create a new partner profile
   */
  create: (data: PartnerProfileRequest) =>
    apiService.post<ApiResponse<null>>(API_ROUTES.partnerProfile.create, data),

  /**
   * Get all partner profiles
   */
  getAll: () =>
    apiService.get<ApiResponse<PartnerProfileResponse[]>>(
      API_ROUTES.partnerProfile.getAll
    ),

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
