export interface DiagnosticQuestion {
  id: string;
  question: string;
  category: string;
  logic: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnerProfile {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  status: string;
  experience: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  source: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalLeads: number;
  activePartners: number;
  totalQuestions: number;
  conversionRate: number;
  chartData: number[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiError {
  message: string;
  code?: number;
  details?: unknown;
}
