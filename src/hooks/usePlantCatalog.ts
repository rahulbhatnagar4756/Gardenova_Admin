import { useCallback, useEffect, useState } from "react";
import { plantCatalogService } from "../services/apiCalls/plantCatalog";
import type {
  PlantCatalogFilters,
  PlantCatalogItem,
} from "../types/plantCatalog";

/**
 * Fetches and paginates the admin plant master catalog.
 *
 * @param initialLimit Initial items per page (default: 20).
 * @returns Plant catalog state, pagination helpers, filters, and detail fetcher.
 */
export const usePlantCatalog = (initialLimit: number = 20) => {
  const [plants, setPlants] = useState<PlantCatalogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<PlantCatalogFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPlants = useCallback(
    async (
      page: number = 1,
      pageLimit: number = limit,
      nextFilters: PlantCatalogFilters = filters
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await plantCatalogService.getAll(
          page,
          pageLimit,
          nextFilters
        );

        if (response.success) {
          const data = response.data;
          setPlants(data.plants ?? []);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
          setLimit(data.limit);
        } else {
          setError(response.message || "Failed to load plant catalog");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch plant catalog"
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, limit]
  );

  /**
   * Navigates to a page and fetches plants for that page.
   *
   * @param page Target page number.
   * @returns {void}
   */
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchPlants(page, limit, filters);
  };

  const updateFilters = useCallback((patch: Partial<PlantCatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  /**
   * Loads a single plant catalog detail by id.
   *
   * @param id Plant numeric identifier.
   * @returns The plant detail, or null when the request fails.
   */
  const getPlantById = async (
    id: number | string
  ): Promise<PlantCatalogItem | null> => {
    try {
      setDetailLoading(true);
      setError(null);
      const response = await plantCatalogService.getById(id);
      if (response.success) return response.data;
      setError(response.message || "Failed to load plant");
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plant");
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants(1, limit, filters);
  }, [filters, fetchPlants, limit]);

  return {
    plants,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit,
    filters,
    detailLoading,
    goToPage,
    setLimit,
    updateFilters,
    getPlantById,
    refetch: fetchPlants,
  };
};
