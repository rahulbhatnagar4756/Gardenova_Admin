import { useState } from "react";
import "./leads.css";
import { useLeads } from "../../hooks/useLeads";
import type { Lead } from "../../types";
import { DataTable } from "../../components/dataTable/dataTable";

interface LeadProps {
  limit?: number;
}

export const Leads = ({ limit }: LeadProps) => {
  const { leads, loading, error, updateLeadStatus } = useLeads();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const columns = [
    { key: "name", label: "Name" },
    { key: "contact", label: "Contact" },
    { key: "source", label: "Source" },
    { key: "status", label: "Status" },
  ];

  const handleStatusChange = async (lead: Lead, newStatus: string) => {
    await updateLeadStatus(lead.id, newStatus);
  };

  const filteredLeads =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => lead.status === filterStatus);

  const actions = [
    {
      label: "Mark as Contacted",
      onClick: (item: Lead) => handleStatusChange(item, "contacted"),
      className: "btn-secondary",
      show: (item: Lead) => item.status === "new",
    },
    {
      label: "Mark as Converted",
      onClick: (item: Lead) => handleStatusChange(item, "converted"),
      className: "btn-success",
      show: (item: Lead) => item.status === "contacted",
    },
  ];

  const diplayedLeads = limit ? leads.slice(0, limit) : leads;
  if (loading) return <div className="loading">Loading leads...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2>Leads</h2>
        {!limit && (
          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Leads</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        )}
      </div>

      {!limit && (
        <div className="leads-stats">
          <div className="stat-item">
            <span className="stat-label">Total Leads:</span>
            <span className="stat-value">{leads.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">New:</span>
            <span className="stat-value">
              {leads.filter((l) => l.status === "new").length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Contacted:</span>
            <span className="stat-value">
              {leads.filter((l) => l.status === "contacted").length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Converted:</span>
            <span className="stat-value">
              {leads.filter((l) => l.status === "converted").length}
            </span>
          </div>
        </div>
      )}

      <DataTable
        data={!limit ? filteredLeads : diplayedLeads}
        columns={columns}
        actions={actions}
      />
    </div>
  );
};
