import { useCallback, useEffect, useState } from "react";
import "../../styles/adminList.css";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import { TableLoader } from "../../components/loader";
import { UserDetailModal } from "../../components/adminUsers/UserDetailModal";
import type {
  AccountStatus,
  AdminUser,
  SubscriptionStatus,
  SubscriptionTier,
} from "../../types/adminUsers";
import { formatAdminDate } from "../../utility/util";

/**
 * Admin Users page — searchable/filterable user list with subscription history.
 *
 * @returns The admin users page UI.
 */
export const AdminUsers = () => {
  const {
    users,
    loading,
    error,
    currentPage,
    totalCount,
    limit,
    filters,
    detailLoading,
    goToPage,
    updateFilters,
    getUserById,
  } = useAdminUsers(20);

  const { showError } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (error) showError(`Error: ${error}`);
  }, [error, showError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((filters.search || "") === searchInput) return;
      updateFilters({ search: searchInput });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, updateFilters]);

  const handlePageChange = useCallback(
    (page: number) => goToPage(page),
    [goToPage]
  );

  /**
   * Opens the user detail modal and loads full user data.
   *
   * @param id User UUID.
   * @returns {Promise<void>}
   */
  const openDetail = async (id: string) => {
    setIsModalOpen(true);
    setSelectedUser(null);
    const detail = await getUserById(id);
    if (detail) setSelectedUser(detail);
    else setIsModalOpen(false);
  };

  /**
   * Closes the user detail modal and clears selection.
   *
   * @returns {void}
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  /**
   * Converts a date input value to an inclusive ISO start timestamp.
   *
   * @param date Date string in YYYY-MM-DD format.
   * @returns ISO start timestamp, or empty string when date is blank.
   */
  const toIsoStart = (date: string) =>
    date ? new Date(`${date}T00:00:00.000Z`).toISOString() : "";

  /**
   * Converts a date input value to an inclusive ISO end timestamp.
   *
   * @param date Date string in YYYY-MM-DD format.
   * @returns ISO end timestamp, or empty string when date is blank.
   */
  const toIsoEnd = (date: string) =>
    date ? new Date(`${date}T23:59:59.999Z`).toISOString() : "";

  const signupFromValue = filters.signupFrom
    ? filters.signupFrom.slice(0, 10)
    : "";
  const signupToValue = filters.signupTo ? filters.signupTo.slice(0, 10) : "";

  return (
    <>
      <div className="main_page">
        <div className="main_heading_area">
          <div className="row g-3">
            <div className="col">
              <h4 className="page_heading">Admin Users</h4>
            </div>
          </div>
        </div>

        <div className="admin_filters">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <div className="input_field">
                <label>Search</label>
                <input
                  type="text"
                  className="filter_control"
                  placeholder="Name, email, or phone"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="input_field">
                <label>Subscription Tier</label>
                <select
                  className="filter_control"
                  value={filters.tier || ""}
                  onChange={(e) =>
                    updateFilters({
                      tier: e.target.value as SubscriptionTier | "",
                    })
                  }
                >
                  <option value="">All tiers</option>
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="plus">Plus</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="input_field">
                <label>Account Status</label>
                <select
                  className="filter_control"
                  value={filters.accountStatus || ""}
                  onChange={(e) =>
                    updateFilters({
                      accountStatus: e.target.value as AccountStatus | "",
                    })
                  }
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="input_field">
                <label>Subscription Status</label>
                <select
                  className="filter_control"
                  value={filters.subscriptionStatus || ""}
                  onChange={(e) =>
                    updateFilters({
                      subscriptionStatus: e.target
                        .value as SubscriptionStatus | "",
                    })
                  }
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="canceled">Canceled</option>
                  <option value="expired">Expired</option>
                  <option value="on_hold">On hold</option>
                  <option value="in_grace">In grace</option>
                  <option value="paused">Paused</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div className="col-md-1">
              <div className="input_field">
                <label>Signup From</label>
                <input
                  type="date"
                  className="filter_control"
                  value={signupFromValue}
                  onChange={(e) =>
                    updateFilters({
                      signupFrom: toIsoStart(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="input_field">
                <label>Signup To</label>
                <input
                  type="date"
                  className="filter_control"
                  value={signupToValue}
                  onChange={(e) =>
                    updateFilters({
                      signupTo: toIsoEnd(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mp_table">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Sub Status</th>
                <th>Account</th>
                <th>Signup</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader />
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="cus_badge new_lead">
                        {user.subscription?.tier || "free"}
                      </span>
                    </td>
                    <td>{user.subscription?.status || "none"}</td>
                    <td>
                      <span
                        className={`cus_badge ${
                          user.account_status === "active"
                            ? "converted_lead"
                            : "closed_lead"
                        }`}
                      >
                        {user.account_status}
                      </span>
                    </td>
                    <td>{formatAdminDate(user.created_at)}</td>
                    <td>
                      <div className="action_icons">
                        <span
                          title="View details"
                          onClick={() => openDetail(user.id)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                              fill="#313131"
                            />
                          </svg>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {!loading && totalCount > 0 && (
            <Pagination
              totalItems={totalCount}
              itemsPerPage={limit}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <UserDetailModal
        isOpen={isModalOpen}
        user={selectedUser}
        loading={detailLoading || (isModalOpen && !selectedUser)}
        onClose={closeModal}
      />
    </>
  );
};
