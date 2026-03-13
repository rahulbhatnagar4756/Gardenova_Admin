import type { JSX } from "react";
import { Loader } from "../../components/loader";
import PageHeader from "../../components/Subscription/PageHeader";
import SubscriptionPlanModal from "../../components/Subscription/SubscriptionPlanModal";
import { useSubscriptionPlans } from "../../hooks/useSubscriptionPlans";
import "./SubscriptionPlans.css";
import SubscriptionPlansList from "../../components/Subscription/subscriptionPlanList";

/**
 * SubscriptionPlans Component
 *
 * Renders the subscription plans management page.
 * Allows admins to:
 * - View existing subscription plans
 * - Add a new subscription plan (max 5 plans)
 * - Edit existing plans
 * - Enable/Disable plans
 *
 * Data and actions are handled via the `useSubscriptionPlans` hook.
 *
 * @returns {JSX.Element} Subscription plans management UI
 */
export const SubscriptionPlans = (): JSX.Element => {
  /**
   * Subscription plans state and handlers
   */
  const {
    plans,
    loading,
    isModalOpen,
    editingPlan,
    openAddModal,
    openEditModal,
    closeModal,
    savePlan,
    togglePlanStatus,
  } = useSubscriptionPlans();

  if (loading) {
    return <Loader text="Loading subscription plans..." />;
  }

  return (
    <>
      <div className="main_page">
        <PageHeader
          title="Manage Subscription Plans"
          addText="Add Plan"
          onAddClick={openAddModal}
          showAddButton={plans.length < 3}
        />

        <SubscriptionPlansList
          plans={plans}
          onEdit={openEditModal}
          onToggle={togglePlanStatus}
        />
      </div>

      <SubscriptionPlanModal
        isOpen={isModalOpen}
        editingPlan={editingPlan}
        onClose={closeModal}
        onSave={savePlan}
      />
    </>
  );
};