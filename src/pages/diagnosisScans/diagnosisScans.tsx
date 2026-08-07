import { useCallback, useEffect, useState } from "react";
import "../../styles/adminList.css";
import { useDiagnosisScans } from "../../hooks/useDiagnosisScans";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import { TableLoader } from "../../components/loader";
import { ScanDetailModal } from "../../components/diagnosisScans/ScanDetailModal";
import {
  getScanConfidence,
  getScanDisease,
  getScanImage,
  getScanPlantName,
  getScanUserEmail,
  getScanUserName,
} from "../../components/diagnosisScans/scanHelpers";
import type { DiagnosisScan } from "../../types/diagnosisScans";
import {
  formatAdminDateTime,
  resolveMediaUrl,
} from "../../utility/util";

/**
 * Admin Diagnosis Scans page — log of plant disease scan requests.
 *
 * @returns The diagnosis scans page UI.
 */
export const DiagnosisScans = () => {
  const {
    scans,
    loading,
    error,
    currentPage,
    totalCount,
    limit,
    filters,
    detailLoading,
    goToPage,
    updateFilters,
    getScanById,
  } = useDiagnosisScans(20);

  const { showError } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [diseaseInput, setDiseaseInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScan, setSelectedScan] = useState<DiagnosisScan | null>(null);

  useEffect(() => {
    if (error) showError(`Error: ${error}`);
  }, [error, showError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        (filters.search || "") === searchInput &&
        (filters.disease || "") === diseaseInput
      ) {
        return;
      }
      updateFilters({
        search: searchInput,
        disease: diseaseInput,
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [
    searchInput,
    diseaseInput,
    filters.search,
    filters.disease,
    updateFilters,
  ]);

  const handlePageChange = useCallback(
    (page: number) => goToPage(page),
    [goToPage]
  );

  /**
   * Opens the scan detail modal and loads full scan data.
   *
   * @param id Scan UUID.
   * @returns {Promise<void>}
   */
  const openDetail = async (id: string) => {
    setIsModalOpen(true);
    setSelectedScan(null);
    const detail = await getScanById(id);
    if (detail) setSelectedScan(detail);
    else setIsModalOpen(false);
  };

  /**
   * Closes the scan detail modal and clears selection.
   *
   * @returns {void}
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
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

  const fromValue = filters.from ? filters.from.slice(0, 10) : "";
  const toValue = filters.to ? filters.to.slice(0, 10) : "";

  /**
   * Formats a scan confidence value for table display.
   *
   * @param scan Diagnosis scan record.
   * @returns Percentage string, or "—" when confidence is missing.
   */
  const formatConfidence = (scan: DiagnosisScan) => {
    const value = getScanConfidence(scan);
    if (value == null) return "—";
    const pct = value <= 1 ? value * 100 : value;
    return `${pct.toFixed(1)}%`;
  };

  return (
    <>
      <div className="main_page">
        <div className="main_heading_area">
          <div className="row g-3">
            <div className="col">
              <h4 className="page_heading">Admin Diagnosis Scans</h4>
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
                  placeholder="Disease, plant, user"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input_field">
                <label>Disease</label>
                <input
                  type="text"
                  className="filter_control"
                  placeholder="Filter by disease"
                  value={diseaseInput}
                  onChange={(e) => setDiseaseInput(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input_field">
                <label>From</label>
                <input
                  type="date"
                  className="filter_control"
                  value={fromValue}
                  onChange={(e) =>
                    updateFilters({
                      from: toIsoStart(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input_field">
                <label>To</label>
                <input
                  type="date"
                  className="filter_control"
                  value={toValue}
                  onChange={(e) =>
                    updateFilters({
                      to: toIsoEnd(e.target.value),
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
                <th>Image</th>
                <th>Predicted Disease</th>
                <th>Confidence</th>
                <th>Plant</th>
                <th>User</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader />
              ) : scans.length > 0 ? (
                scans.map((scan) => {
                  const img = resolveMediaUrl(getScanImage(scan));
                  return (
                    <tr key={scan.id}>
                      <td>
                        {img ? (
                          <img
                            src={img}
                            alt={getScanDisease(scan)}
                            className="admin_thumb"
                            onClick={() => openDetail(scan.id)}
                          />
                        ) : (
                          <div className="admin_thumb_placeholder">No img</div>
                        )}
                      </td>
                      <td>{getScanDisease(scan)}</td>
                      <td>{formatConfidence(scan)}</td>
                      <td>{getScanPlantName(scan)}</td>
                      <td>
                        <div>{getScanUserName(scan)}</div>
                        <small>{getScanUserEmail(scan)}</small>
                      </td>
                      <td>
                        {formatAdminDateTime(
                          scan.created_at || scan.createdAt
                        )}
                      </td>
                      <td>
                        <div className="action_icons">
                          <span
                            title="View details"
                            onClick={() => openDetail(scan.id)}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No diagnosis scans found
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

      <ScanDetailModal
        isOpen={isModalOpen}
        scan={selectedScan}
        loading={detailLoading || (isModalOpen && !selectedScan)}
        onClose={closeModal}
      />
    </>
  );
};
