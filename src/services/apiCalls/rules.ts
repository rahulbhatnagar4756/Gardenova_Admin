import { apiService } from "..";
import type { ApiResponse } from "../../types";
import { API_ROUTES } from "../apiRoutes";

// Types for Rule operations
export interface RuleCondition {
  questionId: string; // send ID from frontend
  operator: "equals" | "in" | "and" | "or";
  values: string[];
  questionText?: string; // comes from backend in getAllRules
}

export interface Rule {
  id: string;
  name: string;
  conditions: RuleCondition[];
}

export interface CreateRuleRequest {
  name: string;
  conditions: {
    questionId: string;
    operator: "equals" | "in" | "and" | "or";
    values: string[];
  }[];
}

export interface UpdateRuleRequest {
  name: string;
  conditions: {
    questionId: string;
    operator: "equals" | "in" | "and" | "or";
    values: string[];
  }[];
}

export interface RulesResponse {
  rules: Rule[];
}

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
