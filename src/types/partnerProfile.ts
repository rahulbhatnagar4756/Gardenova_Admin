// types/partnerProfile.ts

import type { ApiResponse } from "./apiResponse";

/** Represents possible status values for a partner profile. */
export type PartnerProfileStatus = "pending" | "registered";

/** Status values used by the modal form. */
export type PartnerModalStatus = "active" | "inactive";

/** Nested location object returned by the API. */
export interface PartnerLocation {
  city?: string;
  state?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

/** Nested contact object returned by the API. */
export interface PartnerContact {
  telefone?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
}

/** Nested ratings object returned by the API. */
export interface PartnerRatings {
  assessment?: string | null;
  numAvaliacoes?: number | null;
}

/** Represents a full partner profile as returned by the API. */
export interface PartnerProfileResponse {
  id: string;
  companyName?: string;
  email?: string;
  category?: string;
  description?: string;
  image_url?: string;
  projectImageUrl?: string;
  status?: PartnerProfileStatus | PartnerModalStatus | string;
  registered?: boolean;
  location?: PartnerLocation;
  contact?: PartnerContact;
  ratings?: PartnerRatings;
  verifiedSource?: string;
  createdAt?: object | string;
  updatedAt?: object | string;
  // Modal flat fields (populated when editing a modal-created partner)
  speciality?: string[];
  address?: PartnerAddress;
  website?: string;
  contactPerson?: string;
  mobileNumber?: string;
}

/** Flat address shape used by the modal form. */
export interface PartnerAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

/** Alias for backward compatibility with util.ts */
export type Address = PartnerAddress;

/** Payload used when creating or updating a partner via the modal. */
export interface PartnerProfileRequest {
  companyName: string;
  email: string;
  speciality: string[];
  address: PartnerAddress;
  website: string;
  contactPerson: string;
  mobileNumber: string;
  projectImageUrl: string;
  status: PartnerModalStatus;
}

/** Payload for the original API create/update (nested shape). */
export interface PartnerApiRequest {
  companyName?: string;
  email: string;
  category?: string;
  description?: string;
  image_url?: string;
  status?: PartnerProfileStatus;
  location?: PartnerLocation;
  contact?: PartnerContact;
}

/** Request body sent to register a partner (pending → registered). */
export interface PartnerRegisterRequest {
  professionalId: string;
  email: string;
}

/** Parameters used for paginated requests. */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/** Standard API response for paginated partner profiles. */
export interface PaginatedPartnerProfilesResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  professionals: PartnerProfileResponse[];
}

/** Request body to update partner rating. */
export interface PartnerRatingUpdateRequest {
  partnerId?: string;
  rating: number;
  professionalId?: string;
}

/** Props for partner profiles list component. */
export interface PartnerProfilesProps {
  limit?: number;
}

/** Return type for usePartnerProfiles hook. */
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
  updatePartner: (id: string, data: Partial<PartnerApiRequest>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  updatePartnerRating: (partnerId: string, rating: number) => Promise<void>;
  getPartnerById: (id: string) => Promise<PartnerProfileResponse | null>;
}

/** Configuration options for usePartnerProfiles hook. */
export interface UsePartnerProfilesOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
  fetchFn?: (params?: PaginationParams) => Promise<ApiResponse<PaginatedPartnerProfilesResponse>>;
}

/** Props for viewing partner details inside a modal. */
export interface PartnerViewModalProps {
  isOpen: boolean;
  partner: PartnerProfileResponse | null;
  onClose: () => void;
}

/** Props for a modal showing multiple professionals. */
export interface ProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: PartnerProfileResponse[];
  loading: boolean;
}

// --- Modal-specific types ---
/**
 * Represents an option for a dropdown menu.
 */
export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * Represents the address of a partner.
 */
export interface FormState {
  companyName: string;
  email: string;
  speciality: string[];
  address: PartnerAddress;
  website: string;
  contactPerson: string;
  mobileNumber: string;
  projectImageUrl: string;
  status: string;
  specialityText: string;
}
/**
 * Represents the state of the partner form.
 */
export type FormAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_ADDRESS_FIELD"; field: string; value: string }
  | { type: "SET_SPECIALITY"; text: string; array: string[] }
  | { type: "LOAD_PARTNER"; partner: PartnerProfileResponse }
  | { type: "RESET" };


/**
 * Actions that can be dispatched to update the partner form state.
 */
export interface StateOption {
  iso2: string;
  name: string;
}
/**
 * Represents a city option for location selection.
 */
export interface CityOption {
  name: string;
}
/**
 * Represents the state of location-related data.
 */
export interface LocationState {
  states: StateOption[];
  cities: CityOption[];
  loadingStates: boolean;
  loadingCities: boolean;
}
/**
 * Actions that can be dispatched to update the location state.
 */
export type LocationAction =
  | { type: "SET_STATES"; states: StateOption[] }
  | { type: "SET_CITIES"; cities: CityOption[] }
  | { type: "SET_LOADING_STATES"; loading: boolean }
  | { type: "SET_LOADING_CITIES"; loading: boolean }
  | { type: "RESET_LOCATION" };
/**
 * Props for the Partner modal component.
 */
export interface PartnerModalProps {
  isOpen: boolean;
  editingPartner: PartnerProfileResponse | null;
  onSave: (partner: PartnerProfileRequest) => Promise<void>;
  onClose: () => void;
}
/**
 * Represents validation errors for a partner form.
 */
export interface ValidationErrors {
  companyName?: string;
  email?: string;
  contactPerson?: string;
  mobileNumber?: string;
  speciality?: string;
  website?: string;
  street?: string;
  zipCode?: string;
  country?: string;
  state?: string;
  city?: string;
}