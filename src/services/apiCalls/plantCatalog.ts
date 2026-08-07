import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  PlantCatalogFilters,
  PlantCatalogItem,
  PlantCatalogListData,
} from "../../types/plantCatalog";
import { API_ROUTES } from "../apiRoutes";

/**
 * Builds a query string from pagination + search, omitting empties.
 *
 * @param page Current page number.
 * @param limit Items per page.
 * @param filters Optional search values.
 * @returns Encoded query string for the plant catalog endpoint.
 */
const buildQuery = (
  page: number,
  limit: number,
  filters: PlantCatalogFilters = {}
): string => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  return params.toString();
};

export const plantCatalogService = {
  /**
   * Fetch paginated plant master catalog.
   *
   * @param page Page number to fetch (default: 1).
   * @param limit Items per page (default: 20).
   * @param filters Optional search values.
   * @returns A promise resolving to paginated plant catalog items.
   */
  getAll: (
    page: number = 1,
    limit: number = 20,
    filters: PlantCatalogFilters = {}
  ): Promise<ApiResponse<PlantCatalogListData>> =>
    apiService.get<PlantCatalogListData>(
      `${API_ROUTES.admin.plantCatalog}?${buildQuery(page, limit, filters)}`
    ),

  /**
   * Fetch plant master detail by numeric id.
   *
   * @param id Plant numeric identifier.
   * @returns A promise resolving to the plant catalog detail payload.
   */
  getById: (id: number | string): Promise<ApiResponse<PlantCatalogItem>> =>
    apiService.get<PlantCatalogItem>(
      `${API_ROUTES.admin.plantCatalogById}/${id}`
    ),
};
