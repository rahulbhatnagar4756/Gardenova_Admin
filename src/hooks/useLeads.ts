import { useState, useEffect, useCallback } from "react";
import { leadService } from "../services/apiCalls/leadService";
import type { Lead, LeadsResponse, RawLead } from "../types/lead";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5); // default items per page

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatLead = (raw: RawLead): Lead => ({
    id: raw.lead_id,
    userId: raw.user.user_id,
    userName: raw.user.user_name,
    userEmail: raw.user.user_email,
    leadsStatus: raw.leads_status,
    partners: raw.partners.map((p) => ({
      partnerId: p.partner_id,
      companyName: p.company_name,
    })),
  });

  const fetchLeads = useCallback(
    async (page: number = 1, pageLimit: number = limit) => {
      try {
        setLoading(true);
        setError(null);

        const response = await leadService.getAllLeads(page, pageLimit);

        if (response.success) {
          const apiData: LeadsResponse = response.data;

          setCurrentPage(apiData.currentPage);
          setTotalPages(apiData.totalPages);
          setTotalCount(apiData.totalCount);
          setLimit(apiData.limit); // backend-sent limit overwrite

          const formatted = apiData.leads.map(formatLead);
          setLeads(formatted);
        } else {
          setError(response.message || "Failed to load leads");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchLeads(page, limit);
  };

  useEffect(() => {
    fetchLeads(1, limit);
  }, [fetchLeads, limit]);

  // Manual refetch with current pagination settings
  const refetch = useCallback(async () => {
    await fetchLeads(currentPage, limit);
  }, [fetchLeads, currentPage, limit]);

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const response = await leadService.updateLeadStatus(id, {
        leads_status: status,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to update status");
      }

      refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update lead status";
      setError(message);
    }
  };

  return {
    leads,
    loading,
    error,
    updateLeadStatus,

    // pagination state
    currentPage,
    totalPages,
    totalCount,
    limit,

    // actions
    goToPage,
    setLimit, // allow UI to change limit
    refetch: fetchLeads,
  };
};
