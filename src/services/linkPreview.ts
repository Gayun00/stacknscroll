import { LinkPreview } from '@/types';

/**
 * Fetch link preview with Open Graph metadata
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

    // Fetch HTML
    const response = await fetch(validUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StackNScroll/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extract Open Graph metadata
    const title = extractMetaTag(html, 'og:title') ||
                  extractMetaTag(html, 'twitter:title') ||
                  extractTitle(html) ||
                  domain;

    const description = extractMetaTag(html, 'og:description') ||
                        extractMetaTag(html, 'twitter:description') ||
                        extractMetaTag(html, 'description') ||
                        '';

    const imageUrl = extractMetaTag(html, 'og:image') ||
                     extractMetaTag(html, 'twitter:image') ||
                     '';

    const siteName = extractMetaTag(html, 'og:site_name') || domain;

    return {
      url: validUrl,
      title,
      description,
      imageUrl,
      siteName,
    };
  } catch (error) {
    console.error('Error fetching link preview:', error);

    // Fallback to basic info
    const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
    const domain = urlObj.hostname.replace('www.', '');

    return {
      url: url.startsWith('http') ? url : 'https://' + url,
      title: domain,
      description: url,
      imageUrl: '',
      siteName: domain,
    };
  }
};

/**
 * Extract meta tag content from HTML
 */
function extractMetaTag(html: string, property: string): string {
  // Try Open Graph format
  const ogRegex = new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const ogMatch = html.match(ogRegex);
  if (ogMatch) return ogMatch[1];

  // Try Twitter format
  const twitterRegex = new RegExp(`<meta[^>]*name=["']twitter:${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const twitterMatch = html.match(twitterRegex);
  if (twitterMatch) return twitterMatch[1];

  // Try standard format
  const nameRegex = new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const nameMatch = html.match(nameRegex);
  if (nameMatch) return nameMatch[1];

  // Try reverse order (content before property/name)
  const reverseRegex = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["'](?:og:|twitter:)?${property}["']`, 'i');
  const reverseMatch = html.match(reverseRegex);
  if (reverseMatch) return reverseMatch[1];

  return '';
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string {
  const titleRegex = /<title[^>]*>([^<]*)<\/title>/i;
  const match = html.match(titleRegex);
  return match ? match[1].trim() : '';
}
