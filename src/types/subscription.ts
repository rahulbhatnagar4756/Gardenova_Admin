
/**
 * Raw subscription plan data as received from the backend API.
 *
 * This structure represents the unprocessed database/API response
 * before any frontend normalization or transformation.
 */
export interface RawSubscriptionPlan {
  plan_id: string;
  name: string;
  tier: string;
  price: string;
  billing_period: string;
  plan_status: boolean;
  razorpay_id: string | null;
  limit_id: string;
  scans_per_month: number;
  landscape_gens_per_month: number;
  max_saved_plants: number;
  care_reminders: boolean;
  ad_free: boolean;
  ai_care_assistant: boolean;
  hd_renders: boolean;
  priority_support: boolean;
  pdf_export: boolean;
  priority_generation: boolean;
  premium_styles: boolean;
  before_after_downloads: boolean;
}
/**
 * Normalized subscription plan model used in the frontend.
 *
 * - Combines monthly and yearly pricing into a single structure
 * - Converts backend fields into UI-friendly format
 */
export interface SubscriptionPlan {
  id: string;
  plan_name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  status: "active" | "inactive";
  scans_per_month: number;
  landscape_gens_per_month: number;
  ad_free: boolean;
  priority_support: boolean;
  ai_care_assistant: boolean;
  hd_renders: boolean;
  pdf_export: boolean;
  priority_generation: boolean;
  premium_styles: boolean;
  before_after_downloads: boolean;
}
/**
 * Form model used for creating and updating subscription plans.
 *
 * Used in modal forms and API requests.
 */
export interface SubscriptionPlanForm {
  plan_name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  scans_per_month: number;
  landscape_gens_per_month: number;
  ad_free: boolean;
  priority_support: boolean;
  ai_care_assistant: boolean;
  hd_renders: boolean;
  pdf_export: boolean;
  priority_generation: boolean;
  premium_styles: boolean;
  before_after_downloads: boolean;
  status: "active" | "inactive";
}
/**
 * API response containing raw subscription plans.
 */
export interface SubscriptionPlansResponse {
  plans: RawSubscriptionPlan[];
}
/**
 * Props for SubscriptionPlansList component.
 *
 * Used to display a list of plans with edit and toggle actions.
 */
export interface SubscriptionPlansListProps {
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onToggle: (plan: SubscriptionPlan) => void;
}
/**
 * Props for SubscriptionPlanModal component.
 *
 * Handles create and edit functionality for subscription plans.
 */
export interface SubscriptionPlanModalProps {
  isOpen: boolean;
  editingPlan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (data: SubscriptionPlanForm, isEditing: boolean) => Promise<void>;
}
/**
 * Payload for updating an existing subscription plan.
 */
export interface UpdateSubscriptionPlanRequest {
  plan_name?: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  scans_per_month: number;
  landscape_gens_per_month: number;
  ad_free: boolean;
  ai_care_assistant: boolean;
  hd_renders: boolean;
  priority_support: boolean;
  pdf_export: boolean;
  priority_generation: boolean;
  premium_styles: boolean;
  before_after_downloads: boolean;
  status: "active" | "inactive";
}
/**
 * Payload for creating a new subscription plan.
 */
export interface CreateSubscriptionPlanRequest {
  plan_name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  scans_per_month: number;
  landscape_gens_per_month: number;
  ad_free: boolean;
  ai_care_assistant: boolean;
  hd_renders: boolean;
  priority_support: boolean;
  pdf_export: boolean;
  priority_generation: boolean;
  premium_styles: boolean;
  before_after_downloads: boolean;
  status: "active" | "inactive";
}