import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  CreatePlantData,
  Plant,
  PlantsData,
  UpdatePlantData,
} from "../../types/plants";
import { API_ROUTES } from "../apiRoutes";

export const knowledgeLibraryService = {
  /**
   * Create a new plant.
   *
   * @param data Object containing plant data.
   * @returns A promise resolving to an ApiResponse containing the created plant.
   */
  createPlant: async (data: CreatePlantData): Promise<ApiResponse<Plant>> => {
    return apiService.post<Plant>(API_ROUTES.plants.create, data);
  },

  /**
   * Fetch all plants with pagination.
   *
   * @param page The page number to fetch (default: 1).
   * @param limit The number of items per page (default: 5).
   * @param search the plant search according to the input of user
   * @returns A promise resolving to an ApiResponse containing paginated plants.
   */
  getAllPlants: async (
    page: number = 1,
    limit: number = 6,
    search: string = ""
  ): Promise<ApiResponse<PlantsData>> => {
    return apiService.get<PlantsData>(
      `${API_ROUTES.plants.getAll}?page=${page}&limit=${limit}&search=${search}`
    );
  },

  /**
   * Get a specific plant by ID.
   *
   * @param id Unique identifier of the plant.
   * @returns A promise resolving to an ApiResponse containing the plant details.
   */
  getPlantById: async (id: string): Promise<ApiResponse<Plant>> => {
    return apiService.get<Plant>(`${API_ROUTES.plants.getById}${id}`);
  },

  /**
   * Update a plant by ID.
   *
   * @param id Unique identifier of the plant to update.
   * @param data Object containing the updated plant fields.
   * @returns A promise resolving to the updated plant data.
   */
  updatePlant: async (
    id: string,
    data: UpdatePlantData
  ): Promise<ApiResponse<Plant>> => {
    return apiService.put<Plant>(`${API_ROUTES.plants.update}${id}`, data);
  },

  /**
   * Delete a plant by ID (soft delete).
   *
   * @param id Unique identifier of the plant to delete.
   * @returns A promise resolving to the deletion confirmation.
   */
  deletePlant: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`${API_ROUTES.plants.delete}${id}`);
  },
};
