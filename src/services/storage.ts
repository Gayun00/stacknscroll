import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from '@/types';

const LINKS_KEY = '@stacknscroll_links';
const ARCHIVED_LINKS_KEY = '@stacknscroll_archived_links';

// 링크 가져오기
export async function getLinks(): Promise<Link[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(LINKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load links:', e);
    return [];
  }
}

// 보관된 링크 가져오기
export async function getArchivedLinks(): Promise<Link[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(ARCHIVED_LINKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load archived links:', e);
    return [];
  }
}

// 링크 저장
export async function saveLinks(links: Link[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(links);
    await AsyncStorage.setItem(LINKS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save links:', e);
    throw e;
  }
}

// 보관된 링크 저장
export async function saveArchivedLinks(links: Link[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(links);
    await AsyncStorage.setItem(ARCHIVED_LINKS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save archived links:', e);
    throw e;
  }
}

// 새 링크 추가
export async function addLink(url: string, preview: { title: string; description: string; imageUrl: string; siteName: string }): Promise<Link> {
  const links = await getLinks();

  const newLink: Link = {
    id: Date.now().toString(),
    userId: 'local-user', // 로컬 스토리지이므로 단일 사용자
    url,
    title: preview.title,
    description: preview.description,
    imageUrl: preview.imageUrl,
    siteName: preview.siteName,
    memo: null,
    tags: [],
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
  };

  const updatedLinks = [newLink, ...links];
  await saveLinks(updatedLinks);
  return newLink;
}

// 링크 업데이트
export async function updateLink(linkId: string, updates: Partial<Link>): Promise<void> {
  const [links, archivedLinks] = await Promise.all([getLinks(), getArchivedLinks()]);

  const linkIndex = links.findIndex(l => l.id === linkId);
  const archivedIndex = archivedLinks.findIndex(l => l.id === linkId);

  if (linkIndex !== -1) {
    links[linkIndex] = { ...links[linkIndex], ...updates, updatedAt: new Date() };
    await saveLinks(links);
  } else if (archivedIndex !== -1) {
    archivedLinks[archivedIndex] = { ...archivedLinks[archivedIndex], ...updates, updatedAt: new Date() };
    await saveArchivedLinks(archivedLinks);
  }
}

// 링크 보관
export async function archiveLink(linkId: string): Promise<void> {
  const [links, archivedLinks] = await Promise.all([getLinks(), getArchivedLinks()]);

  const linkToArchive = links.find(l => l.id === linkId);
  if (!linkToArchive) return;

  const archived: Link = {
    ...linkToArchive,
    isArchived: true,
    archivedAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedLinks = links.filter(l => l.id !== linkId);
  const updatedArchived = [archived, ...archivedLinks];

  await Promise.all([
    saveLinks(updatedLinks),
    saveArchivedLinks(updatedArchived),
  ]);
}

// 링크 보관 해제
export async function unarchiveLink(linkId: string): Promise<void> {
  const [links, archivedLinks] = await Promise.all([getLinks(), getArchivedLinks()]);

  const linkToUnarchive = archivedLinks.find(l => l.id === linkId);
  if (!linkToUnarchive) return;

  const unarchived: Link = {
    ...linkToUnarchive,
    isArchived: false,
    archivedAt: null,
    updatedAt: new Date(),
  };

  const updatedArchived = archivedLinks.filter(l => l.id !== linkId);
  const updatedLinks = [unarchived, ...links];

  await Promise.all([
    saveLinks(updatedLinks),
    saveArchivedLinks(updatedArchived),
  ]);
}

// 링크 삭제
export async function deleteLink(linkId: string): Promise<void> {
  const [links, archivedLinks] = await Promise.all([getLinks(), getArchivedLinks()]);

  const updatedLinks = links.filter(l => l.id !== linkId);
  const updatedArchived = archivedLinks.filter(l => l.id !== linkId);

  await Promise.all([
    saveLinks(updatedLinks),
    saveArchivedLinks(updatedArchived),
  ]);
}
