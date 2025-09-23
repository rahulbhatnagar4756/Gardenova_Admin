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
    // <div className="leads-page">
    //   <div className="leads-header">
    //     <h2>Leads</h2>
    //     {!limit && (
    //       <div className="filter-controls">
    //         <select
    //           value={filterStatus}
    //           onChange={(e) => setFilterStatus(e.target.value)}
    //           className="filter-select"
    //         >
    //           <option value="all">All Leads</option>
    //           <option value="new">New</option>
    //           <option value="contacted">Contacted</option>
    //           <option value="converted">Converted</option>
    //         </select>
    //       </div>
    //     )}
    //   </div>

    //   {!limit && (
    //     <div className="leads-stats">
    //       <div className="stat-item">
    //         <span className="stat-label">Total Leads:</span>
    //         <span className="stat-value">{leads.length}</span>
    //       </div>
    //       <div className="stat-item">
    //         <span className="stat-label">New:</span>
    //         <span className="stat-value">
    //           {leads.filter((l) => l.status === "new").length}
    //         </span>
    //       </div>
    //       <div className="stat-item">
    //         <span className="stat-label">Contacted:</span>
    //         <span className="stat-value">
    //           {leads.filter((l) => l.status === "contacted").length}
    //         </span>
    //       </div>
    //       <div className="stat-item">
    //         <span className="stat-label">Converted:</span>
    //         <span className="stat-value">
    //           {leads.filter((l) => l.status === "converted").length}
    //         </span>
    //       </div>
    //     </div>
    //   )}

    //   <DataTable
    //     data={!limit ? filteredLeads : diplayedLeads}
    //     columns={columns}
    //     actions={actions}
    //   />
    // </div>
    <>
    <div className="main_page">
      <div className="main_heading_area">
        <div className="row">
          <div className="col-md">
            <h4 className="page_heading">All Leads</h4>
          </div>
          <div className="col-md-auto">
             <div className="input_field">
              <div className="position-relative">
                <select name="" id="" className="form-select">
                  <option value="">All Leads</option>
                  <option value="">All Leads</option>
                  <option value="">All Leads</option>
                  <option value="">All Leads</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mp_table">
        <table className="table mb-0">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Leads Status</th>
      <th scope="col" className="text-end">Request to Professtionals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td scope="row">Jane Smith</td>
      <td>janesmith@gmail.com</td>
      <td><span className="cus_badge new_lead">New</span></td>
      <td className="text-end"><a href="javascript:void(0)" className="underline_link"  data-bs-toggle="modal" data-bs-target="#exampleModal">São Paulo - Capital, Ribeirão Preto</a></td>
      
    </tr>

     <tr>
      <td scope="row">Jane Smith</td>
      <td>janesmith@gmail.com</td>
      <td><span className="cus_badge closed_lead">Closed</span></td>
      <td className="text-end"><a href="" className="underline_link">São Paulo - Capital, Ribeirão Preto</a></td>
      
    </tr>

     <tr>
      <td scope="row">Jane Smith</td>
      <td>janesmith@gmail.com</td>
      <td><span className="cus_badge converted_lead">Converted</span></td>
      <td className="text-end"><a href="" className="underline_link">São Paulo - Capital, Ribeirão Preto</a></td>
      
    </tr>
    
    
  </tbody>
</table>
<div className="pagination_design">
  <div className="row align-items-center">
    <div className="col-md">
      <p className="pagination_label">Showing: 1 to 10 of 500 results</p>
    </div>
    <div className="col-md">
      <ul className="pagi_design">
        <li>
<span>
  <svg
  width={16}
  height={17}
  viewBox="0 0 16 17"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M7.8049 4.28035C8.06525 4.54069 8.06525 4.9628 7.8049 5.22315L4.94297 8.08508L7.8049 10.947C8.06525 11.2074 8.06525 11.6295 7.8049 11.8898C7.54455 12.1502 7.12244 12.1502 6.86209 11.8898L3.52876 8.55649C3.26841 8.29614 3.26841 7.87403 3.52876 7.61368L6.86209 4.28035C7.12244 4.02 7.54455 4.02 7.8049 4.28035ZM12.4716 4.28035C12.7319 4.54069 12.7319 4.9628 12.4716 5.22315L9.60964 8.08508L12.4716 10.947C12.7319 11.2074 12.7319 11.6295 12.4716 11.8898C12.2112 12.1502 11.7891 12.1502 11.5288 11.8898L8.19543 8.55649C7.93508 8.29614 7.93508 7.87403 8.19543 7.61368L11.5288 4.28035C11.7891 4.02 12.2112 4.02 12.4716 4.28035Z"
    fill="#525856"
  />
</svg>
</span>


        </li>
        <li>
