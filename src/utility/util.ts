import type { DecodedToken } from "../types/auth";
import type { PartnerAddress } from "../types/partnerProfile";

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
