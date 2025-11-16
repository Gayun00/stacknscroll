import { useEffect } from 'react';
import { useLinkStore } from '@/store/linkStore';
import { getUserLinks, getArchivedLinks, updateLink as updateLinkInFirestore } from '@/services/firestore';
import { getCurrentUser } from '@/services/auth';

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
      const user = getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const [userLinks, userArchivedLinks] = await Promise.all([
        getUserLinks(user.uid),
        getArchivedLinks(user.uid),
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
      await updateLinkInFirestore(linkId, { isArchived: true });
      archiveLink(linkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive link');
    }
  };

  const handleUnarchiveLink = async (linkId: string) => {
    try {
      await updateLinkInFirestore(linkId, { isArchived: false });
      unarchiveLink(linkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unarchive link');
    }
  };

  const handleUpdateLink = async (linkId: string, memo: string, tags: string[]) => {
    try {
      await updateLinkInFirestore(linkId, { memo, tags });
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
