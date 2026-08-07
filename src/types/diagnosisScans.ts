/** Nested user info that may appear on a scan record. */
export interface DiagnosisScanUser {
  id?: string;
  name?: string | null;
  email?: string | null;
}

/**
 * Admin diagnosis scan log entry.
 * Field names follow the live API snake_case style; optional keys
 * cover likely aliases when the payload varies.
 */
export interface DiagnosisScan {
  id: string;
  image_url?: string | null;
  imageUrl?: string | null;
  predicted_disease?: string | null;
  predictedDisease?: string | null;
  disease?: string | null;
  confidence_score?: number | null;
  confidence?: number | null;
  plant_name?: string | null;
  plantName?: string | null;
  user_id?: string | null;
  userId?: string | null;
  user_name?: string | null;
  userName?: string | null;
  user_email?: string | null;
  userEmail?: string | null;
  user?: DiagnosisScanUser | null;
  created_at?: string | null;
  createdAt?: string | null;
  raw_result?: unknown;
  rawResult?: unknown;
}

/** Paginated diagnosis scans response. */
export interface DiagnosisScansListData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  scans: DiagnosisScan[];
}

/** Query filters for diagnosis scan logs. */
export interface DiagnosisScansFilters {
  search?: string;
  disease?: string;
  userId?: string;
  from?: string;
  to?: string;
}
