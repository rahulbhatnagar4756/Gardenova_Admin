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

export interface LeadPartner {
  partner_id: string;
  company_name: string;
}

export interface LeadUser {
  user_id: string;
  user_name: string;
  user_email: string;
}

export interface RawLead {
  lead_id: string;
  leads_status: string;
  user: LeadUser;
  partners: LeadPartner[];
}

/**
 * Pagination wrapper returned by API
 */
export interface LeadsResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  leads: RawLead[];
}

export interface LeadProps {
  limit?: number;
}
