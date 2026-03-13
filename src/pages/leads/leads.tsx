import { useCallback, useEffect, useState } from "react";
import "./leads.css";
import { useLeads } from "../../hooks/useLeads";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import { TableLoader } from "../../components/loader";
import { usePartnerProfiles } from "../../hooks/usePartnerProfiles";
import { ProfessionalsModal } from "../../components/professional";
import { useDebouncedBatchUpdater } from "../../hooks/useDebouncedBatchUpdater";
import type { PartnerProfileResponse } from "../../types/partnerProfile";
import type { Lead, LeadProps } from "../../types/lead";
// import { partnerProfileService } from "../../services/apiCalls/partnerProfile";

/**
 * Leads page component for listing, filtering, and updating lead statuses.
 *
 * @param {LeadProps} props Component props.
 * @param {number} props.limit Number of leads to fetch per page.
 * @returns {JSX.Element} The Leads component.
 */
export const Leads = ({ limit }: LeadProps) => {
  const {
    leads,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit: itemsPerPage,
    goToPage,
    updateLeadStatus,
  } = useLeads();
  const { getPartnerById } = usePartnerProfiles({
  autoFetch: false,
  // fetchFn: partnerProfileService.getAllForLeads, // ← swap here
});

  const { showError, showSuccess } = useToast();

  const { triggerUpdate: triggerLeadUpdate, pendingUpdates } =
    useDebouncedBatchUpdater<string>(
      updateLeadStatus,
      1200, // debounce delay
      () => showSuccess("Lead statuses updated successfully!"),
      (failed) => showError(`${failed} lead(s) failed to update`)
    );

  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professionals, setProfessionals] = useState<PartnerProfileResponse[]>(
    []
  );
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);

  /**
   * Opens the professional modal and fetches partner profiles for a lead.
   *
   * @param {Lead} lead Lead whose partners need to be fetched.
   * @returns {Promise<void>} Resolves when professional data is loaded.
   */
  const openProfessionalModal = async (lead: Lead) => {
    setIsModalOpen(true);
    setLoadingProfessionals(true);
    setProfessionals([]);

    try {
      const partnerList = lead.partners || [];
      const results: PartnerProfileResponse[] = [];

      for (const item of partnerList) {
        const profile = await getPartnerById(item.partnerId);
        if (profile) results.push(profile);
      }

      setProfessionals(results);
    } catch (err) {
      console.error("Failed fetching professionals:", err);
      showError("Failed to load professionals");
    } finally {
      setLoadingProfessionals(false);
    }
  };

  /**
   * Closes the professional modal and clears professional data.
   *
   * @returns {void}
   */
  const closeProfessionalModal = () => {
    setIsModalOpen(false);
    setProfessionals([]);
  };

  // Status cycle logic
  const statusOrder = ["new", "contacted", "closed"];

  /**
   * Returns the next status in the status cycle: new → contacted → closed.
   *
   * @param {string} current Current lead status.
   * @returns {string} The next status in cycle.
   */
  const getNextStatus = (current: string) => {
    const index = statusOrder.indexOf(current);
    if (index === -1) return statusOrder[0];
    return statusOrder[(index + 1) % statusOrder.length];
  };

  /**
   * Handles status change when user clicks on a status badge.
   *
   * @param {Lead} lead Lead whose status should be updated.
   * @returns {void}
   */
  const handleStatusClick = (lead: Lead) => {
    const nextStatus = getNextStatus(lead.leadsStatus);
    lead.leadsStatus = nextStatus;
    triggerLeadUpdate(lead.id, nextStatus);
  };

  /**
   * Generates a UI badge for a given lead status.
   *
   * @param {string} status Current lead status.
   * @param {string} leadId Lead ID for checking pending updates.
   * @returns {JSX.Element} A styled badge element.
   */
  const getStatusBadge = (status: string, leadId: string) => {
    const isPending = Boolean(pendingUpdates[leadId]);

    const style: React.CSSProperties = {
      opacity: isPending ? 0.5 : 1,
      transition: "opacity 0.2s ease",
      cursor: "pointer",
    };

    let badgeClass = "";

    if (status === "new") badgeClass = "bg-warning text-dark";
    else if (status === "contacted") badgeClass = "bg-success";
    else if (status === "closed") badgeClass = "bg-danger";
    else badgeClass = "bg-secondary";

    return (
      <span className={`badge ${badgeClass}`} style={style}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handlePageChange = useCallback(
    (page: number) => {
      goToPage(page);
    },
    [goToPage]
  );

  useEffect(() => {
    if (error) {
      showError(`Error: ${error}`);
    }
  }, [error, showError]);

  // Filter leads
  const filteredLeads =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => lead.leadsStatus === filterStatus);

  const displayedLeads = limit ? filteredLeads.slice(0, limit) : filteredLeads;

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
                <th>Name</th>
                <th>Email</th>
                <th>Lead Status</th>
                <th>Request to Professionals</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableLoader />
              ) : displayedLeads.length > 0 ? (
                displayedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.userName}</td>
                    <td>{lead.userEmail}</td>
                    <td onClick={() => handleStatusClick(lead)}>
                      {getStatusBadge(lead.leadsStatus, lead.id)}
                    </td>
                    <td>
                      <span
                        className="text-success"
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => openProfessionalModal(lead)}
                      >
                        View Professional List
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
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
        onClose={closeProfessionalModal}
        professionals={professionals}
        loading={loadingProfessionals}
      />
    </>
  );
};
