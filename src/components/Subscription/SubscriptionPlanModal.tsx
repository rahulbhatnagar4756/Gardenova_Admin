import { useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import type { SubscriptionPlanModalProps, SubscriptionPlanForm } from "../../types/subscription";

/**
 * Modal component used to create or edit a subscription plan.
 *
 * @param props Component props
 * @param props.isOpen Controls modal visibility
 * @param props.editingPlan Existing plan data when editing, otherwise null
 * @param props.onClose Callback to close the modal
 * @param props.onSave Callback to save or update the plan
 *
 * @returns JSX element or null when modal is closed
 */
const SubscriptionPlanModal = ({
  isOpen,
  editingPlan,
  onClose,
  onSave,
}: SubscriptionPlanModalProps): JSX.Element | null => {
  /**
   * Form state for subscription plan creation/editing.
   * Uses numeric values for prices and limits.
   */
  const [form, setForm] = useState<SubscriptionPlanForm>({
    plan_name: "",
    description: "",
    price_monthly: 0,
    price_annual: 0,
    leads_limit: 0,
    cities_coverage: 0,
    appear_in_search: false,
    premium_profile_badge: false,
    priority_customer_support: false,
    status: "inactive",
  });

  /** Tracks submit/loading state for save button */
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Sync form state when modal opens or editing plan changes.
   * - If editingPlan exists → populate form
   * - Otherwise → reset to default values
   */
  useEffect(() => {
    if (isOpen) {
      if (editingPlan) {
        setForm({
          plan_name: editingPlan.plan_name,
          description: editingPlan.description,
          price_monthly: editingPlan.price_monthly,
          price_annual: editingPlan.price_annual,
          leads_limit: editingPlan.leads_limit,
          cities_coverage: editingPlan.cities_coverage,
          appear_in_search: editingPlan.appear_in_search,
          premium_profile_badge: editingPlan.premium_profile_badge,
          priority_customer_support: editingPlan.priority_customer_support,
          status: editingPlan.status,
        });
      } else {
        setForm({
          plan_name: "",
          description: "",
          price_monthly: 0,
          price_annual: 0,
          leads_limit: 0,
          cities_coverage: 0,
          appear_in_search: false,
          premium_profile_badge: false,
          priority_customer_support: false,
          status: "active",
        });
      }
    }
  }, [isOpen, editingPlan]);

  /**
   * Handles input and textarea value changes.
   * - Checkbox values use `checked`
   * - Number inputs are parsed to numbers
   * - Text inputs use string values
   *
   * @param e Change event from input or textarea
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const target = e.target;
    const { name, type } = target;

    // Type guard for checkbox inputs
    if (type === "checkbox" && target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    // Type guard for number inputs
    if (type === "number" && target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
        [name]: parseFloat(target.value) || 0,
      }));
      return;
    }

    // Default: handle as string value
    setForm((prev) => ({
      ...prev,
      [name]: target.value,
    }));
  };


  /**
   * Handles form submission.
   * Calls onSave with current form data and edit mode flag.
   *
   * @param e Form submit event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(form, !!editingPlan);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show question_modal"
      style={{ display: "block", backgroundColor: "rgba(46,58,48,0.4)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button 
            className="btn-close close-btn" 
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="modal-body">
            
            <form onSubmit={handleSubmit}>
              <div className="head_area">
              <h4 className="head_modal">
                {editingPlan ? "Edit Plan" : "Add Plan"}
              </h4>
              </div>

              <div className="input_field ">
                <label htmlFor="planName">Plan Name <span className="text-danger">*</span></label>
              <input
                name="plan_name"
                value={form.plan_name}
                id="planName"
                onChange={handleChange}
                placeholder="Plan Name"
                className="form-control"
                required
                disabled={!!editingPlan}
                type="text"
              />
              </div>
              <div className="input_field">
                <label htmlFor="desc">Description <span className="text-danger">*</span></label>
              <textarea
              id="desc"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="form-control mt-2"
                rows={3}
              />
              </div>

              <div className="input_field">
                <label htmlFor="monthlyPrice">Monthly Price <span className="text-danger">*</span></label>
              <input
              id="monthlyPrice"
                name="price_monthly"
                value={form.price_monthly}
                onChange={handleChange}
                placeholder="Monthly Price"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                required
              />
              </div>

              <div className="input_field">
              <label htmlFor="annualPrice">Annual Price <span className="text-danger">*</span></label>
              <input
              id="annualPrice"
                name="price_annual"
                value={form.price_annual}
                onChange={handleChange}
                placeholder="Annual Price"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                required
              />
              </div>

              <div className="input_field">
              <label htmlFor="leadsLimit">Leads / Month <span className="text-danger">*</span></label>
              <input
                id="leadsLimit"
                name="leads_limit"
                value={form.leads_limit}
                onChange={handleChange}
                placeholder="Leads / Month"
                type="number"
                min="0"
                className="form-control"
                required
              />
              </div>

              <div className="input_field">
              <label htmlFor="regions">Regions <span className="text-danger">*</span></label>
              <input
              id="regions"
                name="cities_coverage"
                value={form.cities_coverage}
                onChange={handleChange}
                placeholder="Regions"
                type="number"
                min="0"
                className="form-control"
                required
              />
              </div>

              <div className="modal-checkbox-row">
                <div className="modal-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="appear_in_search"
                      checked={form.appear_in_search}
                      onChange={handleChange}
                    />
                    <span>Highlight in Result</span>
                  </label>
                </div>

                <div className="modal-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="premium_profile_badge"
                      checked={form.premium_profile_badge}
                      onChange={handleChange}
                    />
                    <span>Verification Badge</span>
                  </label>
                </div>
                <div className="modal-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="priority_customer_support"
                      checked={form.priority_customer_support}
                      onChange={handleChange}
                    />
                    <span>priority customer support</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn common_button mt-3"
                disabled={isSaving}
              >
                {isSaving
                  ? editingPlan
                    ? "Updating..."
                    : "Saving..."
                  : editingPlan
                    ? "Update Plan"
                    : "Save Plan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanModal;