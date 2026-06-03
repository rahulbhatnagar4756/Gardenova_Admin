import type { JSX } from "react";
import { Loader } from "../../components/loader";
import PageHeader from "../../components/Subscription/PageHeader";
import SubscriptionPlanModal from "../../components/Subscription/SubscriptionPlanModal";
import SubscriptionPlansList from "../../components/Subscription/subscriptionPlanList";
import { useSubscriptionPlans } from "../../hooks/useSubscriptionPlans";
import "./SubscriptionPlans.css";
/**
 * Main container component for managing subscription plans.
 *
 * Responsibilities:
 * - Fetches and displays all subscription plans via `useSubscriptionPlans`
 * - Shows loading state while data is being fetched
 * - Renders list of plans with edit and toggle actions
 * - Handles add/edit modal for creating or updating plans
 * - Limits plan creation based on business rule (max 4 plans)
 * @returns {JSX.Element} Subscription plans management page
 */
export const SubscriptionPlans = (): JSX.Element => {
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
          showAddButton={plans.length < 4}
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