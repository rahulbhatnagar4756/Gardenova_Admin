// hooks/usePartnerProfiles.ts
import { useState, useEffect, useCallback } from "react";
import { partnerProfileService, Plants } from "../services/apiCalls/partnerProfile";
import { useToast } from "./useToast";
import type {
  PaginationParams,
   PartnerApiRequest,
  
  PartnerProfileResponse,
  UsePartnerProfilesOptions,
  UsePartnerProfilesReturn,
} from "../types/partnerProfile";
import type { AdminPlant, PaginatedPlantsResponse } from "../types/adminPlants";

/**
 * Custom hook to manage partner profiles including fetching, pagination, and CRUD operations.
 * 
 * @param {UsePartnerProfilesOptions} options  Optional configuration for the hook, including pagination settings and auto-fetch behavior.
 * @returns {UsePartnerProfilesReturn} The state and methods for managing partner profiles.
 */
export const usePartnerProfiles = (
  options: UsePartnerProfilesOptions = {}
): UsePartnerProfilesReturn => {
  const { initialPage = 1, initialLimit = 5, autoFetch = true } = options;
  const [partners, setPartners] = useState<PartnerProfileResponse[]>([]);
  const [plant, setPlant] = useState<AdminPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(initialLimit);

  const { showSuccess, showError } = useToast();
  /**
   * Fetches the partner profiles with pagination support.
   * 
   * @param {PaginationParams} params  Pagination parameters (page and limit).
   */
  const fetchPartners = useCallback(async (params?: PaginationParams) => {
  try {
    setLoading(true);
    setError(null);

    const response = await Plants.AdmingetAll(params);
    const { success, message } = response || {};
    // Cast since service return type hasn't been updated yet
    const data = response?.data as unknown as PaginatedPlantsResponse | undefined;

    if (success && data) {
      const plantList    = data.data        ?? [];
      const page         = data.currentPage ?? 1;
      const pages        = data.totalPages  ?? 0;
      const count        = data.totalCount  ?? 0;
      const itemsPerPage = data.limit       ?? params?.limit ?? 5;

      setPlant(Array.isArray(plantList) ? plantList : []);
      setCurrentPage(page);
      setTotalPages(pages);
      setTotalCount(count);
      setLimit(itemsPerPage);
    } else {
      setError(message || "Failed to fetch plants");
    }
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Network or unknown error occurred");
  } finally {
    setLoading(false);
  }
}, []);
  /**
   * Changes the current page in the pagination.
   * 
   * @param {number} page  The page number to navigate to.
   */
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages]
  );
  /**
   * Moves to the next page in the pagination.
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);
  /**
   * Moves to the previous page in the pagination.
   */ 
  const previousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);
  /**
   * Sets the number of items per page and resets the pagination to the first page.
   * 
   * @param {number} newLimit  The new limit of items per page.
   */
  const setItemsPerPage = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  }, []);

  const refetch = useCallback(async () => {
    await fetchPartners({ page: currentPage, limit });
  }, [fetchPartners, currentPage, limit]);
/**
 * Uploads a CSV file containing partner profiles and refreshes the list after a successful upload.
 *
 * @param {File} file  The CSV file containing partner data.
 * @returns {Promise<void>} Resolves when the upload process completes.
 */
  const uploadPartnersCsv = async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await partnerProfileService.uploadCsv(formData);
      if (response?.success) {
        showSuccess(response.message || "Partners uploaded successfully!");
        await refetch();
      } else {
        showError(response?.message || "CSV upload failed. Please try again.");
      }
    } catch (err) {
      console.error("CSV upload error:", err);
      showError("An error occurred while uploading the CSV.");
      throw err;
    }
  };
