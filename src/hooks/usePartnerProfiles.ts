import { useState, useEffect } from "react";
import { partnerProfileService } from "../services/apiCalls/partnerProfileService";
import type {
  PartnerProfileResponse,
  PartnerProfileRequest,
} from "../services/apiCalls/partnerProfileService";

export const usePartnerProfiles = () => {
  const [partners, setPartners] = useState<PartnerProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await partnerProfileService.getAll();

      // Support both wrapped and direct response formats
      const { success, data: partnersData, message } = response || {};

      if (success) {
        if (Array.isArray(partnersData)) {
          setPartners(partnersData);
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
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const createPartner = async (data: PartnerProfileRequest) => {
    debugger;
    try {
      const response = await partnerProfileService.create(data);
      if (response?.success) {
        await fetchPartners(); // Refresh list after creation
      } else {
        console.error("Create partner failed:", response?.data);
      }
    } catch (err) {
      console.error("Create partner error:", err);
    }
  };

  const updatePartner = async (
    id: string,
    data: Partial<PartnerProfileRequest>
  ) => {
    try {
      debugger;
      const response = await partnerProfileService.update(id, data);
      if (response?.success && response.data) {
        setPartners((prev) =>
          prev.map((p) => (p._id === id ? response.data.data : p))
        );
      } else {
        console.error("Update partner failed:", response?.data);
      }
    } catch (err) {
      console.error("Update partner error:", err);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const response = await partnerProfileService.delete(id);
      if (response?.data?.success) {
        setPartners((prev) => prev.filter((p) => p._id !== id));
      } else {
        console.error("Delete partner failed:", response?.data);
      }
    } catch (err) {
      console.error("Delete partner error:", err);
    }
  };

  return {
    partners,
    loading,
    error,
    createPartner,
    updatePartner,
    deletePartner,
    refetch: fetchPartners,
  };
};
