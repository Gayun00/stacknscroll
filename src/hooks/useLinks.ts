import { useEffect } from 'react';
import { useLinkStore } from '@/store/linkStore';
import {
  getLinks,
  getArchivedLinks,
  updateLink as updateLinkInStorage,
  archiveLink as archiveLinkInStorage,
  unarchiveLink as unarchiveLinkInStorage,
} from '@/services/storage';

export function useLinks() {
  const {
    links,
    archivedLinks,
    isLoading,
    error,
    setLinks,
    setArchivedLinks,
    archiveLink,
    unarchiveLink,
    updateLink,
    setLoading,
    setError,
  } = useLinkStore();

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);

      const [userLinks, userArchivedLinks] = await Promise.all([
        getLinks(),
        getArchivedLinks(),
      ]);

      setLinks(userLinks);
      setArchivedLinks(userArchivedLinks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveLink = async (linkId: string) => {
    try {
      await archiveLinkInStorage(linkId);
      archiveLink(linkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive link');
    }
  };

  const handleUnarchiveLink = async (linkId: string) => {
    try {
      await unarchiveLinkInStorage(linkId);
      unarchiveLink(linkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unarchive link');
    }
  };

  const handleUpdateLink = async (linkId: string, memo: string, tags: string[]) => {
    try {
      await updateLinkInStorage(linkId, { memo, tags });
      updateLink(linkId, { memo, tags });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update link');
    }
  };

  return {
    links,
    archivedLinks,
    isLoading,
    error,
    loadLinks,
    archiveLink: handleArchiveLink,
    unarchiveLink: handleUnarchiveLink,
    updateLink: handleUpdateLink,
  };
}
