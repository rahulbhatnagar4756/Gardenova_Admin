import { type ChangeEvent, type FormEvent, useEffect, useState, type JSX } from "react";
import type {  SubscriptionPlanForm, SubscriptionPlanModalProps } from "../../types/subscription";

const defaultForm: SubscriptionPlanForm = {
  plan_name: "",
  description: "",
  price_monthly: 0,
  price_annual: 0,
  scans_per_month: 0,
  landscape_gens_per_month: 0,
  ad_free: false,
  priority_support: false,
  ai_care_assistant: false,
  hd_renders: false,
  pdf_export: false,
  priority_generation: false,
  premium_styles: false,
  before_after_downloads: false,
  status: "active",
};
/**
 * Modal component for creating and editing subscription plans.
 *
 * Features:
 * - Supports both create and edit modes.
 * - Pre-populates form fields when editing an existing plan.
 * - Allows configuration of pricing, usage limits, and premium features.
 * - Handles form submission and loading states.
 *
 * @param {SubscriptionPlanModalProps} props  Component props.
 * @returns {JSX.Element | null} The subscription plan modal or null when closed.
 */
const SubscriptionPlanModal = ({ isOpen, editingPlan, onClose, onSave }: SubscriptionPlanModalProps): JSX.Element | null => {
  const [form, setForm] = useState<SubscriptionPlanForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingPlan) {
      setForm({
        plan_name: editingPlan.plan_name,
        description: editingPlan.description,
        price_monthly: editingPlan.price_monthly,
        price_annual: editingPlan.price_annual,
        scans_per_month: editingPlan.scans_per_month,
        landscape_gens_per_month: editingPlan.landscape_gens_per_month,
        ad_free: editingPlan.ad_free,
        priority_support: editingPlan.priority_support,
        ai_care_assistant: editingPlan.ai_care_assistant,
        hd_renders: editingPlan.hd_renders,
        pdf_export: editingPlan.pdf_export,
        priority_generation: editingPlan.priority_generation,
        premium_styles: editingPlan.premium_styles,
        before_after_downloads: editingPlan.before_after_downloads,
        status: editingPlan.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [isOpen, editingPlan]);
/**
 * Updates form state when an input, textarea, or checkbox value changes.
 *
 * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e
 * The change event triggered by a form control.
 * @returns {void}
 */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const target = e.target;
    const { name, type } = target;
    if (type === "checkbox" && target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: target.checked }));
      return;
    }
    if (type === "number" && target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: parseFloat(target.value) || 0 }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: target.value }));
  };
/**
 * Handles form submission for creating or updating a subscription plan.
 *
 * @async
 * @param {FormEvent<HTMLFormElement>} e  Form submission event.
 * @returns {Promise<void>}
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
    <div className="modal fade show question_modal" style={{ display: "block", backgroundColor: "rgba(46,58,48,0.4)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button className="btn-close close-btn" onClick={onClose} type="button" aria-label="Close">✕</button>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="head_area">
                <h4 className="head_modal">{editingPlan ? "Edit Plan" : "Add Plan"}</h4>
              </div>

              <div className="input_field">
                <label htmlFor="plan_name">Plan Name <span className="text-danger">*</span></label>
                <input id="plan_name" name="plan_name" value={form.plan_name} onChange={handleChange}
                  placeholder="Plan Name" className="form-control" required type="text" disabled={!!editingPlan} />
              </div>

              <div className="input_field">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange}
                  placeholder="Description" className="form-control mt-2" rows={3} />
              </div>

              <div className="input_field">
                <label htmlFor="price_monthly">Monthly Price (₹) <span className="text-danger">*</span></label>
                <input id="price_monthly" name="price_monthly" value={form.price_monthly} onChange={handleChange}
                  type="number" step="0.01" min="0" className="form-control" required />
              </div>

              <div className="input_field">
                <label htmlFor="price_annual">Annual Price (₹) <span className="text-danger">*</span></label>
                <input id="price_annual" name="price_annual" value={form.price_annual} onChange={handleChange}
                  type="number" step="0.01" min="0" className="form-control" required />
              </div>

              <div className="input_field">
                <label htmlFor="scans_per_month">Scans / Month <span className="text-danger">*</span></label>
                <input id="scans_per_month" name="scans_per_month" value={form.scans_per_month} onChange={handleChange}
                  type="number" min="0" className="form-control" required />
              </div>

              <div className="input_field">
                <label htmlFor="landscape_gens_per_month">Landscape Generations / Month <span className="text-danger">*</span></label>
                <input id="landscape_gens_per_month" name="landscape_gens_per_month" value={form.landscape_gens_per_month}
                  onChange={handleChange} type="number" min="0" className="form-control" required />
              </div>

              <div className="modal-checkbox-row">
                {(
                  [
                    { name: "ad_free", label: "Ad Free" },
                    { name: "ai_care_assistant", label: "AI Care Assistant" },
                    { name: "hd_renders", label: "HD Renders" },
                    { name: "priority_support", label: "Priority Support" },
                    { name: "pdf_export", label: "PDF Export" },
                    { name: "priority_generation", label: "Priority Generation" },
                    { name: "premium_styles", label: "Premium Styles" },
                    { name: "before_after_downloads", label: "Before/After Downloads" },
                  ] as { name: keyof SubscriptionPlanForm; label: string }[]
                ).map(({ name, label }) => (
                  <div className="modal-checkbox" key={name}>
                    <label>
                      <input type="checkbox" name={name} checked={form[name] as boolean} onChange={handleChange} />
                      <span>{label}</span>
                    </label>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn common_button mt-3" disabled={isSaving}>
                {isSaving ? (editingPlan ? "Updating..." : "Saving...") : (editingPlan ? "Update Plan" : "Save Plan")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanModal;