/**
 * Represents aggregated dashboard statistics.
 *
 * @property totalLeads - Total number of leads in the system.
 * @property activePartners - Count of active professionals/partners.
 * @property totalQuestions - Total diagnostic questions created.
 * @property conversionRate - Lead conversion percentage.
 * @property chartData - Array of numeric values used for charts.
 */
export interface DashboardData {
  totalLeads: number;
  activePartners: number;
  totalQuestions: number;
  conversionRate: number;
  chartData: number[];
}

/**
 * Dashboard metric representing lead count and today's update.
 *
 * @property count - Total number of leads.
 * @property today - Number of leads added today.
 * @property message - Summary or status message.
 */
export interface DashboardLeadCounts {
  count: number;
  today: number;
  message: string;
}

/**
 * Dashboard metric for tracking active professionals.
 *
 * @property count - Total active professionals.
 * @property today - Professionals added today.
 * @property message - Summary or status message.
 */
export interface DashboardActiveProfessionals {
  count: number;
  today: number;
  message: string;
}

/**
 * Represents the number of leads grouped by status.
 *
 * @property status - Status label (e.g., "new", "closed").
 * @property count - Total number of leads for this status.
 */
export interface LeadStatusCount {
  status: string;
  count: number;
}

/**
 * Represents a daily trend data point for leads.
 *
 * @property date - Date of the record.
 * @property count - Number of leads recorded on that date.
 */
export interface LeadTrendItem {
  date: string;
  count: number;
}

/**
 * Represents closed lead statistics for the dashboard.
 *
 * @property total - Total number of closed leads.
 * @property this_month - Number of closed leads in the current month.
 * @property message - Status or summary message.
 */
export interface DashboardClosedLeads {
  total: number;
  this_month: number;
  message: string;
}

/**
 * Represents lead trends across categories.
 *
 * @property all_leads - Daily trend of all leads.
 * @property new_leads - Daily trend of newly created leads.
 * @property closed_leads - Daily trend of closed leads.
 * @property contacted_leads - Daily trend of contacted leads.
 */
export interface DashboardTrend {
  all_leads: LeadTrendItem[];
  new_leads: LeadTrendItem[];
  closed_leads: LeadTrendItem[];
  contacted_leads: LeadTrendItem[];
}

/**
 * Final dashboard response returned by backend.
 *
 * @property total_leads - Lead count metrics.
 * @property active_professionals - Active professionals metrics.
 * @property closed_leads - Closed lead statistics.
 * @property lead_status_counts - Lead statuses with counts.
 * @property lead_trend - Trend analysis of lead changes over time.
 */
export interface DashboardResponse {
  total_leads: DashboardLeadCounts;
  active_professionals: DashboardActiveProfessionals;
  closed_leads: DashboardClosedLeads;
  lead_status_counts: LeadStatusCount[];
  lead_trend: DashboardTrend;
}

/**
 * Represents a single data point for lead trend charts.
 * Each point contains the date and the total count for that day.
 */
export interface TrendPoint {
  date: string;
  count: number;
}

/**
 * Collection of categorized lead trend datasets used in dashboard charts.
 * Includes data for all leads, new leads, closed leads, and contacted leads.
 */
export interface TrendDataSet {
  all: TrendPoint[];
  new: TrendPoint[];
  closed: TrendPoint[];
  contacted: TrendPoint[];
}

/**
 * Allowed filter types for selecting how the trend chart data is displayed.
 * - all → full dataset
 * - monthly → last 30 days
 * - yearly → last 12 months
 * - custom → date range selected by the user
 */
export type TrendFilter = "all" | "monthly" | "yearly" | "custom";

/**
 * Props for the DashboardLineChart component.
 * Contains the complete dataset required for rendering the line chart.
 */
export interface DashboardLineChartProps {
  data: TrendDataSet;
}
