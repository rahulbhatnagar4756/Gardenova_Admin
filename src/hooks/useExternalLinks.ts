import { useEffect, useState } from "react";
import type { CreateExternalLinkRequest, ExternalLink, UpdateExternalLinkRequest } from "../types/externalLinks";
import { externalLinksService } from "../services/apiCalls/externalLinks";

/**
 * Custom hook for managing external links.
 *
 * Provides operations to fetch, create, update, and delete external links.
 *
 * @returns Object containing:
 *  - `links`: Array of external links
 *  - `loading`: Boolean indicating fetch state
 *  - `error`: Error message if any
 *  - `createLink`: Function to create a new link
 *  - `updateLink`: Function to update an existing link
 *  - `deleteLink`: Function to delete a link
 *  - `refetch`: Function to manually refetch links
 */
export const useExternalLinks = () => {
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all external links from the server.
   */
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await externalLinksService.getExternalLinks();
      if (res.success) setLinks(Object.values(res.data.links));
      else throw new Error("Failed to fetch links");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  /**
   * Create a new external link.
   *
   * @param data Payload for the new link
   * @returns API response
   */
  const createLink = async (data: CreateExternalLinkRequest) => {
    const res = await externalLinksService.createExternalLink(data);
    if (res.success) await fetchLinks();
    return res;
  };

  /**
   * Update an existing external link by ID.
   *
   * @param id The ID of the link to update
   * @param data Fields to update (excluding `id`)
   * @returns API response
   */
  const updateLink = async (
    id: string,
    data: Omit<UpdateExternalLinkRequest, "id">
  ) => {
      const res = await externalLinksService.updateExternalLink({
        id,
        ...data,
      });

      if (res.success) await fetchLinks();

      return res;
   
     
    
  };
  /**
   * Delete an external link by ID.
   *
   * @param id The ID of the link to delete
   * @returns API response
   */
  const deleteLink = async (id: string) => {
    const res = await externalLinksService.deleteExternalLink(id);
    if (res.success) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
    return res;
  };

  return {
    links,
    loading,
    error,
    createLink,
    updateLink,
    deleteLink,
    refetch: fetchLinks,
  };
};
