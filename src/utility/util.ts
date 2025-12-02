import type { StylesConfig } from "react-select";
import type { DecodedToken } from "../types/auth";
import type { PartnerAddress } from "../types/partnerProfile";
import type { SelectOption } from "../types/plants";

/**
 * Decodes all Base64-encoded fields inside a DecodedToken object.
 *
 * @param decoded The original decoded JWT payload containing Base64 fields.
 * @returns The decoded token with readable (decoded) string values.
 */
export const decodePayload = (decoded: DecodedToken): DecodedToken => ({
  ...decoded,
  userEmail: base64Decode(decoded.userEmail),
  role: base64Decode(decoded.role),
  userId: base64Decode(decoded.userId),
});

/**
 * Safely decodes a Base64 string. If decoding fails, returns the original value.
 *
 * @param value The Base64-encoded string to decode.
 * @returns The decoded string, or the original value if decoding fails.
 */
export const base64Decode = (value: string): string => {
  try {
    return atob(value);
  } catch {
    return value;
  }
};

/**
 * Formats a partner's address into a clean, readable string.
 *
 * @param address The partner's address object containing street, city, state, country, and zipCode.
 * @returns A formatted address string or "Not specified" if empty or missing.
 */
export const formatAddress = (address?: PartnerAddress): string => {
  if (!address) return "Not specified";

  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.zipCode,
  ].filter((part) => part && part.trim() !== "");

  return parts.length > 0 ? parts.join(", ") : "Not specified";
};

export const customSelectStyles: StylesConfig<SelectOption, true> = {
  /**
   * Styles the main select control container.
   *
   * @param base Default base styles applied by react-select.
   * @param state Current component state (focused, disabled, etc.).
   * @returns Updated style object for the control.
   */
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderColor: state.isFocused ? "#4a9eff" : "#ddd",
    boxShadow: state.isFocused ? "0 0 0 1px #4a9eff" : "none",
    "&:hover": { borderColor: "#4a9eff" },
  }),
  /**
   * Styles each selected value container (selected chips).
   *
   * @param base Default base styles for the selected chip.
   * @returns Updated style object for multiValue.
   */
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e8f4f8",
    borderRadius: "4px",
  }),
  /**
   * Styles the label part inside each selected chip.
   *
   * @param base Default base styles for the label text.
   * @returns Updated style object for multiValueLabel.
   */
  multiValueLabel: (base) => ({
    ...base,
    color: "#333",
    fontWeight: "500",
  }),
  /**
   * Styles the remove (×) icon inside each selected chip.
   *
   * @param base Default base styles for the remove button.
   * @returns Updated style object for multiValueRemove.
   */
  multiValueRemove: (base) => ({
    ...base,
    color: "#666",
    ":hover": { backgroundColor: "#d32f2f", color: "white" },
  }),
};

/**
 * Converts a string array into react-select compatible options.
 * @param arr Array of strings to convert
 * @returns Array of SelectOption
 */
export const toOptions = (arr: string[]): SelectOption[] =>
  arr.map((val) => ({ value: val, label: val }));

/**
 * Converts a File into a Base64 encoded string.
 * @param file The file to convert
 * @returns A promise resolving to the Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    /**
     * Handles successful file read.
     * @returns {void}
     */
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
