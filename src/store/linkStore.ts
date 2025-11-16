import { create } from 'zustand';
import { Link } from '@/types';

interface LinkState {
  links: Link[];
  archivedLinks: Link[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setLinks: (links: Link[]) => void;
  setArchivedLinks: (links: Link[]) => void;
  addLink: (link: Link) => void;
  updateLink: (linkId: string, updates: Partial<Link>) => void;
  deleteLink: (linkId: string) => void;
  archiveLink: (linkId: string) => void;
  unarchiveLink: (linkId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLinkStore = create<LinkState>((set) => ({
  links: [],
  archivedLinks: [],
  isLoading: false,
  error: null,

  setLinks: (links) => set({ links }),

  setArchivedLinks: (links) => set({ archivedLinks: links }),

  addLink: (link) =>
    set((state) => ({
      links: [link, ...state.links],
    })),

  updateLink: (linkId, updates) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      ),
      archivedLinks: state.archivedLinks.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      ),
    })),

  deleteLink: (linkId) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== linkId),
      archivedLinks: state.archivedLinks.filter((link) => link.id !== linkId),
    })),

  archiveLink: (linkId) =>
    set((state) => {
      const linkToArchive = state.links.find((link) => link.id === linkId);
      if (!linkToArchive) return state;

      const archivedLink = {
        ...linkToArchive,
        isArchived: true,
        archivedAt: new Date(),
      };

      return {
        links: state.links.filter((link) => link.id !== linkId),
        archivedLinks: [archivedLink, ...state.archivedLinks],
      };
    }),

  unarchiveLink: (linkId) =>
    set((state) => {
      const linkToUnarchive = state.archivedLinks.find((link) => link.id === linkId);
      if (!linkToUnarchive) return state;

      const unarchivedLink = {
        ...linkToUnarchive,
        isArchived: false,
        archivedAt: null,
      };

      return {
        archivedLinks: state.archivedLinks.filter((link) => link.id !== linkId),
        links: [unarchivedLink, ...state.links],
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
