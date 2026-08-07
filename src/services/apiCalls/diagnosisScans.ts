import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  DiagnosisScan,
  DiagnosisScansFilters,
  DiagnosisScansListData,
} from "../../types/diagnosisScans";
import { API_ROUTES } from "../apiRoutes";

/**
 * Builds a query string from pagination + filter values, omitting empties.
 *
 * @param page Current page number.
 * @param limit Items per page.
 * @param filters Optional search and filter values.
 * @returns Encoded query string for the diagnosis scans endpoint.
 */
const buildQuery = (
  page: number,
  limit: number,
  filters: DiagnosisScansFilters = {}
): string => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.disease?.trim()) params.set("disease", filters.disease.trim());
  if (filters.userId?.trim()) params.set("userId", filters.userId.trim());
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  return params.toString();
};

export const diagnosisScansService = {
  /**
   * Fetch paginated diagnosis scan logs.
   *
   * @param page Page number to fetch (default: 1).
   * @param limit Items per page (default: 20).
   * @param filters Optional search and filter values.
   * @returns A promise resolving to paginated diagnosis scans.
   */
  getAll: (
    page: number = 1,
    limit: number = 20,
    filters: DiagnosisScansFilters = {}
  ): Promise<ApiResponse<DiagnosisScansListData>> =>
    apiService.get<DiagnosisScansListData>(
      `${API_ROUTES.admin.diagnosisScans}?${buildQuery(page, limit, filters)}`
    ),

  /**
   * Fetch a single diagnosis scan detail (includes raw_result summary).
   *
   * @param id Scan UUID.
   * @returns A promise resolving to the diagnosis scan detail payload.
   */
  getById: (id: string): Promise<ApiResponse<DiagnosisScan>> =>
    apiService.get<DiagnosisScan>(
      `${API_ROUTES.admin.diagnosisScanById}/${id}`
    ),
};