<span>
  <svg
  width={16}
  height={17}
  viewBox="0 0 16 17"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M10.4716 3.61372C10.7319 3.87407 10.7319 4.29618 10.4716 4.55653L6.94297 8.08512L10.4716 11.6137C10.7319 11.8741 10.7319 12.2962 10.4716 12.5565C10.2112 12.8169 9.78911 12.8169 9.52876 12.5565L5.52876 8.55653C5.26841 8.29618 5.26841 7.87407 5.52876 7.61372L9.52876 3.61372C9.78911 3.35337 10.2112 3.35337 10.4716 3.61372Z"
    fill="#525856"
  />
</svg>
</span>


        </li>
        <li className="active">
           <span>1</span>
        </li>
        <li>
           <span>2</span>
        </li>
        <li>
           <span>3</span>
        </li>
        <li>
          <span className="pointer-none">...</span>
        </li>
        <li>
           <span>99</span>
        </li>
        <li>
         <span>
           <svg
  width={16}
  height={17}
  viewBox="0 0 16 17"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M5.52864 3.61128C5.78899 3.35093 6.2111 3.35093 6.47145 3.61128L10.4714 7.61128C10.7318 7.87163 10.7318 8.29374 10.4714 8.55409L6.47145 12.5541C6.2111 12.8144 5.78899 12.8144 5.52864 12.5541C5.26829 12.2937 5.26829 11.8716 5.52864 11.6113L9.05723 8.08268L5.52864 4.55409C5.26829 4.29374 5.26829 3.87163 5.52864 3.61128Z"
    fill="#525856"
  />
</svg>
         </span>

        </li>
        <li>
          <span>
            <svg
  width={16}
  height={17}
  viewBox="0 0 16 17"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M3.52876 4.28035C3.78911 4.02 4.21122 4.02 4.47157 4.28035L7.8049 7.61368C8.06525 7.87403 8.06525 8.29614 7.8049 8.55649L4.47157 11.8898C4.21122 12.1502 3.78911 12.1502 3.52876 11.8898C3.26841 11.6295 3.26841 11.2074 3.52876 10.947L6.39069 8.08508L3.52876 5.22315C3.26841 4.9628 3.26841 4.54069 3.52876 4.28035ZM8.19543 4.28035C8.45577 4.02 8.87788 4.02 9.13823 4.28035L12.4716 7.61368C12.7319 7.87403 12.7319 8.29614 12.4716 8.55649L9.13823 11.8898C8.87788 12.1502 8.45577 12.1502 8.19543 11.8898C7.93508 11.6295 7.93508 11.2074 8.19543 10.947L11.0574 8.08508L8.19543 5.22315C7.93508 4.9628 7.93508 4.54069 8.19543 4.28035Z"
    fill="#525856"
  />
</svg>
          </span>


        </li>
      </ul>
    </div>
  </div>
</div>
      </div>
    </div>
  <div
  className="modal fade"
  id="exampleModal"
  tabIndex={-1}
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
  data-bs-backdrop="static"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
<svg
  width={27}
  height={27}
  viewBox="0 0 27 27"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect width={27} height={27} rx="13.5" fill="url(#paint0_linear_790_3208)" />
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M18.2908 18.2908C18.5697 18.0118 18.5697 17.5596 18.2908 17.2806L9.71936 8.70921C9.44042 8.43026 8.98816 8.43026 8.70921 8.70921C8.43026 8.98816 8.43026 9.44042 8.70921 9.71936L17.2806 18.2908C17.5596 18.5697 18.0118 18.5697 18.2908 18.2908Z"
    fill="#F4F4F4"
  />
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M8.70921 18.2908C8.98816 18.5697 9.44042 18.5697 9.71936 18.2908L18.2908 9.71936C18.5697 9.44042 18.5697 8.98815 18.2908 8.70921C18.0118 8.43026 17.5596 8.43026 17.2806 8.70921L8.70921 17.2806C8.43026 17.5596 8.43026 18.0118 8.70921 18.2908Z"
    fill="#F4F4F4"
  />
  <defs>
    <linearGradient
      id="paint0_linear_790_3208"
      x1="13.5"
      y1={0}
      x2="13.5"
      y2={27}
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#E0B669" />
      <stop offset={1} stopColor="#B48A3E" />
    </linearGradient>
  </defs>
</svg>

          </button>
      <div className="modal-body">
        <div className="head_area"> 
          <h4 className="head_modal">Add New Question</h4>
        <p className="sub_head">Enter The details and marked</p>
        </div>

        <div className="input_field">
              <label htmlFor="email">Question Text *</label>
              <div className="position-relative">
                <textarea rows={3}
  placeholder="Enter Your Question"
  className="form-control"
