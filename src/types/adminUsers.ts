/** Subscription tier values accepted by the admin users API. */
export type SubscriptionTier = "free" | "starter" | "plus" | "pro";

/** Soft-delete account status filter. */
export type AccountStatus = "active" | "inactive";

/** Current subscription lifecycle status. */
export type SubscriptionStatus =
  | "active"
  | "pending"
  | "canceled"
  | "expired"
  | "on_hold"
  | "in_grace"
  | "paused"
  | "none";

/** Current subscription snapshot on a user. */
export interface UserSubscription {
  status: SubscriptionStatus | string;
  plan_code: string | null;
  tier: SubscriptionTier | string;
  billing_cycle: string | null;
  price_inr: number | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  pending_plan_code: string | null;
  pending_plan_tier: string | null;
  purchase_token: string | null;
  order_id: string | null;
  updated_at: string | null;
}

/** A past purchase / subscription change entry. */
export interface SubscriptionHistoryItem {
  id: string;
  product_id: string | null;
  base_plan_id: string | null;
  purchase_token: string | null;
  order_id: string | null;
  purchase_state: string | null;
  acknowledged: boolean | null;
  plan_code: string | null;
  tier: string | null;
  billing_cycle: string | null;
  price_inr: number | null;
  created_at: string;
  updated_at: string | null;
}

/** Admin user list / detail record. */
export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  phone_number: string | null;
  role: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  account_status: AccountStatus | string;
  profile_picture?: string | null;
  google_uid?: string | null;
  apple_uid?: string | null;
  facebook_uid?: string | null;
  created_at: string;
  updated_at: string;
  subscription: UserSubscription;
  subscription_history: SubscriptionHistoryItem[];
}

/** Paginated admin users response payload. */
export interface AdminUsersListData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  users: AdminUser[];
}

/** Query filters for the admin users list. */
export interface AdminUsersFilters {
  search?: string;
  tier?: SubscriptionTier | "";
  accountStatus?: AccountStatus | "";
  signupFrom?: string;
  signupTo?: string;
  subscriptionStatus?: SubscriptionStatus | "";
}
