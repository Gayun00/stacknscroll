import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '피드',
          tabBarIcon: ({ color }) => null, // TODO: Add icon
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: '아카이브',
          tabBarIcon: ({ color }) => null, // TODO: Add icon
        }}
      />
    </Tabs>
  );
}
