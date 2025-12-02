import { useState, useEffect, useCallback } from "react";
import { knowledgeLibraryService } from "../services/apiCalls/knowledgeLibrary";
import type {
  CreatePlantData,
  Plant,
  PlantsData,
  UpdatePlantData,
} from "../types/plants";
/**
 * Custom hook to manage plants (knowledge library), pagination, and related state.
 *
 * @returns {object} Plants data, pagination state, loading state, and helper functions.
 */
export const useKnowledgeLibrary = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(6); // default items per page
  const [search, setSearch] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches plants with pagination.
   *
   * @param {number} page The page number to fetch.
   * @param {number} pageLimit The number of items per page.
   * @returns {Promise<void>}
   */
  const fetchPlants = useCallback(
    async (page: number = 1, pageLimit: number = limit) => {
      try {
        setLoading(true);
        setError(null);
        const response = await knowledgeLibraryService.getAllPlants(
          page,
          pageLimit,
          search
        );

        if (response.success) {
          const apiData: PlantsData = response.data;

          setCurrentPage(apiData.currentPage);
          setTotalPages(apiData.totalPages);
          setTotalCount(apiData.totalCount);
          setLimit(apiData.limit);
          setPlants(apiData.plants);
        } else {
          setError(response.message || "Failed to load plants");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch plants");
      } finally {
        setLoading(false);
      }
    },
    [limit, search]
  );

  /**
   * Navigates to a specific page and fetches plants for that page.
   *
   * @param {number} page The page number to navigate to.
   * @returns {void}
   */
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchPlants(page, limit);
  };

  // Debounce search: wait 400ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      fetchPlants(1, limit);
    }, 400);

    return () => clearTimeout(t);
  }, [search, fetchPlants, limit]);

  // Manual refetch with current pagination settings
  const refetch = useCallback(async () => {
    await fetchPlants(currentPage, limit);
  }, [fetchPlants, currentPage, limit]);

  /**
   * Creates a new plant.
   *
   * @param {CreatePlantData} data The plant data to create.
   * @returns {Promise<void>} - Resolves when the plant is created.
   */
  const createPlant = async (data: CreatePlantData) => {
    try {
      setError(null);
      const response = await knowledgeLibraryService.createPlant(data);

      if (!response.success) {
        throw new Error(response.message || "Failed to create plant");
      }

      // Refresh the list after creation
      await refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create plant";
      setError(message);
      throw err;
    }
  };

  /**
   * Gets a specific plant by ID.
   *
   * @param {string} id The ID of the plant to fetch.
   * @returns {Promise<Plant>} - The plant data.
   */
  const getPlantById = async (id: string): Promise<Plant> => {
    try {
      setError(null);
      const response = await knowledgeLibraryService.getPlantById(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch plant");
      }

      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch plant";
      setError(message);
      throw err;
    }
  };

  /**
   * Updates a plant by ID.
   *
   * @param {string} id The ID of the plant to update.
   * @param {UpdatePlantData} data The updated plant data.
   * @returns {Promise<void>} - Resolves when the plant is updated.
   */
  const updatePlant = async (id: string, data: UpdatePlantData) => {
    try {
      setError(null);
      const response = await knowledgeLibraryService.updatePlant(id, data);

      if (!response.success) {
        throw new Error(response.message || "Failed to update plant");
      }

      // Refresh the list after update
      await refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update plant";
      setError(message);
      throw err;
    }
  };

  /**
   * Deletes a plant by ID (soft delete).
   *
   * @param {string} id The ID of the plant to delete.
   * @returns {Promise<void>} - Resolves when the plant is deleted.
   */
  const deletePlant = async (id: string) => {
    try {
      setError(null);
      const response = await knowledgeLibraryService.deletePlant(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete plant");
      }

      // Refresh the list after deletion
      await refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete plant";
      setError(message);
      throw err;
    }
  };

  return {
    plants,
    loading,
    error,
    // CRUD operations
    createPlant,
    getPlantById,
    updatePlant,
    deletePlant,
    // pagination state
    currentPage,
    totalPages,
    totalCount,
    limit,
    search,
    setSearch,
    // actions
    goToPage,
    setLimit, // allow UI to change limit
    refetch: fetchPlants,
  };
};
