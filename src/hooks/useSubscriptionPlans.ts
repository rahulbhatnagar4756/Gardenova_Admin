import { useEffect, useState } from "react";
import { subscriptionService } from "../services/apiCalls/subscription";
import type {
  CreateSubscriptionPlanRequest,
  SubscriptionPlan,
  SubscriptionPlanForm,
  UpdateSubscriptionPlanRequest
} from "../types/subscription";
import { useToast } from "./useToast";

/**
 * Custom hook to manage subscription plans.
 *
 * Provides fetching, creating, updating, and status toggling functionality
 * for subscription plans, along with modal state management.
 *
 * @returns {object} API for interacting with subscription plans.
 */
export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const { showError, showSuccess } = useToast();

  /**
   * Fetch all subscription plans from the backend.
   */
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await subscriptionService.getAllPlans();
      if (res.success) {
        setPlans(res.data.plans);
        setError(null);
      } else {
        setError(res.message || "Failed to fetch subscription plans");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle a subscription plan's status (active/inactive).
   *
   * @param {SubscriptionPlan} plan  The plan whose status to toggle
   */
  const togglePlanStatus = async (plan: SubscriptionPlan) => {
    setLoading(true);
    try {
      const res = await subscriptionService.updateStatusById(
        plan.id,
        plan.status === "active" ? "inactive" : "active"
      );

      if (res.success) {
        showSuccess(`Plan "${plan.plan_name}" status updated`);
        await fetchPlans();
      } else {
        showError(res.message || "Failed to update status");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message || "Error toggling status");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open modal for adding a new subscription plan.
   */
  const openAddModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing an existing subscription plan.
   *
   * @param {SubscriptionPlan} plan  Plan to edit
   */
  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  /**
   * Close the subscription plan modal.
   * @returns {void}
   */
  const closeModal = (): void => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  /**
   * Save a subscription plan (create new or update existing).
   *
   * @param {SubscriptionPlanForm} formData Plan form data
   * @param {boolean} isEdit Whether this is an edit (true) or create (false)
   * @returns {Promise<void>}
   */
  const savePlan = async (formData: SubscriptionPlanForm, isEdit: boolean): Promise<void> => {
    setLoading(true);
    try {
      if (isEdit && editingPlan) {
        // For update: extract only the fields needed (no plan_name, no id)
        const updateData: UpdateSubscriptionPlanRequest = {
          plan_name: formData.plan_name,
          description: formData.description,
          price_monthly: formData.price_monthly,
          price_annual: formData.price_annual,
          leads_limit: formData.leads_limit,
          cities_coverage: formData.cities_coverage,
          appear_in_search: formData.appear_in_search,
          premium_profile_badge: formData.premium_profile_badge       ,
          status: formData.status,
          priority_customer_support: formData.priority_customer_support
        };

        const res = await subscriptionService.updatePlanById(
          editingPlan.id,
          updateData
        );

        if (res.success) {
          showSuccess("Subscription plan updated successfully");
        } else {
          showError(res.message || "Failed to update plan");
        }
      } else {
        // For create: use all fields from form
        const createData: CreateSubscriptionPlanRequest = {
          plan_name: formData.plan_name,
          description: formData.description,
          price_monthly : formData.price_monthly,
          price_annual: formData.price_annual,
          leads_limit: formData.leads_limit,
          cities_coverage: formData.cities_coverage,
          appear_in_search: formData.appear_in_search,
          premium_profile_badge: formData.premium_profile_badge,
          priority_customer_support: formData.priority_customer_support,
          status: formData.status,
        };

        const res = await subscriptionService.createPlan(createData);
        
        if (res.success) {
          showSuccess("Subscription plan created successfully");
        } else {
          showError(res.message || "Failed to create plan");
        }
      }

      closeModal();
      await fetchPlans();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message || "Something went wrong while saving plan");
    } finally {
      setLoading(false);
    }
  };

  /** Show toast whenever error changes */
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  /** Fetch plans on mount */
  useEffect(() => {
    fetchPlans();
    
  }, []);

  return {
    plans,
    loading,
    error,
    isModalOpen,
    editingPlan,
    openAddModal,
    openEditModal,
    closeModal,
    savePlan,
    togglePlanStatus,
  };
};