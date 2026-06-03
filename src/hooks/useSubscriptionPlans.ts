import { useCallback, useEffect, useState } from "react";
import { subscriptionService } from "../services/apiCalls/subscription";
import type {
  RawSubscriptionPlan,
  SubscriptionPlan,
  SubscriptionPlanForm,
} from "../types/subscription";
import { useToast } from "./useToast";

/**
 * Normalizes raw subscription plan data by grouping monthly and yearly plans
 * under a single unified structure.
 *
 * - Groups plans by name
 * - Separates monthly and yearly billing periods
 * - Merges both into a single `SubscriptionPlan` format
 *
 * @param {RawSubscriptionPlan[]} rawList  List of raw subscription plans from API
 * @returns {SubscriptionPlan[]} Normalized subscription plans
 */
const normalizeRawPlans = (rawList: RawSubscriptionPlan[]): SubscriptionPlan[] => {
  const grouped: Record<string, { monthly: RawSubscriptionPlan | null; yearly: RawSubscriptionPlan | null }> = {};

  for (const p of rawList) {
    const key = p.name.trim();
    if (!grouped[key]) grouped[key] = { monthly: null, yearly: null };
    const period = p.billing_period.trim().toLowerCase();
    if (period === "monthly") grouped[key].monthly = p;
    else grouped[key].yearly = p;
  }

  return Object.values(grouped).map((g) => {
    const base = (g.monthly ?? g.yearly)!;
    return {
      id: base.plan_id,
      plan_name: base.name.trim(),
      description: base.tier.trim(),
      price_monthly: parseFloat(g.monthly?.price ?? "0"),
      price_annual: parseFloat(g.yearly?.price ?? "0"),
      status: base.plan_status ? "active" : "inactive",
      scans_per_month: base.scans_per_month,
      landscape_gens_per_month: base.landscape_gens_per_month,
      ad_free: base.ad_free,
      priority_support: base.priority_support,
      ai_care_assistant: base.ai_care_assistant,
      hd_renders: base.hd_renders,
      pdf_export: base.pdf_export,
      priority_generation: base.priority_generation,
      premium_styles: base.premium_styles,
      before_after_downloads: base.before_after_downloads,
    };
  });
};
/**
 * Custom hook for managing subscription plans.
 *
 * Features:
 * - Fetches and normalizes subscription plans from API
 * - Supports grouped monthly/yearly plan structure
 * - Handles create, update, and status toggle operations
 * - Manages modal state for add/edit plan forms
 * - Provides loading and error/success feedback via toast notifications
 * @returns {(plan: SubscriptionPlan) => Promise<void>} returns.togglePlanStatus - Toggles active/inactive status
 */
export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const { showError, showSuccess } = useToast();
/**
 * Fetches all subscription plans from the API and normalizes them.
 *
 * - Sets loading state while fetching
 * - Updates plans state on success
 * - Shows error toast on failure
 *
 * @async
 * @function fetchPlans
 * @returns {Promise<void>}
 */
  const fetchPlans = useCallback(async (): Promise<void> => {
  setLoading(true);
  try {
    const res = await subscriptionService.getAllPlans();
    if (res.success) {
      setPlans(normalizeRawPlans(res.data));
    } else {
      showError(res.message || "Failed to fetch subscription plans");
    }
  } catch (err: unknown) {
    showError(err instanceof Error ? err.message : "Failed to fetch subscription plans");
  } finally {
    setLoading(false);
  }
}, [showError]);
/**
 * Toggles the active/inactive status of a subscription plan.
 *
 * - Sends status update request to API
 * - Refreshes plan list after success
 * - Shows success/error toast messages
 *
 * @async
 * @function togglePlanStatus
 * @param {SubscriptionPlan} plan  The plan whose status will be toggled
 * @returns {Promise<void>}
 */
  const togglePlanStatus = async (plan: SubscriptionPlan) => {
    setLoading(true);
    try {
      const newStatus = plan.status === "active" ? "inactive" : "active";
      const res = await subscriptionService.updateStatusById(plan.id, newStatus);
      if (res.success) {
        showSuccess(`Plan "${plan.plan_name}" status updated`);
        await fetchPlans();
      } else {
        showError(res.message || "Failed to update status");
      }
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Error toggling status");
    } finally {
      setLoading(false);
    }
  };
/**
 * Opens the modal in "create new plan" mode.
 *
 * - Clears any selected editing plan
 * - Opens modal
 *
 * @function openAddModal
 * @returns {void}
 */
  const openAddModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };
/**
 * Opens the modal in "edit plan" mode.
 *
 * - Sets selected plan for editing
 * - Opens modal with pre-filled data
 *
 * @function openEditModal
 * @param {SubscriptionPlan} plan  Plan to be edited
 * @returns {void}
 */
  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };
/**
 * Closes the subscription plan modal and resets editing state.
 *
 * @function closeModal
 * @returns {void}
 */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };
/**
 * Creates or updates a subscription plan.
 *
 * - If editing, updates existing plan
 * - Otherwise creates a new plan
 * - Refreshes plan list after success
 * - Shows toast messages for success/failure
 *
 * @async
 * @function savePlan
 * @param {SubscriptionPlanForm} formData  Form data for the plan
 * @param {boolean} isEdit  Whether operation is update or create
 * @returns {Promise<void>}
 */
  const savePlan = async (formData: SubscriptionPlanForm, isEdit: boolean): Promise<void> => {
    setLoading(true);
    try {
      if (isEdit && editingPlan) {
        const res = await subscriptionService.updatePlanById(editingPlan.id, formData);
        if (res.success) {
          showSuccess("Plan updated successfully");
        } else {
          showError(res.message || "Failed to update plan");
          return;
        }
      } else {
        const res = await subscriptionService.createPlan(formData);
        if (res.success) {
          showSuccess("Plan created successfully");
        } else {
          showError(res.message || "Failed to create plan");
          return;
        }
      }
      closeModal();
      await fetchPlans();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
/**
 * Fetches subscription plans when the component mounts.
 *
 * @function useEffect
 * @returns {void}
 */
  useEffect(() => {
  fetchPlans();
}, [fetchPlans]);

  return {
    plans,
    loading,
    isModalOpen,
    editingPlan,
    openAddModal,
    openEditModal,
    closeModal,
    savePlan,
    togglePlanStatus,
  };
};