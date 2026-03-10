import { useEffect, useState } from "react";
import { useExternalLinks } from "../../hooks/useExternalLinks";
import { useToast } from "../../hooks/useToast";
import PageHeader from "../../components/externalLinks/pageHeader";
import ConfirmModal from "../../components/confirmModal";
import ExternalLinksList from "../../components/externalLinks/ExternalLinksList";
import ExternalLinkModal from "../../components/externalLinks/ExternalLinkModal";  
import { Loader } from "../../components/loader";
import type { CreateExternalLinkRequest, ExternalLink } from "../../types/externalLinks";
import "./externalLinks.css";

/**
 * ExternalLinks Page
 *
 * Manages the external links:
 * - Displays all links
 * - Add/Edit/Delete links
 * - Toggle link status (active/inactive)
 *
 * @returns {JSX.Element} The rendered external links page
 */
export const ExternalLinks = () => {
  const {
    links,
    loading,
    error,
    createLink,
    updateLink,
    deleteLink,
  } = useExternalLinks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ExternalLink | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  
  /**
   * Toggle the active status of a link.
   *
   * @param {string} id  ID of the external link
   * @param {boolean} is_active  New active status
   */
  const handleToggleStatus = async (id: string, is_active: boolean) => {
  try {
    await updateLink(id, { is_active });
    showSuccess(`Link ${is_active ? "activated" : "deactivated"} successfully`);
  } catch {
    showError("Failed to update link status");
  }
};

  useEffect(() => {
    if (error) showError(error);
  }, [error, showError]);

  /**
   * Open modal to add a new link
   */
  const handleAdd = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal to edit an existing link
   *
   * @param {ExternalLink} link  Link to edit
   */
  const handleEdit = (link: ExternalLink) => {
    setEditingLink({ ...link });
    setIsModalOpen(true);
  };
  /**
   * Save external link (create or update).
   *
   * @param data                 External link data from modal
   * @param data.title           Title of the external link
   * @param data.url             URL of the external link
   * @param data.is_active       Whether the link is active
   * @returns {Promise<void>}    Resolves when the operation completes
   */
const handleSave = async (data: { title: string; url: string; is_active: boolean }) => {
  try {
    if (editingLink) {
      // Update existing link
      await updateLink(editingLink.id, data);
      showSuccess("Link updated successfully");
    } else {
      // Create new link
      const createData: CreateExternalLinkRequest = {
        title: data.title || "",
        url: data.url,
        is_active: data.is_active ?? true,
      };
      await createLink(createData);
      showSuccess("Link created successfully");
    }

    setIsModalOpen(false);
    setEditingLink(null);
  } catch {
    showError("Failed to save external link");
  }
};
  /**
   * Delete an external link
   */
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLink(deleteId);
      showSuccess("Link deleted successfully");
    } catch {
      showError("Failed to delete external link");
    }
    setDeleteId(null);
  };

  if (loading) return <Loader text="Loading external links..." />;

  return (
    <>
      <div className="main_page">
        <PageHeader onAddClick={handleAdd} />

        <ExternalLinksList
          links={links}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <ExternalLinkModal
        isOpen={isModalOpen}
        editingLink={editingLink}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        open={!!deleteId}
        title="Delete External Link?"
        message="Are you sure you want to delete this external link?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};

