import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { useLinkStore } from '@/store/linkStore';
import { fetchLinkPreview } from '@/services/linkPreview';
import { createLink } from '@/services/firestore';
import { getCurrentUser } from '@/services/auth';

export default function RootLayout() {
  const { addLink } = useLinkStore();

  useEffect(() => {
    // Handle initial URL when app is opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for deep link events while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = async (url: string) => {
    try {
      const { queryParams } = Linking.parse(url);
      const sharedUrl = queryParams?.url as string;

      if (sharedUrl) {
        const user = getCurrentUser();
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        // Fetch link preview and create link
        const preview = await fetchLinkPreview(sharedUrl);
        const linkId = await createLink(user.uid, {
          url: preview.url,
          title: preview.title,
          description: preview.description,
          imageUrl: preview.imageUrl,
          siteName: preview.siteName,
        });

        // Add to local state
        addLink({
          id: linkId,
          userId: user.uid,
          ...preview,
          memo: null,
          tags: [],
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          archivedAt: null,
        });
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
