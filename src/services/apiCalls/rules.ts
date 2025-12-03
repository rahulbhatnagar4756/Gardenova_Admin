import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  CreateRuleRequest,
  Rule,
  RulesResponse,
  UpdateRuleRequest,
} from "../../types/rules";
import { API_ROUTES } from "../apiRoutes";

/**
 * Rule Service - Contains all rule-related API calls.
 * Provides CRUD operations for creating, reading, updating,
 * and deleting rules used in diagnostic logic.
 */
export const ruleService = {
  /**
   * Fetch all rules from the backend.
   * GET /rule
   *
   * @returns A promise resolving to an ApiResponse containing an array of rules.
   */
  getAllRules: async (): Promise<ApiResponse<RulesResponse>> => {
    return apiService.get<RulesResponse>(API_ROUTES.rules.getAllRules);
  },

  /**
   * Create a new rule.
   * POST /rule
   *
   * @param data The rule creation payload including conditions and name.
   * @returns A promise resolving to an ApiResponse containing the created rule.
   */
  createRule: async (data: CreateRuleRequest): Promise<ApiResponse<Rule>> => {
    return apiService.post<Rule>(API_ROUTES.rules.createRule, data);
  },

  /**
   * Update an existing rule by ID.
   * PUT /rule/:id
   *
   * @param id Unique ID of the rule being updated.
   * @param data Updated rule payload containing conditions or name.
   * @returns A promise resolving to an ApiResponse containing the updated rule.
   */
  updateRule: async (
    id: string,
    data: UpdateRuleRequest
  ): Promise<ApiResponse<Rule>> => {
    return apiService.put<Rule>(`${API_ROUTES.rules.updateRule}${id}`, data);
  },

  /**
   * Delete a rule by its ID.
   * DELETE /rule/:id
   *
   * @param id Unique identifier of the rule to delete.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  deleteRule: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete<null>(`${API_ROUTES.rules.deleteRule}${id}`);
  },
};
