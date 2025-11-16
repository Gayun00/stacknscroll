import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { unfurl } from 'unfurl.js';
import * as cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// CORS configuration
const corsHandler = cors({ origin: true });

interface LinkPreview {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
}

/**
 * Fetch link preview using Open Graph data
 */
export const fetchLinkPreview = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { url } = req.body;

      if (!url) {
        res.status(400).json({ error: 'URL is required' });
        return;
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (error) {
        res.status(400).json({ error: 'Invalid URL format' });
        return;
      }

      // Fetch metadata using unfurl
      const metadata = await unfurl(url);

      const preview: LinkPreview = {
        url,
        title: metadata.title || metadata.open_graph?.title || 'No title',
        description: metadata.description || metadata.open_graph?.description || '',
        imageUrl: metadata.open_graph?.images?.[0]?.url || metadata.favicon || '',
        siteName: metadata.open_graph?.site_name || new URL(url).hostname,
      };

      res.status(200).json(preview);
    } catch (error) {
      console.error('Error fetching link preview:', error);
      res.status(500).json({
        error: 'Failed to fetch link preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
});

/**
 * Callable function for fetching link preview
 * (Alternative to HTTP function, better for Firebase client SDK)
 */
export const getLinkPreview = functions.https.onCall(async (data, context) => {
  try {
    const { url } = data;

    if (!url) {
      throw new functions.https.HttpsError('invalid-argument', 'URL is required');
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid URL format');
    }

    // Fetch metadata using unfurl
    const metadata = await unfurl(url);

    const preview: LinkPreview = {
      url,
      title: metadata.title || metadata.open_graph?.title || 'No title',
      description: metadata.description || metadata.open_graph?.description || '',
      imageUrl: metadata.open_graph?.images?.[0]?.url || metadata.favicon || '',
      siteName: metadata.open_graph?.site_name || new URL(url).hostname,
    };

    return preview;
  } catch (error) {
    console.error('Error fetching link preview:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to fetch link preview',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});
