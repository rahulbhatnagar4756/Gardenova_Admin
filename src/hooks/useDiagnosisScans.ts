import { useCallback, useEffect, useState } from "react";
import { diagnosisScansService } from "../services/apiCalls/diagnosisScans";
import type {
  DiagnosisScan,
  DiagnosisScansFilters,
} from "../types/diagnosisScans";

/**
 * Fetches and paginates admin diagnosis scan logs with filters.
 *
 * @param initialLimit Initial items per page (default: 20).
 * @returns Scans list state, pagination helpers, filters, and detail fetcher.
 */
export const useDiagnosisScans = (initialLimit: number = 20) => {
  const [scans, setScans] = useState<DiagnosisScan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<DiagnosisScansFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchScans = useCallback(
    async (
      page: number = 1,
      pageLimit: number = limit,
      nextFilters: DiagnosisScansFilters = filters
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await diagnosisScansService.getAll(
          page,
          pageLimit,
          nextFilters
        );

        if (response.success) {
          const data = response.data;
          setScans(data.scans ?? []);
          setCurrentPage(data.currentPage);
          setTotalPages(Math.max(data.totalPages, 1));
          setTotalCount(data.totalCount);
          setLimit(data.limit);
        } else {
          setError(response.message || "Failed to load diagnosis scans");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch diagnosis scans"
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, limit]
  );

  /**
   * Navigates to a page and fetches scans for that page.
   *
   * @param page Target page number.
   * @returns {void}
   */
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchScans(page, limit, filters);
  };

  const updateFilters = useCallback(
    (patch: Partial<DiagnosisScansFilters>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  /**
   * Loads a single diagnosis scan detail by id.
   *
   * @param id Scan UUID.
   * @returns The scan detail, or null when the request fails.
   */
  const getScanById = async (id: string): Promise<DiagnosisScan | null> => {
    try {
      setDetailLoading(true);
      setError(null);
      const response = await diagnosisScansService.getById(id);
      if (response.success) return response.data;
      setError(response.message || "Failed to load scan");
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch scan");
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchScans(1, limit, filters);
  }, [filters, fetchScans, limit]);

  return {
    scans,
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
    getScanById,
    refetch: fetchScans,
  };
};
