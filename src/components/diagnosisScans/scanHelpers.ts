import type { DiagnosisScan } from "../../types/diagnosisScans";

/**
 * Best available image URL on a scan record.
 *
 * @param scan Diagnosis scan record or null/undefined.
 * @returns Image URL string, or undefined when missing.
 */
export const getScanImage = (scan?: DiagnosisScan | null): string | undefined =>
  scan?.image_url || scan?.imageUrl || undefined;

/**
 * Predicted disease label with alias fallbacks.
 *
 * @param scan Diagnosis scan record or null/undefined.
 * @returns Disease label, or "—" when missing.
 */
export const getScanDisease = (scan?: DiagnosisScan | null): string =>
  scan?.predicted_disease ||
  scan?.predictedDisease ||
  scan?.disease ||
  "—";

/**
 * Confidence score (0–1 or 0–100) with alias fallbacks.
 *
 * @param scan Diagnosis scan record or null/undefined.
 * @returns Numeric confidence value, or null when missing/invalid.
 */
export const getScanConfidence = (
  scan?: DiagnosisScan | null
): number | null => {
  const value = scan?.confidence_score ?? scan?.confidence;
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
};

/**
 * Display plant name from a scan record.
 *
 * @param scan Diagnosis scan record or null/undefined.
 * @returns Plant name, or "—" when missing.
 */
export const getScanPlantName = (scan?: DiagnosisScan | null): string =>
  scan?.plant_name || scan?.plantName || "—";

/**
 * Display user name from nested or flat fields.
 *
 * @param scan Diagnosis scan record or null/undefined.
 * @returns User display name, or "—" when missing.
 */
export const getScanUserName = (scan?: DiagnosisScan | null): string =>
  scan?.user_name ||
  scan?.userName ||
  scan?.user?.name ||
  "—";

/**
 * Display user email from nested or flat fields.
 *
 * @param scan Diagnosis scan record or null/undefined.
 * @returns User email, or "—" when missing.
 */
export const getScanUserEmail = (scan?: DiagnosisScan | null): string =>
  scan?.user_email ||
  scan?.userEmail ||
  scan?.user?.email ||
  "—";
