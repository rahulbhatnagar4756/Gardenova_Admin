// types/partnerProfile.ts

/**
 * Represents possible status values for a partner profile.
 */
export type PartnerProfileStatus = "pending" | "registered";

/**
 * Nested location object returned by the API.
 */
export interface PartnerLocation {
  city?: string;
  state?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Nested contact object returned by the API.
 */
export interface PartnerContact {
  telefone?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
}

/**
 * Nested ratings object returned by the API.
 */
export interface PartnerRatings {
  assessment?: string | null;
  numAvaliacoes?: number | null;
}

/**
 * Represents a full partner profile as returned by the API.
 */
export interface PartnerProfileResponse {
  id: string;
  companyName?: string;
  email?: string;
  category?: string;
  description?: string;
  image_url?: string;
  status?: PartnerProfileStatus | string;
  registered?: boolean;
  location?: PartnerLocation;
  contact?: PartnerContact;
  ratings?: PartnerRatings;
  verifiedSource?: string;
  createdAt?: object | string;
  updatedAt?: object | string;
}

/**
 * Payload used when creating or updating a partner profile.
 */
export interface PartnerProfileRequest {
  companyName?: string;
  email: string;
  category?: string;
  description?: string;
  image_url?: string;
  status?: PartnerProfileStatus;
  location?: PartnerLocation;
  contact?: PartnerContact;
}

/**
 * Request body sent to register a partner (pending → registered).
 */
export interface PartnerRegisterRequest {
  professionalId: string;
  email: string;
}

/**
 * Parameters used for paginated requests.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Standard API response for paginated partner profiles.
 */
export interface PaginatedPartnerProfilesResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  professionals: PartnerProfileResponse[];
}

/**
 * Request body to update partner rating.
 */
export interface PartnerRatingUpdateRequest {
  partnerId?: string;
  rating: number;
  professionalId?: string;

}

/**
 * Props for partner profiles list component.
 */
export interface PartnerProfilesProps {
  limit?: number;
}

/**
 * Return type for usePartnerProfiles hook.
 */
export interface UsePartnerProfilesReturn {
  partners: PartnerProfileResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setItemsPerPage: (limit: number) => void;
  uploadPartnersCsv: (file: File) => Promise<void>;
  registerPartner: (partnerId: string, email: string) => Promise<void>;
  updatePartner: (
    id: string,
    data: Partial<PartnerProfileRequest>
  ) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  updatePartnerRating: (partnerId: string, rating: number) => Promise<void>;
  getPartnerById: (id: string) => Promise<PartnerProfileResponse | null>;
}

/**
 * Configuration options for usePartnerProfiles hook.
 */
export interface UsePartnerProfilesOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

/**
 * Props for viewing partner details inside a modal.
 */
export interface PartnerViewModalProps {
  isOpen: boolean;
  partner: PartnerProfileResponse | null;
  onClose: () => void;
}

/**
 * Props for a modal showing multiple professionals.
 */
export interface ProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: PartnerProfileResponse[];
  loading: boolean;
}