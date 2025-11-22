import { LinkPreview } from '@/types';

/**
 * Extract basic link preview from URL
 * For a simple local version, we'll just extract domain and use URL as title
 */
export const fetchLinkPreview = async (url: string): Promise<LinkPreview & { url: string }> => {
  try {
    // Ensure URL has protocol
    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    // Parse URL
    const urlObj = new URL(validUrl);
    const domain = urlObj.hostname.replace('www.', '');

    // Extract basic info
    return {
      url: validUrl,
      title: domain,
      description: validUrl,
      imageUrl: '', // No image for simple version
      siteName: domain,
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    throw new Error('Invalid URL format');
  }
};
