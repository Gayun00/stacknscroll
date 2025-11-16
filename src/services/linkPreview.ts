import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { LinkPreview } from '@/types';

/**
 * Fetch link preview from Cloud Function
 */
export const fetchLinkPreview = async (url: string): Promise<LinkPreview> => {
  try {
    const getLinkPreview = httpsCallable<{ url: string }, LinkPreview>(
      functions,
      'getLinkPreview'
    );

    const result = await getLinkPreview({ url });
    return result.data;
  } catch (error) {
    console.error('Error fetching link preview:', error);
    throw new Error('Failed to fetch link preview');
  }
};
