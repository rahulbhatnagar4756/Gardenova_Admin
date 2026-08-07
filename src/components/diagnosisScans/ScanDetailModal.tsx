import React from "react";
import { Loader } from "../loader";
import type { DiagnosisScan } from "../../types/diagnosisScans";
import {
  formatAdminDateTime,
  resolveMediaUrl,
} from "../../utility/util";
import {
  getScanConfidence,
  getScanDisease,
  getScanImage,
  getScanPlantName,
  getScanUserEmail,
  getScanUserName,
} from "./scanHelpers";

/** Props for the diagnosis scan detail modal. */
interface ScanDetailModalProps {
  isOpen: boolean;
  scan: DiagnosisScan | null;
  loading?: boolean;
  onClose: () => void;
}

/**
 * Dark themed modal for a single diagnosis scan log entry.
 *
 * @param root0 Component props.
 * @param root0.isOpen Whether the modal is visible.
 * @param root0.scan Scan detail payload, or null while loading.
 * @param root0.loading Whether detail data is currently loading.
 * @param root0.onClose Callback invoked when the modal is closed.
 * @returns The scan detail modal UI, or null when closed.
 */
export const ScanDetailModal: React.FC<ScanDetailModalProps> = ({
  isOpen,
  scan,
  loading = false,
  onClose,
}) => {
  if (!isOpen) return null;

  const image = resolveMediaUrl(getScanImage(scan));
  const confidence = getScanConfidence(scan);
  const raw = scan?.raw_result ?? scan?.rawResult;

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
            {loading || !scan ? (
              <Loader text="Loading scan details..." />
            ) : (
              <>
                <div className="head_area">
                  <h4 className="head_modal">Diagnosis Scan</h4>
                </div>

                {image && (
                  <div className="text-center mb-3">
                    <img
                      src={image}
                      alt={getScanDisease(scan)}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 280,
                        borderRadius: 12,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                <div className="row g-3 text-start">
                  <div className="col-md-6">
                    <strong>Predicted Disease:</strong>
                    <p className="lock_field">{getScanDisease(scan)}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Confidence:</strong>
                    <p className="lock_field">
                      {confidence == null
                        ? "—"
                        : `${(confidence <= 1
                            ? confidence * 100
                            : confidence
                          ).toFixed(1)}%`}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Plant:</strong>
                    <p className="lock_field">{getScanPlantName(scan)}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Date:</strong>
                    <p className="lock_field">
                      {formatAdminDateTime(
                        scan.created_at || scan.createdAt
                      )}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>User:</strong>
                    <p className="lock_field">{getScanUserName(scan)}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>User Email:</strong>
                    <p className="lock_field">{getScanUserEmail(scan)}</p>
                  </div>
                </div>

                {raw != null && (
                  <>
                    <div className="head_area mt-4">
                      <h4 className="head_modal">Raw Result</h4>
                    </div>
                    <pre className="lock_field text-start scan_raw_result">
                      {typeof raw === "string"
                        ? raw
                        : JSON.stringify(raw, null, 2)}
                    </pre>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
