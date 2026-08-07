import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  AdminUser,
  AdminUsersFilters,
  AdminUsersListData,
} from "../../types/adminUsers";
import { API_ROUTES } from "../apiRoutes";

/**
 * Builds a query string from pagination + filter values, omitting empties.
 *
 * @param page Current page number.
 * @param limit Items per page.
 * @param filters Optional search and filter values.
 * @returns Encoded query string for the users list endpoint.
 */
const buildQuery = (
  page: number,
  limit: number,
  filters: AdminUsersFilters = {}
): string => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.tier) params.set("tier", filters.tier);
  if (filters.accountStatus) params.set("accountStatus", filters.accountStatus);
  if (filters.signupFrom) params.set("signupFrom", filters.signupFrom);
  if (filters.signupTo) params.set("signupTo", filters.signupTo);
  if (filters.subscriptionStatus) {
    params.set("subscriptionStatus", filters.subscriptionStatus);
  }

  return params.toString();
};

export const adminUsersService = {
  /**
   * Fetch paginated admin users with optional search/filters.
   *
   * @param page Page number to fetch (default: 1).
   * @param limit Items per page (default: 20).
   * @param filters Optional search and filter values.
   * @returns A promise resolving to paginated admin users.
   */
  getAll: (
    page: number = 1,
    limit: number = 20,
    filters: AdminUsersFilters = {}
  ): Promise<ApiResponse<AdminUsersListData>> =>
    apiService.get<AdminUsersListData>(
      `${API_ROUTES.admin.users}?${buildQuery(page, limit, filters)}`
    ),

  /**
   * Fetch a single admin user with subscription history.
   *
   * @param id User UUID.
   * @returns A promise resolving to the admin user detail payload.
   */
  getById: (id: string): Promise<ApiResponse<AdminUser>> =>
    apiService.get<AdminUser>(`${API_ROUTES.admin.userById}/${id}`),
};
