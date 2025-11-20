import { useState, useEffect, useCallback } from "react";
import { partnerProfileService } from "../services/apiCalls/partnerProfile";
import { useToast } from "./useToast";
import type {
  PaginatedPartnerProfilesResponse,
  PaginationParams,
  PartnerProfileRequest,
  PartnerProfileResponse,
  UsePartnerProfilesOptions,
  UsePartnerProfilesReturn,
} from "../types/partnerProfile";

export const usePartnerProfiles = (
  options: UsePartnerProfilesOptions = {}
): UsePartnerProfilesReturn => {
  const { initialPage = 1, initialLimit = 5, autoFetch = true } = options;

  const [partners, setPartners] = useState<PartnerProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(initialLimit);
  const { showSuccess, showError } = useToast();

  const fetchPartners = useCallback(async (params?: PaginationParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await partnerProfileService.getAll(params);

      // Support both wrapped and direct response formats
      const { success, data: partnersData, message } = response || {};

      if (success && partnersData) {
        // Ensure correct typing
        const data = partnersData as PaginatedPartnerProfilesResponse;

        if (Array.isArray(data.profiles)) {
          setPartners(data.profiles);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
          setLimit(data.limit);
        } else {
          console.warn(
            "Unexpected data format, forcing empty list:",
            partnersData
          );
          setPartners([]);
        }
      } else {
        setError(message || "Failed to fetch partners");
        console.error("API responded with an error:", message);
      }
    } catch (err: unknown) {
      console.error("Fetch partners failed:", err);
      setError(
        err instanceof Error ? err.message : "Network or unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Navigate to specific page
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  // Navigate to next page
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  // Navigate to previous page
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Change items per page
  const setItemsPerPage = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  }, []);

  // Manual refetch with current pagination settings
  const refetch = useCallback(async () => {
    await fetchPartners({ page: currentPage, limit });
  }, [fetchPartners, currentPage, limit]);

  // Create partner
  const createPartner = async (data: PartnerProfileRequest) => {
    try {
      const response = await partnerProfileService.create(data);
      if (response?.success) {
        await refetch(); // Refresh list after creation
        showSuccess("Partner saved successfully!");
      } else {
        showError(
          response?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("Create partner error:", err);
      throw err;
    }
  };

  // Update partner
  const updatePartner = async (
    id: string,
    data: Partial<PartnerProfileRequest>
  ) => {
    try {
      const response = await partnerProfileService.update(id, data);
      if (response?.success) {
        await refetch();
        showSuccess("Partner updated successfully!");
      } else {
        showError(response?.message || "Update partner failed");
      }
    } catch (err) {
      console.error("Update partner error:", err);
      throw err;
    }
  };

  // Delete partner
  const deletePartner = async (id: string) => {
    try {
      const response = await partnerProfileService.delete(id);
      if (response?.data?.success || response?.success) {
        // Remove from current list
        setPartners((prev) => prev.filter((p) => p.id !== id));

        // If current page becomes empty and it's not the first page, go to previous page
        if (partners.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          // Otherwise, refetch to update pagination
          await refetch();
        }
      } else {
        console.error("Delete partner failed:", response?.data);
      }
    } catch (err) {
      console.error("Delete partner error:", err);
      throw err;
    }
  };

  const updatePartnerRating = async (partnerId: string, rating: number) => {
    try {
      const response = await partnerProfileService.updateRating({
        partnerId,
        rating,
      });

      if (response?.success) {
        showSuccess("Partner rating updated successfully!");
        // ✅ Optionally refresh list if you want to show new rating immediately
        await refetch();
      } else {
        showError(response?.message || "Failed to update partner rating");
      }
    } catch (err) {
      console.error("Update partner rating error:", err);
      showError("An error occurred while updating rating");
      throw err;
    }
  };

  const updatePartnerStatus = async (partnerId: string, status: string) => {
    try {
      const response = await partnerProfileService.updateStatus({
        partnerId,
        status: status as "pending" | "approved" | "rejected" | "inactive",
      });

      if (response?.success) {
        showSuccess("Partner status updated successfully!");
        // ✅ Optionally refresh the list to reflect the new status
        await refetch();
      } else {
        showError(response?.message || "Failed to update partner status");
      }
    } catch (err) {
      console.error("Update partner status error:", err);
      showError("An error occurred while updating status");
      throw err;
    }
  };

  // ✅ New: Get partner by ID
  const getPartnerById = async (
    id: string
  ): Promise<PartnerProfileResponse | null> => {
    try {
      const response = await partnerProfileService.getById(id);
      if (response?.success && response.data) {
        return response.data;
      } else {
        showError(response?.message || "Failed to fetch partner profile");
        return null;
      }
    } catch (err) {
      console.error("Get partner by ID error:", err);
      showError("An error occurred while fetching partner profile");
      return null;
    }
  };

  // Fetch on mount if autoFetch is enabled
  useEffect(() => {
    if (autoFetch) {
      fetchPartners({ page: currentPage, limit });
    }
  }, [currentPage, limit, fetchPartners, autoFetch]);

  return {
    partners,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit,
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage,
    createPartner,
    updatePartner,
    deletePartner,
    refetch,
    updatePartnerRating,
    updatePartnerStatus,
    getPartnerById,
  };
};
