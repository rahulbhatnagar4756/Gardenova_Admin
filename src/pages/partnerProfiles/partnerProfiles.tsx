import { useRef, useState } from "react";
import "./partnerProfiles.css";
import { usePartnerProfiles } from "../../hooks/usePartnerProfiles";
import type {
  PartnerProfileResponse,
  PartnerProfileRequest,
  PartnerAddress,
} from "../../services/apiCalls/partnerProfileService";
import { Pagination } from "../../components/pagination";

interface PartnerProfilesProps {
  limit?: number;
}

// Extended PartnerProfile type for UI with index-based ID
interface PartnerProfileWithId extends PartnerProfileResponse {
  [key: string]: unknown;
}

export const PartnerProfiles = ({ limit }: PartnerProfilesProps) => {
  const {
    partners,
    loading,
    error,
    createPartner,
    updatePartner,
    deletePartner,
  } = usePartnerProfiles();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit ?? 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] =
    useState<PartnerProfileResponse | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    speciality: [] as string[],
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    website: "",
    contactPerson: "",
    mobileNumber: "",
    profileImage: "",
    status: "active",
  });

  const partnersWithId: PartnerProfileWithId[] = partners.map((p, index) => ({
    ...p,
    id: index.toString(),
  }));

  // Calculate pagination
  const totalItems = partnersWithId.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPartners = partnersWithId.slice(startIndex, endIndex);

  // Reset to first page if current page exceeds total pages
  const handlePageChange = (page: number) => {
    if (page > totalPages) {
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (partner?: PartnerProfileResponse) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        companyName: partner.companyName || "",
        email: partner.email || "",
        speciality: partner.speciality || [],
        address: {
          street: partner.address?.street || "",
          city: partner.address?.city || "",
          state: partner.address?.state || "",
          country: partner.address?.country || "",
          zipCode: partner.address?.zipCode || "",
        },
        website: partner.website || "",
        contactPerson: partner.contactPerson || "",
        mobileNumber: partner.mobileNumber || "",
        profileImage: partner.profileImage || "",
        status: partner.status || "active",
      });

      // 🔧 FIX: Set imagePreview for existing image
      setImagePreview(partner.profileImage || null);
    } else {
      setEditingPartner(null);
      setFormData({
        companyName: "",
        email: "",
        speciality: [],
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        website: "",
        contactPerson: "",
        mobileNumber: "",
        profileImage: "",
        status: "active",
      });

      // 🔧 FIX: Reset imagePreview for new entry
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
    setFormData({
      companyName: "",
      email: "",
      speciality: [],
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      website: "",
      contactPerson: "",
      mobileNumber: "",
      profileImage: "",
      status: "active",
    });

    // 🔧 FIX: Reset imagePreview when closing modal
    setImagePreview(null);

    // Also reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (PNG, JPG, JPEG)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Set preview
        setImagePreview(base64String);

        // Update form data with base64 string
        setFormData((prev) => ({
          ...prev,
          profileImage: base64String, // ✅ Save as base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: "", // reset to empty string
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const specialties = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData((prev) => ({
      ...prev,
      speciality: specialties,
    }));
  };

  const formatAddress = (address?: PartnerAddress) => {
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

  const handleSubmit = async () => {
    try {
      const requestData: PartnerProfileRequest = {
        companyName: formData.companyName,
        email: formData.email,
        speciality: formData.speciality,
        address: formData.address,
        website: formData.website,
        contactPerson: formData.contactPerson,
        mobileNumber: formData.mobileNumber,
        profileImage: formData.profileImage,
        status: formData.status as "active" | "inactive",
      };

      if (editingPartner) {
        await updatePartner(editingPartner._id, requestData);
      } else {
        await createPartner(requestData);
      }

      handleCloseModal(); // This will now properly reset imagePreview
    } catch (err) {
      console.error("Failed to save partner:", err);
    }
  };

  const handleDelete = async (partnerId: string) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        await deletePartner(partnerId);
      } catch (err) {
        console.error("Failed to delete partner:", err);
      }
    }
  };

  if (loading) return <div className="loading">Loading partners...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <div className="main_page">
        <div className="main_heading_area">
          <div className="row">
            <div className="col-md">
              <h4 className="page_heading">Manage Professionals</h4>
            </div>
            <div className="col-md-auto">
              <button
                type="button"
                className="common_button"
                onClick={() => handleOpenModal()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 3C9.41421 3 9.75 3.33579 9.75 3.75V8.25H14.25C14.6642 8.25 15 8.58579 15 9C15 9.41421 14.6642 9.75 14.25 9.75H9.75V14.25C9.75 14.6642 9.41421 15 9 15C8.58579 15 8.25 14.6642 8.25 14.25V9.75H3.75C3.33579 9.75 3 9.41421 3 9C3 8.58579 3.33579 8.25 3.75 8.25H8.25V3.75C8.25 3.33579 8.58579 3 9 3Z"
                    fill="white"
                  />
                </svg>
                Add Professionals
              </button>
            </div>
          </div>
        </div>

        <div className="mp_table">
          <table className="table mb-0">
            <thead>
              <tr>
                <th scope="col">Photo</th>
                <th scope="col">Company Name</th>
                <th scope="col">Specialty</th>
                <th scope="col">Address</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedPartners.length > 0 ? (
                displayedPartners.map((partner) => (
                  <tr key={partner._id}>
                    <td scope="row">
                      {partner.profileImage ? (
                        <img
                          src={partner.profileImage}
                          className="profile_img"
                          alt={partner.companyName || "Profile"}
                        />
                      ) : (
                        <div className="profile_img no-image">No Image</div>
                      )}
                    </td>
                    <td>{partner.companyName}</td>
                    <td>
                      {partner.speciality && partner.speciality.length > 0
                        ? partner.speciality.join(", ")
                        : "No specialties"}
                    </td>
                    <td>{formatAddress(partner.address)}</td>
                    <td>
                      <span className="action_icons">
                        <span
                          onClick={() => handleOpenModal(partner)}
                          style={{ cursor: "pointer" }}
                        >
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
                        <span
                          onClick={() => handleDelete(partner._id)}
                          style={{ cursor: "pointer" }}
                        >
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No partners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalItems > 0 && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                {/* Close SVG - you'll add your own */}
                <svg width={27} height={27} viewBox="0 0 27 27" fill="none">
                  <rect
                    width={27}
                    height={27}
                    rx="13.5"
                    fill="url(#paint0_linear_790_3208)"
                  />
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
                  <h4 className="head_modal">
                    {editingPartner
                      ? "Edit Professional"
                      : "Add New Professional"}
                  </h4>
                  <p className="sub_head">Enter the details and save</p>
                </div>

                <div>
                  <div className="input_field">
                    <label htmlFor="companyName">Company Name *</label>
                    <div className="position-relative">
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="Enter Company Name"
                        className="form-control"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="input_field">
                    <label htmlFor="email">Email *</label>
                    <div className="position-relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="input_field">
                    <label htmlFor="contactPerson">Contact Person</label>
                    <div className="position-relative">
                      <input
                        id="contactPerson"
                        name="contactPerson"
                        type="text"
                        placeholder="Enter Contact Person"
                        className="form-control"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="input_field">
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <div className="position-relative">
                      <input
                        id="mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        placeholder="Enter Mobile Number"
                        className="form-control"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="input_field">
                    <label htmlFor="speciality">Specialty *</label>
                    <div className="position-relative">
                      <input
                        id="speciality"
                        name="speciality"
                        type="text"
                        placeholder="Enter specialties (comma separated)"
                        className="form-control"
                        value={formData.speciality.join(", ")}
                        onChange={handleSpecialtyChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="input_field">
                    <label htmlFor="website">Website</label>
                    <div className="position-relative">
                      <input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="Enter Website URL"
                        className="form-control"
                        value={formData.website}
                        onChange={handleInputChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="input_field">
                    <label htmlFor="street">Street Address</label>
                    <div className="position-relative">
                      <input
                        id="street"
                        name="street"
                        type="text"
                        placeholder="Enter Street Address"
                        className="form-control"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="input_field">
                        <label htmlFor="city">City</label>
                        <div className="position-relative">
                          <input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Enter City"
                            className="form-control"
                            value={formData.address.city}
                            onChange={handleAddressChange}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input_field">
                        <label htmlFor="state">State</label>
                        <div className="position-relative">
                          <input
                            id="state"
                            name="state"
                            type="text"
                            placeholder="Enter State"
                            className="form-control"
                            value={formData.address.state}
                            onChange={handleAddressChange}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="input_field">
                        <label htmlFor="country">Country</label>
                        <div className="position-relative">
                          <input
                            id="country"
                            name="country"
                            type="text"
                            placeholder="Enter Country"
                            className="form-control"
                            value={formData.address.country}
                            onChange={handleAddressChange}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input_field">
                        <label htmlFor="zipCode">Zip Code</label>
                        <div className="position-relative">
                          <input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            placeholder="Enter Zip Code"
                            className="form-control"
                            value={formData.address.zipCode}
                            onChange={handleAddressChange}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="input_field">
                        <label>Upload Professional Photo *</label>
                        <div className="position-relative">
                          {!imagePreview ? (
                            // Upload area
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="border border-dashed border-secondary rounded p-4 text-center cursor-pointer"
                              style={{
                                minHeight: "120px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                            >
                              <div className="mb-2">
                                <i className="fas fa-cloud-upload-alt fa-2x text-warning"></i>
                              </div>
                              <small className="text-muted">
                                File should be .png, .jpg format.
                              </small>
                              <strong>Upload Professional Photo</strong>
                            </div>
                          ) : (
                            // Image preview
                            <div className="position-relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-100 rounded"
                                style={{ height: "120px", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                onClick={removeImage}
                                className="btn btn-sm btn-danger position-absolute"
                                style={{ top: "5px", right: "5px" }}
                              >
                                ×
                              </button>
                            </div>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn common_button mt-3"
                  >
                    {editingPartner ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