/>

              </div>
            </div>
        <div className="input_field">
              <label htmlFor="email">Add Options *</label>
              <div className="position-relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Options Text"
                  className="form-control"
                  autoComplete="off"
                />
                <span className="add_options">
                  <svg
                width={24}
                height={25}
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.648438"
                  y="0.824463"
                  width="23.3511"
                  height="23.3511"
                  rx={4}
                  fill="#B48A3E"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.08594 12.4999C5.08594 12.833 5.35599 13.1031 5.68913 13.1031H18.9593C19.2924 13.1031 19.5625 12.833 19.5625 12.4999C19.5625 12.1668 19.2924 11.8967 18.9593 11.8967H5.68913C5.35599 11.8967 5.08594 12.1668 5.08594 12.4999Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.3239 19.7383C12.657 19.7383 12.9271 19.4682 12.9271 19.1351V5.86491C12.9271 5.53178 12.657 5.26172 12.3239 5.26172C11.9908 5.26172 11.7207 5.53178 11.7207 5.86491V19.1351C11.7207 19.4682 11.9908 19.7383 12.3239 19.7383Z"
                  fill="white"
                />
              </svg>
                </span>

              </div>
            </div>
            <div className="added_list_main_outer">
  <span className="added_label">
    <span className="added_check_icon">
      <svg
  xmlns="http://www.w3.org/2000/svg"
  width={15}
  height={16}
  viewBox="0 0 15 16"
  fill="none"
>
  <path
    d="M7.0592 15.0592C10.9579 15.0592 14.1184 11.8987 14.1184 8C14.1184 4.10131 10.9579 0.940804 7.0592 0.940804C3.16051 0.940804 0 4.10131 0 8C0 11.8987 3.16051 15.0592 7.0592 15.0592Z"
    fill="url(#paint0_linear_611_877)"
  />
  <path
    d="M4.38379 8.40638L6.16643 10.0322L9.73168 5.96776"
    stroke="white"
    strokeWidth="1.71936"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <defs>
    <linearGradient
      id="paint0_linear_611_877"
      x1="7.0592"
      y1="0.940804"
      x2="7.0592"
      y2="15.0592"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#E0B669" />
      <stop offset={1} stopColor="#B48A3E" />
    </linearGradient>
  </defs>
</svg>

    </span>
    Added Options
  </span>
  <ul className="added_list_main">
    <li>
      <span className="added_list">
        Home Garden
      </span>
      <span className="list_icons">
      
        <span className="bg_icon_et">
          <svg
  xmlns="http://www.w3.org/2000/svg"
  width={16}
  height={17}
  viewBox="0 0 16 17"
  fill="none"
>
  <path
    d="M14.4854 2.76467H11.3604V2.13967C11.3604 1.64239 11.1628 1.16548 10.8112 0.813848C10.4595 0.462217 9.98263 0.264673 9.48535 0.264673H5.73535C5.23807 0.264673 4.76116 0.462217 4.40953 0.813848C4.0579 1.16548 3.86035 1.64239 3.86035 2.13967V2.76467H0.735352C0.569591 2.76467 0.41062 2.83052 0.29341 2.94773C0.1762 3.06494 0.110352 3.22391 0.110352 3.38967C0.110352 3.55543 0.1762 3.7144 0.29341 3.83161C0.41062 3.94882 0.569591 4.01467 0.735352 4.01467H1.36035V15.2647C1.36035 15.5962 1.49205 15.9141 1.72647 16.1486C1.96089 16.383 2.27883 16.5147 2.61035 16.5147H12.6104C12.9419 16.5147 13.2598 16.383 13.4942 16.1486C13.7287 15.9141 13.8604 15.5962 13.8604 15.2647V4.01467H14.4854C14.6511 4.01467 14.8101 3.94882 14.9273 3.83161C15.0445 3.7144 15.1104 3.55543 15.1104 3.38967C15.1104 3.22391 15.0445 3.06494 14.9273 2.94773C14.8101 2.83052 14.6511 2.76467 14.4854 2.76467ZM6.36035 12.1397C6.36035 12.3054 6.2945 12.4644 6.17729 12.5816C6.06008 12.6988 5.90111 12.7647 5.73535 12.7647C5.56959 12.7647 5.41062 12.6988 5.29341 12.5816C5.1762 12.4644 5.11035 12.3054 5.11035 12.1397V7.13967C5.11035 6.97391 5.1762 6.81494 5.29341 6.69773C5.41062 6.58052 5.56959 6.51467 5.73535 6.51467C5.90111 6.51467 6.06008 6.58052 6.17729 6.69773C6.2945 6.81494 6.36035 6.97391 6.36035 7.13967V12.1397ZM10.1104 12.1397C10.1104 12.3054 10.0445 12.4644 9.92729 12.5816C9.81008 12.6988 9.65111 12.7647 9.48535 12.7647C9.31959 12.7647 9.16062 12.6988 9.04341 12.5816C8.9262 12.4644 8.86035 12.3054 8.86035 12.1397V7.13967C8.86035 6.97391 8.9262 6.81494 9.04341 6.69773C9.16062 6.58052 9.31959 6.51467 9.48535 6.51467C9.65111 6.51467 9.81008 6.58052 9.92729 6.69773C10.0445 6.81494 10.1104 6.97391 10.1104 7.13967V12.1397ZM10.1104 2.76467H5.11035V2.13967C5.11035 1.97391 5.1762 1.81494 5.29341 1.69773C5.41062 1.58052 5.56959 1.51467 5.73535 1.51467H9.48535C9.65111 1.51467 9.81008 1.58052 9.92729 1.69773C10.0445 1.81494 10.1104 1.97391 10.1104 2.13967V2.76467Z"
    fill="#F4F4F4"
  />
