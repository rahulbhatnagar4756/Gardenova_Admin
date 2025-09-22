import { useState } from "react";
import "./partnerProfiles.css";
import { usePartnerProfiles } from "../../hooks/usePartnerProfiles";
import type {
  PartnerProfileResponse,
  PartnerProfileRequest,
} from "../../services/apiCalls/partnerProfileService";
import { DataTable } from "../../components/dataTable/dataTable";
import { Modal } from "../../components/modal/modal";
import { PartnerForm } from "../../components/partnerForm/partnerForm";
import { Pencil, Trash2 } from "lucide-react";

// interface PartnerProfilesProps {
//   limit?: number;
// }

// // Extended PartnerProfile type for UI with index-based ID
// interface PartnerProfileWithId extends PartnerProfileResponse {
//   [key: string]: unknown; // <-- This makes it satisfy Record<string, unknown>
// }

export const PartnerProfiles = () => {
  // const {
  //   partners,
  //   loading,
  //   error,
  //   createPartner,
  //   updatePartner,
  //   deletePartner,
  // } = usePartnerProfiles();

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [editingPartner, setEditingPartner] =
  //   useState<PartnerProfileResponse | null>(null);

  // const partnersWithId: PartnerProfileWithId[] = partners.map((p, index) => ({
  //   ...p,
  //   id: index.toString(),
  // }));

  // const renderOptionsAsList = (options: string[]) => {
  //   if (!options || options.length === 0) {
  //     return <span className="no-options">No options</span>;
  //   }

  //   return (
  //     <div className="options-list">
  //       {options.map((option, index) => (
  //         <div key={index} className="option-item">
  //           <span className="option-number">{index + 1}.</span>
  //           <span className="option-text">{option}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // const columns = [
  //   {
  //     key: "__index",
  //     label: "Q.No. ",
  //     className: "partner-column",
  //   },
  //   {
  //     key: "profileImage",
  //     label: "Profile Image",
  //     render: (_value: unknown, item: PartnerProfileWithId) => {
  //       if (item.profileImage) {
  //         return (
  //           <img
  //             src={item.profileImage} // base64 string from backend
  //             alt={item.companyName}
  //             className="profile-image"
  //           />
  //         );
  //       } else {
  //         return <span className="no-image">No image</span>;
  //       }
  //     },

  //     className: "image-column",
  //   },
  //   {
  //     key: "companyName",
  //     label: "Company Name",
  //     className: "company-column",
  //   },
  //   {
  //     key: "email",
  //     label: "Email",
  //     className: "email-column",
  //   },
  //   {
  //     key: "speciality",
  //     label: "Specialties",
  //     render: (_value: unknown, item: PartnerProfileWithId) =>
  //       renderOptionsAsList(item.speciality || []),
  //     className: "options-column",
  //   },
  //   {
  //     key: "status",
  //     label: "Status",
  //     className: "status-column",
  //   },
  //   {
  //     key: "contactPerson",
  //     label: "Contact Person",
  //     className: "contact-column",
  //   },
  //   {
  //     key: "mobileNumber",
  //     label: "Phone",
  //     className: "phone-column",
  //   },
  // ];

  // const handleEdit = (partner: PartnerProfileResponse) => {
  //   setEditingPartner(partner);
  //   setIsModalOpen(true);
  // };

  // const handleDelete = async (id: string) => {
  //   if (window.confirm("Are you sure you want to delete this partner?")) {
  //     try {
  //       await deletePartner(id);
  //     } catch (err) {
  //       console.error("Failed to delete partner:", err);
  //       // You might want to show a toast notification here
  //     }
  //   }
  // };

  // const handleSubmit = async (data: PartnerProfileRequest) => {
  //   try {
  //     if (editingPartner) {
  //       await updatePartner(editingPartner._id, data);
  //     } else {
  //       await createPartner(data);
  //     }
  //     setIsModalOpen(false);
  //     setEditingPartner(null);
  //   } catch (err) {
  //     console.error("Failed to save partner:", err);
  //     // You might want to show a toast notification here
  //   }
  // };

  // const actions = [
  //   {
  //     label: "Edit",
  //     icon: <Pencil size={16} />,
  //     onClick: handleEdit,
  //     className: "btn-secondary",
  //   },
  //   {
  //     label: "Delete",
  //     icon: <Trash2 size={16} />,
  //     onClick: (item: PartnerProfileResponse) => handleDelete(item._id),
  //     className: "btn-danger",
  //   },
  // ];

  // const displayedPartners = limit
  //   ? partnersWithId.slice(0, limit)
  //   : partnersWithId;

  // if (loading) return <div className="loading">Loading partners...</div>;
  // if (error) return <div className="error">Error: {error}</div>;

  return (
    // 
    
    <>
    <div className="main_page">
      <div className="main_heading_area">
        <div className="row">
          <div className="col-md">
            <h4 className="page_heading">Manage Professtionals</h4>
          </div>
          <div className="col-md-auto">
            <a href="" className="common_button" data-bs-toggle="modal" data-bs-target="#exampleModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 3C9.41421 3 9.75 3.33579 9.75 3.75V8.25H14.25C14.6642 8.25 15 8.58579 15 9C15 9.41421 14.6642 9.75 14.25 9.75H9.75V14.25C9.75 14.6642 9.41421 15 9 15C8.58579 15 8.25 14.6642 8.25 14.25V9.75H3.75C3.33579 9.75 3 9.41421 3 9C3 8.58579 3.33579 8.25 3.75 8.25H8.25V3.75C8.25 3.33579 8.58579 3 9 3Z" fill="white"/>
              </svg> Add Professtionals
              </a>
          </div>
        </div>
      </div>
      <div className="mp_table">
        <table className="table mb-0">
  <thead>
    <tr>
      <th scope="col">Photo</th>
      <th scope="col">Name</th>
      <th scope="col">Specialty</th>
      <th scope="col">Service Region</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td scope="row"><img src="../src/images/profile.jpg" className="profile_img" alt="" /></td>
      <td>Gilberto Elkis Paisagismo</td>
      <td>Exuberant Tropical Gardens</td>
      <td>São Paulo - Capital, Ribeirão Preto</td>
      <td>
    <span className="action_icons">
      <span>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  width={22}
  height={22}
  viewBox="0 0 22 22"
  fill="none"
>
  <path
    d="M19.3357 6.17264L15.5812 2.41896C15.2661 2.10396 14.8388 1.927 14.3932 1.927C13.9477 1.927 13.5204 2.10396 13.2053 2.41896L2.84486 12.7786C2.6883 12.9342 2.56417 13.1193 2.47966 13.3232C2.39515 13.5271 2.35195 13.7458 2.35255 13.9665V17.721C2.35255 18.1667 2.52957 18.594 2.84468 18.9091C3.15979 19.2243 3.58717 19.4013 4.0328 19.4013H18.1469C18.4143 19.4013 18.6707 19.2951 18.8598 19.106C19.0489 18.9169 19.1551 18.6605 19.1551 18.3931C19.1551 18.1258 19.0489 17.8693 18.8598 17.6803C18.6707 17.4912 18.4143 17.385 18.1469 17.385H10.5018L19.3357 8.54936C19.4918 8.39333 19.6156 8.20807 19.7001 8.00417C19.7846 7.80026 19.8281 7.58171 19.8281 7.361C19.8281 7.14029 19.7846 6.92174 19.7001 6.71784C19.6156 6.51394 19.4918 6.32868 19.3357 6.17264ZM7.64534 17.385H4.36885V14.1085L11.4259 7.05142L14.7024 10.3279L7.64534 17.385ZM16.1306 8.8997L12.8541 5.6232L14.3949 4.08241L17.6714 7.3589L16.1306 8.8997Z"
    fill="#4A4A4A"
  />
</svg>

      </span>
      <span>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  width={20}
  height={20}
  viewBox="0 0 20 20"
  fill="none"
>
  <g clipPath="url(#clip0_624_1202)">
    <path
      d="M16.7095 3.99911H3.50756C3.26883 3.99911 3.03987 4.09395 2.87107 4.26275C2.70226 4.43156 2.60742 4.66052 2.60742 4.89925C2.60742 5.13798 2.70226 5.36693 2.87107 5.53574C3.03987 5.70455 3.26883 5.79938 3.50756 5.79938H3.8076V16.0009C3.8076 16.3988 3.96566 16.7804 4.24701 17.0617C4.52836 17.3431 4.90994 17.5011 5.30783 17.5011H14.9093C15.3072 17.5011 15.6888 17.3431 15.9701 17.0617C16.2514 16.7804 16.4095 16.3988 16.4095 16.0009V5.79938H16.7095C16.9483 5.79938 17.1772 5.70455 17.346 5.53574C17.5148 5.36693 17.6097 5.13798 17.6097 4.89925C17.6097 4.66052 17.5148 4.43156 17.346 4.26275C17.1772 4.09395 16.9483 3.99911 16.7095 3.99911ZM14.6092 15.7009H5.60787V5.79938H14.6092V15.7009ZM6.20797 1.89879C6.20797 1.66006 6.3028 1.43111 6.47161 1.2623C6.64042 1.09349 6.86937 0.998657 7.1081 0.998657H13.109C13.3477 0.998657 13.5767 1.09349 13.7455 1.2623C13.9143 1.43111 14.0091 1.66006 14.0091 1.89879C14.0091 2.13752 13.9143 2.36648 13.7455 2.53529C13.5767 2.70409 13.3477 2.79893 13.109 2.79893H7.1081C6.86937 2.79893 6.64042 2.70409 6.47161 2.53529C6.3028 2.36648 6.20797 2.13752 6.20797 1.89879Z"
      fill="#4A4A4A"
    />
  </g>
  <defs>
    <clipPath id="clip0_624_1202">
      <rect
        width="19.2029"
        height="19.2029"
        fill="white"
        transform="translate(0.507324 0.39856)"
      />
    </clipPath>
  </defs>
</svg>

      </span>
    </span>
      </td>
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
          <h4 className="head_modal">Add New Professtionals</h4>
        <p className="sub_head">Enter The details and marked</p>
        </div>

        
        <div className="input_field">
              <label htmlFor="email">Name *</label>
              <div className="position-relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Question"
                  className="form-control"
                  autoComplete="off"
                />
                

              </div>
            </div>
             <div className="input_field">
              <label htmlFor="email">Specialty *</label>
              <div className="position-relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Specialty"
                  className="form-control"
                  autoComplete="off"
                />
                

              </div>
            </div>

            <div className="input_field">
              <label htmlFor="email">Service Region *</label>
              <div className="position-relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Service Region"
                  className="form-control"
                  autoComplete="off"
                />
                

              </div>
            </div>
            

<button type="submit" className="btn common_button mt-3">Save</button>

      </div>
      
    </div>
  </div>
</div>
    </>
  );
};