/**
 * Registers a partner by sending their professional ID and email to the API.
 * Updates the local partner list if registration succeeds.
 *
 * @param {string} partnerId The unique ID of the partner to register.
 * @param {string} email  The email address used for partner registration.
 * @returns {Promise<void>} Resolves when the registration process completes.
 */

  //   partnerId: string,
  //   email: string
  // ): Promise<void> => {
  //   try {
  //     const response = await partnerProfileService.register({
  //       professionalId: partnerId,
  //       email,
  //     });

  //     if (response?.success) {
  //       showSuccess("Partner registered successfully!");
  //       setPartners((prev) =>
  //         prev.map((p) =>
  //           p.id === partnerId ? { ...p, registered: true } : p
  //         )
  //       );
  //     } else {
  //       showError(response?.message || "Registration failed. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Register partner error:", err);
  //     showError(err instanceof Error ? err.message : "An error occurred during registration.");
  //     throw err;
  //   }
  // };

  /**
   * Updates an existing partner profile.
   * FIX: throws on API failure so the modal stays open and the user sees the error.
   *
   * @param id The ID of the partner to update.
   * @param data Updated partner profile fields.
   */
  const updatePartner = async (
  id: string,
  data: Partial<PartnerApiRequest>   // ← was PartnerProfileRequest
) => {
    try {
      console.log("Updating partner with ID:", id, "Data:", data);
      const response = await partnerProfileService.update(id, data);
      if (response?.success) {
        showSuccess("Partner updated successfully!");
        await refetch(); // refresh the table after confirming success
      } else {
        const msg = response?.message || "Update partner failed";
        showError(msg);
        throw new Error(msg); // ✅ throw so PartnerViewModal stays open on failure
      }
    } catch (err) {
      console.error("Update partner error:", err);
      throw err; // always re-throw so callers can react
    }
  };
/**
 * Deletes a partner profile by ID and updates the local partner list.
 * Adjusts pagination if the last item on the page was removed.
 *
 * @param {string} id  The unique ID of the partner to delete.
 * @returns {Promise<void>} Resolves when the delete operation completes.
 */
  const deletePartner = async (id: string) => {
    try {
      const response = await partnerProfileService.delete(id);
      if (response?.data?.success || response?.success) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        if (partners.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
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
/**
 * Updates the rating of a specific partner.
 *
 * @param {string} partnerId  The unique ID of the partner whose rating will be updated.
 * @param {number} rating  The new rating value to assign to the partner.
 * @returns {Promise<void>} Resolves when the rating update process completes.
 */
  const updatePartnerRating = async (partnerId: string, rating: number) => {
    try {
      const response = await partnerProfileService.updateRating({ professionalId: partnerId, rating });
      if (response?.success) {
        showSuccess("Partner rating updated successfully!");
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
/**
 * API response containing a single plant record.
 */
  interface SinglePlantApiResponse {
  plant: AdminPlant;
}
/**
 * Fetches a partner profile by its unique ID.
 *
 * @param {string} id  The unique identifier of the partner profile.
 * @returns {Promise<AdminPlant | null>} The partner profile if found, otherwise null.
 */
const getPartnerById = async (id: string): Promise<AdminPlant | null> => {
  try {
    const response = await Plants.AdmingetById(id);
    if (response?.success && response.data) {
      const data = response.data as unknown as SinglePlantApiResponse;
      const plant = data.plant ?? (response.data as unknown as AdminPlant);
      return plant;
    } else {
      showError(response?.message || "Failed to fetch plant details");
      return null;
    }
  } catch (err) {
    console.error("Get plant by ID error:", err);
    showError("An error occurred while fetching plant details");
    return null;
  }
};
/**
 * Updates the founder status of a partner profile.
 *
 * This function calls the backend service to toggle the founder status,
 * shows success/error notifications, and refreshes the data on success.
 *
 * @param {string} id  The partner/professional ID to update
 * @param {boolean} isFounder  Desired founder status (true = founder, false = not founder)
 *
 * @returns {Promise<void>} Resolves after update completes and refetch is triggered
 *
 * @throws Will rethrow error after showing error notification
 */
  const updateFounderStatus = async (id: string, isFounder: string) => {
    try {
      const response = await partnerProfileService.updateFounderStatus(id, isFounder);
      if (response?.success) {
        showSuccess("Partner founder status updated successfully!");
        await refetch();
      } else {
        showError(response?.message || "Failed to update founder status");
      }
    } catch (err) {
      console.error("Update founder status error:", err);
      showError("An error occurred while updating founder status");
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchPartners({ page: currentPage, limit });
    }
  }, [currentPage, limit, fetchPartners, autoFetch]);

  return {
    plant,
    // partners,
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
    uploadPartnersCsv,
    updateFounderStatus,
    updatePartner,
    deletePartner,
    refetch,
    updatePartnerRating,
    getPartnerById,
  };
};