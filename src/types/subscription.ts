/**
 * Core subscription plan entity with all required fields including ID
 */
export interface SubscriptionPlan {
  /** Unique identifier for the plan */
  id: string;

  /** Name of the subscription plan */
  plan_name: string;

  /** Description of the plan features */
  description: string;

  /** Monthly price of the plan */
  price_monthly: number;

  /** Annual price of the plan */
  price_annual: number;

  /** Maximum leads allowed per month */
  leads_limit: number ;

  /** Number of regions covered */
  cities_coverage: number;

  /** Whether the plan is highlighted in listings */
  appear_in_search: boolean;

  /** Whether verification badge is enabled */
  premium_profile_badge: boolean;

  /** Current status of the plan */
  status: "active" | "inactive";
  priority_customer_support: boolean;

  /** Timestamp when plan was created */
  createdAt: string;

  /** Timestamp when plan was last updated */
  updatedAt: string;
}

/**
 * Payload structure used to create a new subscription plan.
 */
export interface CreateSubscriptionPlanRequest {
  /** Name of the subscription plan */
  plan_name: string;

  /** Description of the plan features */
  description: string;

  /** Monthly price */
  price_monthly: number;

  /** Annual price */
  price_annual  : number;

  /** Monthly lead limit */
  leads_limit  : number;

  /** Number of regions covered */
  cities_coverage : number;

  /** Whether the plan is highlighted in listings */
  appear_in_search: boolean;

  /** Whether verification badge is enabled */
  premium_profile_badge: boolean;
  priority_customer_support: boolean;

  /** Initial status of the plan */
  status: "active" | "inactive";
}

/**
 * Payload structure used to update an existing subscription plan.
 * Does NOT include 'id' as it's passed separately to the API
 */
export interface UpdateSubscriptionPlanRequest {
  /** Name of the subscription plan (optional for update) */
  plan_name?: string;
  /** Updated description */
  description: string;

  /** Updated monthly price */
  price_monthly: number;

  /** Updated annual price */
  price_annual: number;

  /** Updated monthly lead limit */
  leads_limit: number;

  /** Updated number of regions */
  cities_coverage: number;

  /** Updated highlight status */
  appear_in_search: boolean;

  /** Updated verification badge status */
  premium_profile_badge: boolean;

  priority_customer_support: boolean;

  /** Updated plan status */
  status: "active" | "inactive";
}

/**
 * Form state for the modal (used internally)
 * This matches the structure needed for both create and edit operations
 */
export interface SubscriptionPlanForm {
  plan_name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  leads_limit: number ;
  cities_coverage: number;
  appear_in_search: boolean;
  premium_profile_badge: boolean;
  priority_customer_support: boolean;
  status: "active" | "inactive";
}

/**
 * API response containing subscription plans.
 */
export interface SubscriptionPlansResponse {
  /** Array of subscription plans */
  plans: SubscriptionPlan[];
}

/**
 * Props for subscription plans list component.
 */
export interface SubscriptionPlansListProps {
  /** List of subscription plans */
  plans: SubscriptionPlan[];

  /** Callback triggered when edit action is selected */
  onEdit: (plan: SubscriptionPlan) => void;

  /** Callback triggered when status toggle is changed */
  onToggle: (plan: SubscriptionPlan) => void;
}

/**
 * Props for subscription plan create/edit modal.
 */
export interface SubscriptionPlanModalProps {
  /** Controls modal visibility */
  isOpen: boolean;

  /** Plan being edited, null when creating a new plan */
  editingPlan: SubscriptionPlan | null;

  /** Callback to close the modal */
  onClose: () => void;

  /**
   * Callback to save or update a plan.
   *
   * @param data  Plan form data
   * @param isEditing  Indicates edit mode
   */
  onSave: (
    data: SubscriptionPlanForm,
    isEditing: boolean
  ) => Promise<void>;
}