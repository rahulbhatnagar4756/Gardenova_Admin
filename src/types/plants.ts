// types/plant.ts

/**
 * Location information for a plant
 */
export interface Location {
  location_type: string;
  location_value: string;
}

/**
 * Complete plant object returned from the API
 */
export interface Plant {
  id: string;
  scientific_name: string;
  common_name: string;
  image_search_url: string;
  description: string;
  native: string | boolean;
  light: string;
  water_needs: string;
  maintenance_level: string;
  growth_form: string;
  space_types: string[];
  area_sizes: string[];
  challenges: string[];
  tech_preferences: string[];
  care_notes: string[];
  locations: Location[];
}

/**
 * Data required to create a new plant
 */
export interface CreatePlantData {
  scientific_name: string;
  common_name: string;
  image_search_url?: string;
  description?: string;
  native?: string | boolean;
  light?: string;
  water_needs?: string;
  maintenance_level?: string;
  growth_form?: string;
  space_types?: string[];
  area_sizes?: string[];
  challenges?: string[];
  tech_preferences?: string[];
  care_notes?: string[];
  locations?: Location[];
}

/**
 * Data that can be updated in a plant
 */
export interface UpdatePlantData {
  scientific_name?: string;
  common_name?: string;
  image_search_url?: string;
  description?: string;
  native?: string | boolean;
  light?: string;
  water_needs?: string;
  maintenance_level?: string;
  growth_form?: string;
  space_types?: string[];
  area_sizes?: string[];
  challenges?: string[];
  tech_preferences?: string[];
  care_notes?: string[];
  locations?: Location[];
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

/**
 * Response structure for paginated plants list
 */
export interface PlantsData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  plants: Plant[];
}

/**
 * Complete API response for getting all plants
 */
export interface PlantsResponse {
  success: boolean;
  message: string;
  data: PlantsData;
}

/**
 * API response for single plant operations (create, update, get by id)
 */
export interface PlantResponse {
  success: boolean;
  message: string;
  data: Plant;
}

/**
 * API response for delete operation
 */
export interface DeletePlantResponse {
  success: boolean;
  message: string;
}

/**
 * Union type of all field names of Plant.
 */
export type PlantField = keyof Plant;

/**
 * Option format for react-select.
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Props for the PlantModal component.
 */
export interface PlantModalProps {
  /** The selected plant (null when creating a new one). */
  plant: Plant | null;
  /** Modal mode — create or edit. */
  mode: "create" | "edit";
  /** Called when the modal is closed. */
  onClose: () => void;
  /** Update an existing plant. */
  onUpdate?: (id: string, data: Partial<Plant>) => Promise<void>;
  /** Delete a plant. */
  onDelete?: (id: string) => Promise<void>;
  /** Create a new plant. */
  onCreate?: (data: CreatePlantData) => Promise<void>;
}

/**
 * Returns a default empty plant object used for creating a new plant.
 *
 * @returns {CreatePlantData} The default plant values.
 */
export const getDefaultPlantData = (): CreatePlantData => ({
  common_name: "",
  scientific_name: "",
  description: "",
  image_search_url: "",
  native: false,
  light: "",
  water_needs: "",
  maintenance_level: "",
  space_types: [],
  area_sizes: [],
  challenges: [],
  tech_preferences: [],
  care_notes: [],
  growth_form: "",
  locations: [],
});
