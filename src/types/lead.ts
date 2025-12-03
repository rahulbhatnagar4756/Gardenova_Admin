/**
 * Represents a processed lead with mapped user and partner details.
 *
 * @property id - Unique identifier of the lead.
 * @property userId - ID of the user who created the lead.
 * @property userName - Name of the user.
 * @property userEmail - Email of the user.
 * @property leadsStatus - Status of the lead.
 * @property partners - Partner companies associated with the lead.
 */
export interface Lead {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  leadsStatus: string;
  partners: {
    partnerId: string;
    companyName: string;
  }[];
}

/**
 * Represents partner details inside a raw lead.
 *
 * @property partner_id - Unique identifier of the partner.
 * @property company_name - Name of the partner company.
 */
export interface LeadPartner {
  partner_id: string;
  company_name: string;
}

/**
 * Represents user information inside a raw lead.
 *
 * @property user_id - Unique identifier of the user.
 * @property user_name - Name of the user.
 * @property user_email - Email of the user.
 */
export interface LeadUser {
  user_id: string;
  user_name: string;
  user_email: string;
}

/**
 * Raw lead structure returned by backend before transforming to UI model.
 *
 * @property lead_id - Lead ID from backend.
 * @property leads_status - Status of the lead.
 * @property user - Nested user information.
 * @property partners - Array of partner details.
 */
export interface RawLead {
  lead_id: string;
  leads_status: string;
  user: LeadUser;
  partners: LeadPartner[];
}

/**
 * Pagination wrapper returned by the leads API.
 *
 * @property currentPage - Current page number.
 * @property totalPages - Total number of pages available.
 * @property totalCount - Total number of leads.
 * @property limit - Maximum items per page.
 * @property leads - Array of raw leads returned from backend.
 */
export interface LeadsResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  leads: RawLead[];
}

/**
 * Props used when fetching or listing leads.
 *
 * @property limit - Maximum number of leads to fetch.
 */
export interface LeadProps {
  limit?: number;
}
