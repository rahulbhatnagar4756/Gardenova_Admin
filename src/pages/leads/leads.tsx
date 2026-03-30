import { useCallback, useEffect, useState } from "react";
import "./leads.css";
import { useLeads } from "../../hooks/useLeads";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import { TableLoader } from "../../components/loader";
import { ProfessionalsModal } from "../../components/professional";
import type { LeadProps, LeadRow } from "../../types/lead";

/**
 * Leads component displays a paginated and filterable list of leads.
 *
 * Features:
 * - Fetches leads using `useLeads` hook
 * - Filters leads by status (new, contacted, closed)
 * - Displays paginated data with a table layout
 * - Shows loading and empty states
 * - Opens a modal to view detailed partner/professional information
 * - Displays toast notifications on errors
 *
 * @param {LeadProps} props  Component props
 * @param {number} [props.limit]  Optional limit to restrict number of displayed rows
 *
 * @returns {JSX.Element} Rendered Leads table with pagination and modal
 */
export const Leads = ({ limit }: LeadProps) => {
  const {
    rows,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit: itemsPerPage,
    goToPage,
  } = useLeads();

  const { showError } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LeadRow | null>(null);
/**
 * Opens the modal and sets the selected lead row.
 *
 * @param {LeadRow} row  The lead row data to display in the modal
 * @returns {void}
 */
  const openModal = (row: LeadRow) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
/**
 * Closes the modal and clears the selected lead row.
 *
 * @returns {void}
 */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };
/**
 * Returns a styled badge element based on the lead status.
 *
 * Maps lead statuses to Bootstrap badge classes:
 * - "new" → warning badge
 * - "contacted" → success badge
 * - "closed" → danger badge
 * - Any other status → secondary badge
 *
 * @param {string} status  The lead status string
 * @returns {JSX.Element} A span element styled as a badge with capitalized status text
 */
  const getStatusBadge = (status: string) => {
    let badgeClass = "";
    if (status === "new") badgeClass = "bg-warning text-dark";
    else if (status === "contacted") badgeClass = "bg-success";
    else if (status === "closed") badgeClass = "bg-danger";
    else badgeClass = "bg-secondary";

    return (
      <span
        className={`badge ${badgeClass}`}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handlePageChange = useCallback(
    (page: number) => goToPage(page),
    [goToPage]
  );

  useEffect(() => {
    if (error) showError(`Error: ${error}`);
  }, [error, showError]);

  const filteredRows =
    filterStatus === "all"
      ? rows
      : rows.filter((row) => row.leadsStatus === filterStatus);

  const displayedRows = limit ? filteredRows.slice(0, limit) : filteredRows;

  return (
    <>
      <div className="main_page">
        <div className="mobile">
          <div className="row g-3">
            <div className="col">
              <h4 className="page_heading">All Leads</h4>
            </div>
            <div className="col-auto">
              <div className="input_field">
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Leads</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mp_table">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Quoter Name</th>
                <th>Quoter Email</th>
                <th>Status</th>
                <th>Partner</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader />
              ) : displayedRows.length > 0 ? (
                displayedRows.map((row) => (
                  <tr key={`${row.leadId}-${row.partnerId}`}>
                    <td>{row.quoterName}</td>
                    <td>{row.quoterEmail}</td>
                    <td>{getStatusBadge(row.leadsStatus)}</td>
                    <td>{row.partnerDisplayName}</td>
                    <td>
                      <span
                        className="text-success"
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => openModal(row)}
                      >
                        View Professional Details
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 0 && (
            <Pagination
              totalItems={totalCount}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <ProfessionalsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        row={selectedRow}
      />
    </>
  );
};