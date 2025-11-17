import type { PartnerAddress } from "../services/apiCalls/partnerProfile";
import type { DecodedToken } from "../types/auth";

export const decodePayload = (decoded: DecodedToken): DecodedToken => ({
  ...decoded,
  userEmail: base64Decode(decoded.userEmail),
  role: base64Decode(decoded.role),
  userId: base64Decode(decoded.userId),
});

// Helper: Base64 decode safely
export const base64Decode = (value: string): string => {
  try {
    return atob(value);
  } catch {
    return value;
  }
};

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