</svg>

        </span>
      </span>
    </li>
    <li>
      <span className="added_list">
       Apartment Balcony
      </span>
      <span className="list_icons">
        
        <span className="bg_icon_et">
         <svg
  xmlns="http://www.w3.org/2000/svg"
  width={16}
  height={17}
  viewBox="0 0 16 17"
  fill="none"
>
  <path
    d="M14.4854 2.76467H11.3604V2.13967C11.3604 1.64239 11.1628 1.16548 10.8112 0.813848C10.4595 0.462217 9.98263 0.264673 9.48535 0.264673H5.73535C5.23807 0.264673 4.76116 0.462217 4.40953 0.813848C4.0579 1.16548 3.86035 1.64239 3.86035 2.13967V2.76467H0.735352C0.569591 2.76467 0.41062 2.83052 0.29341 2.94773C0.1762 3.06494 0.110352 3.22391 0.110352 3.38967C0.110352 3.55543 0.1762 3.7144 0.29341 3.83161C0.41062 3.94882 0.569591 4.01467 0.735352 4.01467H1.36035V15.2647C1.36035 15.5962 1.49205 15.9141 1.72647 16.1486C1.96089 16.383 2.27883 16.5147 2.61035 16.5147H12.6104C12.9419 16.5147 13.2598 16.383 13.4942 16.1486C13.7287 15.9141 13.8604 15.5962 13.8604 15.2647V4.01467H14.4854C14.6511 4.01467 14.8101 3.94882 14.9273 3.83161C15.0445 3.7144 15.1104 3.55543 15.1104 3.38967C15.1104 3.22391 15.0445 3.06494 14.9273 2.94773C14.8101 2.83052 14.6511 2.76467 14.4854 2.76467ZM6.36035 12.1397C6.36035 12.3054 6.2945 12.4644 6.17729 12.5816C6.06008 12.6988 5.90111 12.7647 5.73535 12.7647C5.56959 12.7647 5.41062 12.6988 5.29341 12.5816C5.1762 12.4644 5.11035 12.3054 5.11035 12.1397V7.13967C5.11035 6.97391 5.1762 6.81494 5.29341 6.69773C5.41062 6.58052 5.56959 6.51467 5.73535 6.51467C5.90111 6.51467 6.06008 6.58052 6.17729 6.69773C6.2945 6.81494 6.36035 6.97391 6.36035 7.13967V12.1397ZM10.1104 12.1397C10.1104 12.3054 10.0445 12.4644 9.92729 12.5816C9.81008 12.6988 9.65111 12.7647 9.48535 12.7647C9.31959 12.7647 9.16062 12.6988 9.04341 12.5816C8.9262 12.4644 8.86035 12.3054 8.86035 12.1397V7.13967C8.86035 6.97391 8.9262 6.81494 9.04341 6.69773C9.16062 6.58052 9.31959 6.51467 9.48535 6.51467C9.65111 6.51467 9.81008 6.58052 9.92729 6.69773C10.0445 6.81494 10.1104 6.97391 10.1104 7.13967V12.1397ZM10.1104 2.76467H5.11035V2.13967C5.11035 1.97391 5.1762 1.81494 5.29341 1.69773C5.41062 1.58052 5.56959 1.51467 5.73535 1.51467H9.48535C9.65111 1.51467 9.81008 1.58052 9.92729 1.69773C10.0445 1.81494 10.1104 1.97391 10.1104 2.13967V2.76467Z"
    fill="#F4F4F4"
  />
</svg>

        </span>
      </span>
    </li>
  </ul>
</div>

<button type="submit" className="btn common_button mt-3">Save</button>

      </div>
      
    </div>
  </div>
</div>
    
    </>
  );
};
