import React from "react";
import { Loader } from "../loader";
import type { AdminUser } from "../../types/adminUsers";
import {
  formatAdminDateTime,
  resolveMediaUrl,
} from "../../utility/util";

/** Props for the admin user detail modal. */
interface UserDetailModalProps {
  isOpen: boolean;
  user: AdminUser | null;
  loading?: boolean;
  onClose: () => void;
}

/**
 * Dark themed modal showing user profile + subscription history.
 *
 * @param root0 Component props.
 * @param root0.isOpen Whether the modal is visible.
 * @param root0.user User detail payload, or null while loading.
 * @param root0.loading Whether detail data is currently loading.
 * @param root0.onClose Callback invoked when the modal is closed.
 * @returns The user detail modal UI, or null when closed.
 */
export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  user,
  loading = false,
  onClose,
}) => {
  if (!isOpen) return null;

  const avatar = resolveMediaUrl(user?.profile_picture);
  const history = user?.subscription_history ?? [];

  return (
    <div
      className="modal fade show partner_details"
      style={{ display: "block", backgroundColor: "#2e3a3066" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content position-relative view_modal">
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none" }}
          >
            ✕
          </button>

          <div className="modal-body view_profile">
            {loading || !user ? (
              <Loader text="Loading user details..." />
            ) : (
              <>
                <div className="head_area">
                  <h4 className="head_modal">User Details</h4>
                </div>

                <div className="row g-3 text-start">
                  {avatar && (
                    <div className="col-12 text-center mb-2">
                      <img
                        src={avatar}
                        alt={user.name || user.email}
                        className="profile_img"
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          margin: "0 auto",
                        }}
                      />
                    </div>
                  )}

                  <div className="col-md-6">
                    <strong>Name:</strong>
                    <p className="lock_field">{user.name || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong>
                    <p className="lock_field">{user.email || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Phone:</strong>
                    <p className="lock_field">{user.phone_number || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Role:</strong>
                    <p className="lock_field">{user.role || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Account Status:</strong>
                    <p className="lock_field">
                      <span
                        className={`cus_badge ${
                          user.account_status === "active"
                            ? "converted_lead"
                            : "closed_lead"
                        }`}
                      >
                        {user.account_status}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Signup Date:</strong>
                    <p className="lock_field">
                      {formatAdminDateTime(user.created_at)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Email Verified:</strong>
                    <p className="lock_field">
                      {user.is_email_verified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Phone Verified:</strong>
                    <p className="lock_field">
                      {user.is_phone_verified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="head_area mt-4">
                  <h4 className="head_modal">Current Subscription</h4>
                </div>
                <div className="row g-3 text-start">
                  <div className="col-md-4">
                    <strong>Tier:</strong>
                    <p className="lock_field">
                      {user.subscription?.tier || "free"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Status:</strong>
                    <p className="lock_field">
                      {user.subscription?.status || "none"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Plan:</strong>
                    <p className="lock_field">
                      {user.subscription?.plan_code || "—"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Billing Cycle:</strong>
                    <p className="lock_field">
                      {user.subscription?.billing_cycle || "—"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Price (INR):</strong>
                    <p className="lock_field">
                      {user.subscription?.price_inr != null
                        ? `₹${user.subscription.price_inr}`
                        : "—"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Period End:</strong>
                    <p className="lock_field">
                      {formatAdminDateTime(
                        user.subscription?.current_period_end
                      )}
                    </p>
                  </div>
                </div>

                <div className="head_area mt-4">
                  <h4 className="head_modal">Subscription History</h4>
                </div>
                {history.length === 0 ? (
                  <p className="lock_field text-start">No purchase history</p>
                ) : (
                  <div className="professtional_pop_table">
                    <div className="mp_table">
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>Tier</th>
                          <th>Plan</th>
                          <th>Cycle</th>
                          <th>Price</th>
                          <th>Order</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item) => (
                          <tr key={item.id}>
                            <td>{item.tier || "—"}</td>
                            <td>{item.plan_code || "—"}</td>
                            <td>{item.billing_cycle || "—"}</td>
                            <td>
                              {item.price_inr != null
                                ? `₹${item.price_inr}`
                                : "—"}
                            </td>
                            <td>{item.order_id || "—"}</td>
                            <td>{formatAdminDateTime(item.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
