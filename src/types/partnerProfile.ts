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

export interface PartnerRatingUpdateRequest {
  partnerId: string;
  rating: number;
}

export interface PartnerStatusUpdateRequest {
  partnerId: string;
  status: "pending" | "approved" | "rejected" | "inactive";
}

export interface PartnerProfilesProps {
  limit?: number;
}

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

export interface UsePartnerProfilesOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export interface PartnerViewModalProps {
  isOpen: boolean;
  partner: PartnerProfileResponse | null;
  onClose: () => void;
}

export interface PartnerModalProps {
  isOpen: boolean;
  editingPartner: PartnerProfileResponse | null;
  onClose: () => void;
  onSave: (data: PartnerProfileRequest) => Promise<void>;
}

export type DropdownOption = {
  value: string;
  label: string;
};

// Validation errors type
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

// Reducer for form state management
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

export type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: unknown }
  | { type: "SET_ADDRESS_FIELD"; field: string; value: string }
  | { type: "SET_SPECIALITY"; text: string; array: string[] }
  | { type: "RESET" }
  | { type: "LOAD_PARTNER"; partner: PartnerProfileResponse };

// Reducer for location data
export type LocationState = {
  states: { name: string; iso2: string }[];
  cities: { id: number; name: string }[];
  loadingStates: boolean;
  loadingCities: boolean;
};

export type LocationAction =
  | { type: "SET_STATES"; states: { name: string; iso2: string }[] }
  | { type: "SET_CITIES"; cities: { id: number; name: string }[] }
  | { type: "SET_LOADING_STATES"; loading: boolean }
  | { type: "SET_LOADING_CITIES"; loading: boolean }
  | { type: "RESET_LOCATION" };

export interface ProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: PartnerProfileResponse[];
  loading: boolean;
}
