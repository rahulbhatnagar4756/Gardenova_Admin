import { useState, useEffect } from "react";
import { mockService } from "../services/mockService";
import type { Lead } from "../types";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await mockService.getLeads();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLeadStatus = async (id: string, status: string) => {
    const updatedLead = await mockService.updateLeadStatus(id, status);
    setLeads((prev) => prev.map((l) => (l.id === id ? updatedLead : l)));
  };

  return {
    leads,
    loading,
    error,
    updateLeadStatus,
    refetch: fetchLeads,
  };
};
