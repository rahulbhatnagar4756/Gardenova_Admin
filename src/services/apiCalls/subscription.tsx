import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  RawSubscriptionPlan,
  SubscriptionPlan,
  UpdateSubscriptionPlanRequest,
  CreateSubscriptionPlanRequest,
} from "../../types/subscription";
import { API_ROUTES } from "../apiRoutes";


/**
 * Subscription plan API service layer.
 *
 * Provides methods to fetch, create, and update subscription plans.
 */
export const subscriptionService = {
/**
 * Fetches all subscription plans from the backend.
 *
 * @async
 * @function getAllPlans
 * @returns {Promise<ApiResponse<RawSubscriptionPlan[]>>} List of raw subscription plans
 */
  getAllPlans: async (): Promise<ApiResponse<RawSubscriptionPlan[]>> => {
    return apiService.get<RawSubscriptionPlan[]>(
      API_ROUTES.subscriptionPlans.getAllPlans
    );
  },  // ← comma was missing here
/**
 * Creates a new subscription plan.
 *
 * @async
 * @function createPlan
 * @param {CreateSubscriptionPlanRequest} data  Plan payload
 * @returns {Promise<ApiResponse<SubscriptionPlan>>} Created subscription plan
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
 * Updates the active/inactive status of a subscription plan.
 *
 * @async
 * @function updateStatusById
 * @param {string | undefined} id  Subscription plan ID
 * @param {"active" | "inactive"} status  New plan status
 * @returns {Promise<ApiResponse<SubscriptionPlan>>} Updated subscription plan
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
 * Updates an existing subscription plan by ID.
 *
 * @async
 * @function updatePlanById
 * @param {string} id  Subscription plan ID
 * @param {UpdateSubscriptionPlanRequest} data  Updated plan data
 * @returns {Promise<ApiResponse<SubscriptionPlan>>} Updated subscription plan
 */
  updatePlanById: async (
    id: string,
    data: UpdateSubscriptionPlanRequest
  ): Promise<ApiResponse<SubscriptionPlan>> => {
    return apiService.put<SubscriptionPlan>(
      API_ROUTES.subscriptionPlans.updatePlan,
      { id, ...data }
    );
  },
};