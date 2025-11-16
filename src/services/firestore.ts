import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Link, CreateLinkInput, UpdateLinkInput } from '@/types';

const LINKS_COLLECTION = 'links';

/**
 * Convert Firestore Timestamp to Date
 */
const timestampToDate = (timestamp: Timestamp | null): Date | null => {
  return timestamp ? timestamp.toDate() : null;
};

/**
 * Create a new link
 */
export const createLink = async (
  userId: string,
  input: CreateLinkInput & { title: string; description: string; imageUrl: string; siteName: string }
): Promise<string> => {
  const linkData = {
    userId,
    url: input.url,
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl,
    siteName: input.siteName,
    memo: null,
    tags: [],
    isArchived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    archivedAt: null,
  };

  const docRef = await addDoc(collection(db, LINKS_COLLECTION), linkData);
  return docRef.id;
};

/**
 * Update a link
 */
export const updateLink = async (linkId: string, updates: UpdateLinkInput): Promise<void> => {
  const linkRef = doc(db, LINKS_COLLECTION, linkId);
  await updateDoc(linkRef, {
    ...updates,
    updatedAt: serverTimestamp(),
    ...(updates.isArchived !== undefined && {
      archivedAt: updates.isArchived ? serverTimestamp() : null,
    }),
  });
};

/**
 * Delete a link
 */
export const deleteLink = async (linkId: string): Promise<void> => {
  const linkRef = doc(db, LINKS_COLLECTION, linkId);
  await deleteDoc(linkRef);
};

/**
 * Get a single link by ID
 */
export const getLink = async (linkId: string): Promise<Link | null> => {
  const linkRef = doc(db, LINKS_COLLECTION, linkId);
  const linkSnap = await getDoc(linkRef);

  if (!linkSnap.exists()) {
    return null;
  }

  const data = linkSnap.data();
  return {
    id: linkSnap.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    archivedAt: timestampToDate(data.archivedAt),
  } as Link;
};

/**
 * Get all links for a user
 */
export const getUserLinks = async (userId: string, includeArchived = false): Promise<Link[]> => {
  const linksRef = collection(db, LINKS_COLLECTION);
  let q = query(
    linksRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  if (!includeArchived) {
    q = query(q, where('isArchived', '==', false));
  }

  const querySnapshot = await getDocs(q);
  const links: Link[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    links.push({
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      archivedAt: timestampToDate(data.archivedAt),
    } as Link);
  });

  return links;
};

/**
 * Get archived links for a user
 */
export const getArchivedLinks = async (userId: string): Promise<Link[]> => {
  const linksRef = collection(db, LINKS_COLLECTION);
  const q = query(
    linksRef,
    where('userId', '==', userId),
    where('isArchived', '==', true),
    orderBy('archivedAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const links: Link[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    links.push({
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      archivedAt: timestampToDate(data.archivedAt),
    } as Link);
  });

  return links;
};

/**
 * Get links by tag
 */
export const getLinksByTag = async (userId: string, tag: string): Promise<Link[]> => {
  const linksRef = collection(db, LINKS_COLLECTION);
  const q = query(
    linksRef,
    where('userId', '==', userId),
    where('tags', 'array-contains', tag),
    where('isArchived', '==', false),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const links: Link[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    links.push({
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      archivedAt: timestampToDate(data.archivedAt),
    } as Link);
  });

  return links;
};
