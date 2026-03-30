// types/lead.ts

/**
 * Raw flat row returned by GET /admin/leads API.
 * One row per lead-partner combination.
 */
export interface RawLeadRow {
  lead_id: string;
  leads_status: string;
  quoter_id: string;
  quoter_name: string;
  quoter_email: string;
  partner_id: string;
  partner_display_name: string;
  partner_image_url: string;
  partner_speciality: string;
  partner_address: string;
  partner_city: string;
  partner_state: string;
}

/**
 * Pagination wrapper returned by the leads API.
 */
export interface LeadsApiResponse {
  leads: RawLeadRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Flat UI row — maps 1:1 with RawLeadRow, used directly in the table.
 */
export interface LeadRow {
  leadId: string;
  leadsStatus: string;
  quoterId: string;
  quoterName: string;
  quoterEmail: string;
  partnerId: string;
  partnerDisplayName: string;
  partnerImageUrl: string;
  partnerSpeciality: string;
  partnerAddress: string;
  partnerCity: string;
  partnerState: string;
}

/**
 * Props for the Leads page component.
 */
export interface LeadProps {
  limit?: number;
}



/**
 * Props for the ProfessionalsModal component.
 *
 * @property {boolean} isOpen - Whether the modal is currently open
 * @property {() => void} onClose - Callback to close the modal
 * @property {LeadRow | null} row - The lead row data to display in the modal, or null if none selected
 */
export interface ProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: LeadRow | null;
}

// import React from "react";
// import "./index.css";
// import type { LeadRow } from "../../types/lead";
/**
 * Props for the ProfessionalsModal component.
 *
 * @property {boolean} isOpen - Whether the modal is currently open
 * @property {() => void} onClose - Callback to close the modal
 * @property {LeadRow | null} row - The lead row data to display in the modal, or null if none selected
 */
export interface ProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: LeadRow | null;
}