/**
 * Represents a partner's complete profile with personal and business details.
 *
 * @property id - Unique identifier of the partner.
 * @property name - Full name of the partner.
 * @property specialty - Partner's specialization.
 * @property email - Contact email.
 * @property phone - Contact phone number.
 * @property address - Full formatted address.
 * @property bio - Short biography or description.
 * @property status - Current status of partner.
 * @property experience - Number of years of experience.
 * @property rating - Partner's average rating value.
 * @property createdAt - Timestamp when profile was created.
 * @property updatedAt - Timestamp when profile was last updated.
 */
export interface PartnerProfile {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  status: string;
  experience: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents possible status values for a partner profile.
 */
export type PartnerProfileStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended";

/**
 * Represents a structured address for a partner.
 *
 * @property street - Street address.
 * @property city - City name.
 * @property state - State or region name.
 * @property country - Country name.
 * @property zipCode - Postal or ZIP code.
 */
export interface PartnerAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

/**
 * Payload used when creating or updating a partner profile.
 *
 * @property email - Partner's email address.
 * @property mobileNumber - Partner's phone number.
 * @property companyName - Business or company name.
 * @property speciality - Array of specializations.
 * @property address - Optional structured address.
 * @property website - Partner's website URL.
 * @property contactPerson - Primary contact person.
 * @property projectImageUrl - Base64 or URL for project image.
 * @property status - Partner's profile status.
 * @property rating - Rating associated with partner.
 */
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

/**
 * Represents a full partner profile returned by API.
 *
 * @property id - Unique identifier for the partner.
 * @property createdAt - Creation timestamp.
 * @property updatedAt - Last updated timestamp.
 */
export interface PartnerProfileResponse extends PartnerProfileRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Parameters used for paginated requests.
 *
 * @property page - Current page number.
 * @property limit - Number of records per page.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Standard API response for paginated partner profiles.
 *
 * @property currentPage - Current page index.
 * @property totalPages - Total number of pages.
 * @property totalCount - Total number of records.
 * @property limit - Items per page.
 * @property profiles - Array of partner profile responses.
 */
export interface PaginatedPartnerProfilesResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  profiles: PartnerProfileResponse[];
}

/**
 * Request body to update partner rating.
 *
 * @property partnerId - ID of the partner.
 * @property rating - New rating value.
 */
export interface PartnerRatingUpdateRequest {
  partnerId: string;
  rating: number;
}

/**
 * Request body to update partner profile status.
 *
 * @property partnerId - ID of the partner.
 * @property status - New status code.
 */
export interface PartnerStatusUpdateRequest {
  partnerId: string;
  status: "pending" | "approved" | "rejected" | "inactive";
}

/**
 * Props for partner profiles list components.
 *
 * @property limit - Number of partners per page.
 */
export interface PartnerProfilesProps {
  limit?: number;
}

/**
 * Return type for usePartnerProfiles hook.
 *
 * @property partners - Array of loaded partners.
 * @property loading - Loading state.
 * @property error - Error message (if any).
 * @property currentPage - Current active page.
 * @property totalPages - Total pages available.
 * @property totalCount - Total record count.
 * @property limit - Items per page.
 * @property goToPage - Navigate to specific page.
 * @property nextPage - Navigate to next page.
 * @property previousPage - Navigate to previous page.
 * @property setItemsPerPage - Configure items per page.
 * @property createPartner - Create a new partner.
 * @property updatePartner - Update partner details.
 * @property deletePartner - Delete a partner profile.
 * @property refetch - Refresh data.
 * @property updatePartnerRating - Update rating of partner.
 * @property updatePartnerStatus - Update partner status.
 * @property getPartnerById - Retrieve partner by ID.
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
  createPartner: (data: PartnerProfileRequest) => Promise<void>;
  updatePartner: (
    id: string,
    data: Partial<PartnerProfileRequest>
  ) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  updatePartnerRating: (partnerId: string, rating: number) => Promise<void>;
  updatePartnerStatus: (partnerId: string, status: string) => Promise<void>;
  getPartnerById: (id: string) => Promise<PartnerProfileResponse | null>;
}

/**
 * Configuration options for usePartnerProfiles hook.
 *
 * @property initialPage - Starting page number.
 * @property initialLimit - Default items per page.
 * @property autoFetch - Whether to automatically fetch on mount.
 */
export interface UsePartnerProfilesOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

/**
 * Props for viewing partner details inside a modal.
 *
 * @property isOpen - Whether the modal is visible.
 * @property partner - Partner data to display.
 * @property onClose - Handler to close modal.
 */
export interface PartnerViewModalProps {
  isOpen: boolean;
  partner: PartnerProfileResponse | null;
  onClose: () => void;
}

/**
 * Props for partner edit/create modal.
 *
 * @property isOpen - Whether modal is open.
 * @property editingPartner - Partner being edited (null for create).
 * @property onClose - Close handler.
 * @property onSave - Save handler.
 */
export interface PartnerModalProps {
  isOpen: boolean;
  editingPartner: PartnerProfileResponse | null;
  onClose: () => void;
  onSave: (data: PartnerProfileRequest) => Promise<void>;
}

/**
 * Generic dropdown option structure.
 *
 * @property value - Underlying value.
 * @property label - Display label.
 */
export type DropdownOption = {
  value: string;
  label: string;
};

/**
 * Validation errors for partner form inputs.
 */
export type ValidationErrors = {
  companyName?: string;
  email?: string;
  contactPerson?: string;
  mobileNumber?: string;
  speciality?: string;
  website?: string;
  street?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
};

/**
 * State representing form values inside partner create/edit form.
 */
export type FormState = {
  companyName: string;
  email: string;
  speciality: string[];
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  website: string;
  contactPerson: string;
  mobileNumber: string;
  projectImageUrl: string;
  status: string;
  specialityText: string;
};

/**
 * Actions representing updates for partner profile form reducer.
 */
export type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: unknown }
  | { type: "SET_ADDRESS_FIELD"; field: string; value: string }
  | { type: "SET_SPECIALITY"; text: string; array: string[] }
  | { type: "RESET" }
  | { type: "LOAD_PARTNER"; partner: PartnerProfileResponse };

/**
 * State representing loaded states and cities for location selection.
 */
export type LocationState = {
  states: { name: string; iso2: string }[];
  cities: { id: number; name: string }[];
  loadingStates: boolean;
  loadingCities: boolean;
};

/**
 * Actions for updating location selectors such as states and cities.
 */
export type LocationAction =
  | { type: "SET_STATES"; states: { name: string; iso2: string }[] }
  | { type: "SET_CITIES"; cities: { id: number; name: string }[] }
  | { type: "SET_LOADING_STATES"; loading: boolean }
  | { type: "SET_LOADING_CITIES"; loading: boolean }
  | { type: "RESET_LOCATION" };

/**
 * Props for a modal showing multiple professionals.
 *
 * @property isOpen - Whether modal is open.
 * @property onClose - Close modal handler.
 * @property professionals - List of partner profiles.
 * @property loading - Indicates loading state.
 */
export interface ProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: PartnerProfileResponse[];
  loading: boolean;
}
