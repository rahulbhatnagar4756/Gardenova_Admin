import { useCallback, useEffect, useState } from "react";
import type { LeadRow, LeadsApiResponse, RawLeadRow } from "../types/lead";
import { leadService } from "../services/apiCalls/leadService";

/**
 * Formats a raw lead row object into a normalized LeadRow structure.
 *
 * @param {RawLeadRow} raw  The raw lead data received from the source (e.g., API or database).
 * @returns {LeadRow} A formatted lead row object with mapped and renamed properties.
 */
const formatRow = (raw: RawLeadRow): LeadRow => ({
  leadId: raw.lead_id,
  leadsStatus: raw.leads_status,
  quoterId: raw.quoter_id,
  quoterName: raw.quoter_name,
  quoterEmail: raw.quoter_email,
  partnerId: raw.partner_id,
  partnerDisplayName: raw.partner_display_name,
  partnerImageUrl: raw.partner_image_url,
  partnerSpeciality: raw.partner_speciality,
  partnerAddress: raw.partner_address,
  partnerCity: raw.partner_city,
  partnerState: raw.partner_state,
});
/**
 * Custom React hook to manage and fetch paginated leads data.
 *
 * Handles:
 * - Fetching leads from the API
 * - Pagination (current page, total pages)
 * - Loading and error states
 * - Data transformation using `formatRow`
 *
 * @returns {{
 *   rows: LeadRow[],
 *   loading: boolean,
 *   error: string | null,
 *   currentPage: number,
 *   totalPages: number,
 *   totalCount: number,
 *   limit: number,
 *   goToPage: (page: number) => void,
 *   setLimit: (limit: number) => void,
 *   refetch: (page?: number, pageLimit?: number) => Promise<void>
 * }} Leads state and helper functions
 */
export const useLeads = () => {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(
    async (page: number = 1, pageLimit: number = limit) => {
      try {
        setLoading(true);
        setError(null);

        const response = await leadService.getAllLeads(page, pageLimit);

        if (response.success) {
          const apiData: LeadsApiResponse = response.data;

          setCurrentPage(apiData.page);
          setTotalPages(apiData.totalPages);
          setTotalCount(apiData.total);
          setLimit(apiData.limit);
          setRows(apiData.leads.map(formatRow));
        } else {
          setError(response.message || "Failed to load leads");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    },
     // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // no dependency on limit — avoids double-fetch on mount
  );
/**
 * Navigates to a specific page and triggers a data fetch.
 *
 * Ensures the requested page is within valid bounds before fetching.
 *
 * @param {number} page  The page number to navigate to
 * @returns {void}
 */
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchLeads(page, limit);
  };

  useEffect(() => {
    fetchLeads(1, limit);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    rows,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit,
    goToPage,
    setLimit,
    refetch: fetchLeads,
  };
};