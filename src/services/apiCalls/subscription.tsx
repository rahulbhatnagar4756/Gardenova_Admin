import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  SubscriptionPlan,
  SubscriptionPlansResponse,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from "../../types/subscription";
import { API_ROUTES } from "../apiRoutes";

/**
 * Subscription Service
 *
 * Provides all API operations related to subscription plans,
 * including fetching, creating, updating, and toggling plan status.
 */
export const subscriptionService = {
  /**
   * Fetch all subscription plans.
   *
   * GET /subscription
   *
   * @returns Promise resolving to an API response containing all subscription plans
   */
  getAllPlans: async (): Promise<ApiResponse<SubscriptionPlansResponse>> => {
    return apiService.get<SubscriptionPlansResponse>(
      API_ROUTES.subscriptionPlans.getAllPlans
    );
  },

  /**
   * Create a new subscription plan.
   *
   * POST /subscription
   *
   * @param data Payload containing new subscription plan details
   * @returns Promise resolving to an API response with the created plan
   */
  createPlan: async (
    data: CreateSubscriptionPlanRequest
  ): Promise<ApiResponse<SubscriptionPlan>> => {
    return apiService.post<SubscriptionPlan>(
      API_ROUTES.subscriptionPlans.createPlan,
      data
    );
  },

  /**
   * Update an existing subscription plan.
   *
   * PUT /subscription
   *
   * @param data  Updated subscription plan payload
   * @returns Promise resolving to an API response with the updated plan
   */
  updatePlan: async (
    data: UpdateSubscriptionPlanRequest
  ): Promise<ApiResponse<SubscriptionPlan>> => {
    return apiService.put<SubscriptionPlan>(
      API_ROUTES.subscriptionPlans.updatePlan,
      data
    );
  },

  /**
   * Update the status of a subscription plan by ID.
   *
   * PATCH /subscription/status/:id
   *
   * @param id  Unique identifier of the subscription plan
   * @param status  New status of the plan ("active" or "inactive")
   * @returns Promise resolving to an API response with the updated plan
   */
  updateStatusById: async (
    id: string | undefined,
    status: "active" | "inactive"
  ): Promise<ApiResponse<SubscriptionPlan>> => {
    return apiService.patch<SubscriptionPlan>(
      `${API_ROUTES.subscriptionPlans.updateStatus}/${id}`,
      { status }
    );
  },

  /**
   * Update a subscription plan by ID.
   *
   * PUT /subscription/:id
   *
   * @param id  Unique identifier of the subscription plan
   * @param data  Updated subscription plan fields (excluding ID)
   * @returns Promise resolving to an API response with the updated plan
   */
  updatePlanById: async (
    id: string,
    data: UpdateSubscriptionPlanRequest
  ): Promise<ApiResponse<SubscriptionPlan>> => {
    // Backend expects: PUT /subscription/update
    // With ID in the request body, not in the URL
    return apiService.put<SubscriptionPlan>(
      API_ROUTES.subscriptionPlans.updatePlan,
      {
        id,  // Include ID in the body
        ...data
      }
    );
  },
};
