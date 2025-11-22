import 'dotenv/config';

export default {
  expo: {
    name: 'StackNScroll',
    slug: 'stacknscroll',
    version: '0.1.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      backgroundColor: '#6366f1',
      resizeMode: 'contain',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.stacknscroll.app',
    },
    android: {
      package: 'com.stacknscroll.app',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#6366f1',
      },
    },
    web: {
      bundler: 'metro',
    },
    scheme: 'stacknscroll',
    plugins: ['expo-router'],
    extra: {
      eas: {
        projectId: '3ff2f9c8-d3af-4b93-97f7-f0737f555492',
      },
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
  },
};
