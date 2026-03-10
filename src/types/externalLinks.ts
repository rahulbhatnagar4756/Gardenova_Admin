/**
 * Represents a single external link entity.
 */
export interface ExternalLink {
  /** Unique identifier of the external link */
  id: string;

  /** Unique key used internally */
  key: string;

  /** Display title of the external link */
  title: string;

  /** Optional URL of the external link */
  url: string | null;

  /** Whether the link is active or inactive */
  is_active: boolean;
}

/**
 * Props for the ExternalLinksList component.
 */
export interface ExternalLinksListProps {
  /** List of external links to display */
  links: ExternalLink[];

  /** Callback fired when edit action is triggered */
  onEdit: (link: ExternalLink) => void;

  /** Callback fired when delete action is triggered */
  onDelete: (id: string) => void;
}

/**
 * Props for a page header component.
 */
export interface PageHeaderProps {
  /** Callback fired when add button is clicked */
  onAddClick: () => void;
}

/**
 * API response shape for fetching external links.
 */
export interface ExternalLinksResponse {
  /** Array of external links */
  links: ExternalLink[];
}

/**
 * Payload to create a new external link.
 */
export interface CreateExternalLinkRequest {

  /** Title of the external link */
  title: string;

  /** Optional URL */
  url?: string | null;

  /** Initial active status */
  is_active?: boolean;
}

/**
 * Payload to update an existing external link.
 */
export interface UpdateExternalLinkRequest {
  /** ID of the external link being updated */
  id: string;

  /** Updated key (optional) */
  key?: string;

  /** Updated title (optional) */
  title?: string;

  /** Updated URL (optional) */
  url?: string | null;

  /** Updated active status (optional) */
  is_active?: boolean;
}

/**
 * Form model for creating or editing a subscription plan.
 */
export type SubscriptionPlanForm = {
  // Optional for new plans, required for editing existing plans
  id?: number; 
  /** Name of the subscription plan */
  plan_name: string;

  /** Description shown to users */
  description: string;

  /** Monthly price (numeric only) */
  price_monthly: number;

  /** Annual price (numeric only) */
  annual_price: number;

  /** Monthly lead limit */
  lead_limit_per_month: number;

  /** Number of regions allowed */
  number_of_regions: number;

  /** Whether the plan is highlighted in search results */
  highlight_in_result: boolean;

  /** Whether the plan shows a verification badge */
  verification_badge: boolean;

  /** Current status of the plan */
  status: "active" | "inactive";
};

/**
 * Props for the `ExternalLinkModal` component.
 *
 * @interface ExternalLinkModalProps
 */
export interface ExternalLinkModalProps {
  /** Controls modal visibility */
  isOpen: boolean;

  /** External link being edited, null when creating a new link */
  editingLink: ExternalLink | null;

  /** Callback to close the modal */
  onClose: () => void;

  /**
   * Callback to save the external link
   * @param data External link payload
   */
  onSave: (data: {
    title: string;
    url: string;
    is_active: boolean;
  }) => void;
}
