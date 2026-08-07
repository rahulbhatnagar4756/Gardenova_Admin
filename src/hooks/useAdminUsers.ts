import { useCallback, useEffect, useState } from "react";
import { adminUsersService } from "../services/apiCalls/adminUsers";
import type {
  AdminUser,
  AdminUsersFilters,
} from "../types/adminUsers";

/**
 * Fetches and paginates the admin users list with server-side filters.
 *
 * @param initialLimit Initial items per page (default: 20).
 * @returns Users list state, pagination helpers, filters, and detail fetcher.
 */
export const useAdminUsers = (initialLimit: number = 20) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<AdminUsersFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = useCallback(
    async (
      page: number = 1,
      pageLimit: number = limit,
      nextFilters: AdminUsersFilters = filters
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminUsersService.getAll(
          page,
          pageLimit,
          nextFilters
        );

        if (response.success) {
          const data = response.data;
          setUsers(data.users ?? []);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
          setLimit(data.limit);
        } else {
          setError(response.message || "Failed to load users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    },
    [filters, limit]
  );

  /**
   * Navigates to a page and fetches users for that page.
   *
   * @param page Target page number.
   * @returns {void}
   */
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchUsers(page, limit, filters);
  };

  const updateFilters = useCallback((patch: Partial<AdminUsersFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  /**
   * Loads a single user detail record by id.
   *
   * @param id User UUID.
   * @returns The user detail, or null when the request fails.
   */
  const getUserById = async (id: string): Promise<AdminUser | null> => {
    try {
      setDetailLoading(true);
      setError(null);
      const response = await adminUsersService.getById(id);
      if (response.success) return response.data;
      setError(response.message || "Failed to load user");
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, limit, filters);
  }, [filters, fetchUsers, limit]);

  return {
    users,
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
    getUserById,
    refetch: fetchUsers,
  };
};
