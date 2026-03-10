// hooks/usePartnerProfiles.ts
import { useState, useEffect, useCallback } from "react";
import { partnerProfileService } from "../services/apiCalls/partnerProfile";
import { useToast } from "./useToast";
import type {
  PaginationParams,
  PartnerProfileRequest,
  PartnerProfileResponse,
  UsePartnerProfilesOptions,
  UsePartnerProfilesReturn,
} from "../types/partnerProfile";

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

      const response = await partnerProfileService.getAll(params);
      const { success, data, message } = response || {};

      if (success && data) {
        const { professionals, currentPage, totalPages, totalCount, limit } = data;

        if (Array.isArray(professionals)) {
          setPartners(professionals);
        } else {
          console.warn("Unexpected professionals format:", professionals);
          setPartners([]);
        }

        setCurrentPage(currentPage ?? 1);
        setTotalPages(totalPages ?? 0);
        setTotalCount(totalCount ?? 0);
        setLimit(limit ?? 5);
      } else {
        setError(message || "Failed to fetch partners");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Network or unknown error occurred"
      );
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
  const registerPartner = async (
    partnerId: string,
    email: string
  ): Promise<void> => {
    try {
      const response = await partnerProfileService.register({
        professionalId: partnerId,
        email,
      });

      if (response?.success) {
        showSuccess("Partner registered successfully!");
        setPartners((prev) =>
          prev.map((p) =>
            p.id === partnerId ? { ...p, registered: true } : p
          )
        );
      } else {
        showError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Register partner error:", err);
      showError("An error occurred while registering the partner.");
      throw err;
    }
  };

  /**
   * Updates an existing partner profile.
   * FIX: throws on API failure so the modal stays open and the user sees the error.
   *
   * @param id The ID of the partner to update.
   * @param data Updated partner profile fields.
   */
  const updatePartner = async (
    id: string,
    data: Partial<PartnerProfileRequest>
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
 * Fetches a partner profile by its unique ID.
 *
 * @param {string} id  The unique identifier of the partner profile.
 * @returns {Promise<PartnerProfileResponse | null>} The partner profile if found, otherwise null.
 */
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
    uploadPartnersCsv,
    registerPartner,
    updatePartner,
    deletePartner,
    refetch,
    updatePartnerRating,
    getPartnerById,
  };
};