import { useState } from "react";
import "./partnerForm.css";
import type {
  PartnerProfileResponse,
  PartnerProfileRequest,
  PartnerAddress,
  PartnerProfileStatus,
} from "../../services/apiCalls/partnerProfile";

interface PartnerFormProps {
  initialData?: PartnerProfileResponse;
  onSubmit: (data: PartnerProfileRequest) => void;
  onCancel: () => void;
}

export const PartnerForm = ({
  initialData,
  onSubmit,
  onCancel,
}: PartnerFormProps) => {
  const [formData, setFormData] = useState<PartnerProfileRequest>({
    email: initialData?.email || "",
    mobileNumber: initialData?.mobileNumber || "",
    companyName: initialData?.companyName || "",
    speciality: initialData?.speciality || [],
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      country: initialData?.address?.country || "",
      zipCode: initialData?.address?.zipCode || "",
    },
    website: initialData?.website || "",
    contactPerson: initialData?.contactPerson || "",
    profileImage: initialData?.profileImage || "",
    status: initialData?.status || "active",
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    initialData?.speciality || []
  );

  const specialtyOptions = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "General Medicine",
    "Psychiatry",
    "Surgery",
    "Oncology",
    "Radiology",
    "Anesthesiology",
    "Emergency Medicine",
  ];

  const handleSpecialtyChange = (specialty: string) => {
    const updatedSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];

    setSelectedSpecialties(updatedSpecialties);
    setFormData({ ...formData, speciality: updatedSpecialties });
  };

  const handleAddressChange = (field: keyof PartnerAddress, value: string) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="partner-form">
      <div className="partner-form-row">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            value={formData.mobileNumber || ""}
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
            className="form-control"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            value={formData.companyName || ""}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactPerson">Contact Person</label>
          <input
            type="text"
            id="contactPerson"
            value={formData.contactPerson || ""}
            onChange={(e) =>
              setFormData({ ...formData, contactPerson: e.target.value })
            }
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Specialties</label>
        <div className="specialty-grid">
          {specialtyOptions.map((specialty) => (
            <label key={specialty} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
                className="checkbox-input"
              />
              <span className="checkbox-text">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="website">Website</label>
        <input
          type="url"
          id="website"
          value={formData.website || ""}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
          className="form-control"
          placeholder="https://example.com"
        />
      </div>

      <div className="address-section">
        <h3>Address Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              value={formData.address?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={formData.address?.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={formData.address?.state || ""}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              value={formData.address?.country || ""}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={formData.address?.zipCode || ""}
              onChange={(e) => handleAddressChange("zipCode", e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status || "active"}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as PartnerProfileStatus,
              })
            }
            className="form-control"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image URL</label>
          <input
            type="url"
            id="profileImage"
            value={formData.profileImage || ""}
            onChange={(e) =>
              setFormData({ ...formData, profileImage: e.target.value })
            }
            className="form-control"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="partner-form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update" : "Create"} Partner
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};
