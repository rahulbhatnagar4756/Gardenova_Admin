import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type { CreateRuleRequest, Rule, RulesResponse, UpdateRuleRequest } from "../../types/rules";
import { API_ROUTES } from "../apiRoutes";

/**
 * Rule Service - Contains all rule-related API calls
 */
export const ruleService = {
  /**
   * Get all rules
   * GET /rule
   * Response includes questionId + questionText
   */
  getAllRules: async (): Promise<ApiResponse<RulesResponse>> => {
    return apiService.get<RulesResponse>(API_ROUTES.rules.getAllRules);
  },

  /**
   * Create a new rule
   * POST /rule
   * Requires questionId in request
   */
  createRule: async (data: CreateRuleRequest): Promise<ApiResponse<Rule>> => {
    return apiService.post<Rule>(API_ROUTES.rules.createRule, data);
  },

  /**
   * Update an existing rule
   * PUT /rule/:id
   * Requires questionId in request
   */
  updateRule: async (
    id: string,
    data: UpdateRuleRequest
  ): Promise<ApiResponse<Rule>> => {
    return apiService.put<Rule>(`${API_ROUTES.rules.updateRule}${id}`, data);
  },

  /**
   * Delete a rule
   * DELETE /rule/:id
   */
  deleteRule: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete<null>(`${API_ROUTES.rules.deleteRule}${id}`);
  },
};
