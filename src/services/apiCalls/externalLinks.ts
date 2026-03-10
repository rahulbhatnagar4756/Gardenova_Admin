import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  
  ExternalLinksResponse,
  CreateExternalLinkRequest,
  UpdateExternalLinkRequest,
} from "../../types/externalLinks";
import { API_ROUTES } from "../apiRoutes";

/**
 * External Links Service
 * Contains all API calls related to external links configuration.
 * Used by Admin panel to manage WebView links.
 */
export const externalLinksService = {
  /**
   * Fetch all external links.
   * GET /admin/external-links
   *
   * @returns A promise resolving to an ApiResponse containing external links.
   */
  getExternalLinks: async (): Promise<
    ApiResponse<ExternalLinksResponse>
  > => {
    return apiService.get<ExternalLinksResponse>(
      API_ROUTES.externalLinks.getAll
    );
  },

  /**
   * Create a new external link.
   * POST /admin/external-links
   *
   * @param data Payload containing key, title, url, and is_active flag.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  createExternalLink: async (
    data: CreateExternalLinkRequest
  ): Promise<ApiResponse<null>> => {
    return apiService.post<null>(
      API_ROUTES.externalLinks.create,
      data
    );
  },

  /**
   * Update an existing external link.
   * PUT /admin/external-links
   *
   * @param data Payload containing id and updated fields.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  updateExternalLink: async (
    data: UpdateExternalLinkRequest
  ): Promise<ApiResponse<null>> => {
    return apiService.put<null>(
      API_ROUTES.externalLinks.update,
      data
    );
  },

  /**
   * Delete an external link by ID.
   * DELETE /admin/external-links/:id
   *
   * @param id External link ID.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  deleteExternalLink: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    return apiService.delete<null>(
      API_ROUTES.externalLinks.delete + `${id}`
    );
  },
};
