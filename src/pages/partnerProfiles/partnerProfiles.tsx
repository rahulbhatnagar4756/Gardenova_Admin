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

interface PartnerProfilesProps {
  limit?: number;
}

// Extended PartnerProfile type for UI with index-based ID
interface PartnerProfileWithId extends PartnerProfileResponse {
  [key: string]: unknown; // <-- This makes it satisfy Record<string, unknown>
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] =
    useState<PartnerProfileResponse | null>(null);

  const partnersWithId: PartnerProfileWithId[] = partners.map((p, index) => ({
    ...p,
    id: index.toString(),
  }));

  const renderOptionsAsList = (options: string[]) => {
    if (!options || options.length === 0) {
      return <span className="no-options">No options</span>;
    }

    return (
      <div className="options-list">
        {options.map((option, index) => (
          <div key={index} className="option-item">
            <span className="option-number">{index + 1}.</span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: "__index",
      label: "Q.No. ",
      className: "partner-column",
    },
    {
      key: "profileImage",
      label: "Profile Image",
      render: (_value: unknown, item: PartnerProfileWithId) => {
        if (item.profileImage) {
          return (
            <img
              src={item.profileImage} // base64 string from backend
              alt={item.companyName}
              className="profile-image"
            />
          );
        } else {
          return <span className="no-image">No image</span>;
        }
      },

      className: "image-column",
    },
    {
      key: "companyName",
      label: "Company Name",
      className: "company-column",
    },
    {
      key: "email",
      label: "Email",
      className: "email-column",
    },
    {
      key: "speciality",
      label: "Specialties",
      render: (_value: unknown, item: PartnerProfileWithId) =>
        renderOptionsAsList(item.speciality || []),
      className: "options-column",
    },
    {
      key: "status",
      label: "Status",
      className: "status-column",
    },
    {
      key: "contactPerson",
      label: "Contact Person",
      className: "contact-column",
    },
    {
      key: "mobileNumber",
      label: "Phone",
      className: "phone-column",
    },
  ];

  const handleEdit = (partner: PartnerProfileResponse) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        await deletePartner(id);
      } catch (err) {
        console.error("Failed to delete partner:", err);
        // You might want to show a toast notification here
      }
    }
  };

  const handleSubmit = async (data: PartnerProfileRequest) => {
    try {
      if (editingPartner) {
        await updatePartner(editingPartner._id, data);
      } else {
        await createPartner(data);
      }
      setIsModalOpen(false);
      setEditingPartner(null);
    } catch (err) {
      console.error("Failed to save partner:", err);
      // You might want to show a toast notification here
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: <Pencil size={16} />,
      onClick: handleEdit,
      className: "btn-secondary",
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      onClick: (item: PartnerProfileResponse) => handleDelete(item._id),
      className: "btn-danger",
    },
  ];

  const displayedPartners = limit
    ? partnersWithId.slice(0, limit)
    : partnersWithId;

  if (loading) return <div className="loading">Loading partners...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="partner-page">
      <div className="parnter-header">
        <h2>Partner Profiles</h2>
        {!limit && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add Partner
          </button>
        )}
      </div>

      <DataTable<PartnerProfileWithId>
        data={displayedPartners}
        columns={columns}
        actions={actions}
        emptyMessage="No partners available"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPartner(null);
        }}
        title={editingPartner ? "Edit Partner" : "Add Partner"}
      >
        <PartnerForm
          initialData={editingPartner || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingPartner(null);
          }}
        />
      </Modal>
    </div>
  );
};
