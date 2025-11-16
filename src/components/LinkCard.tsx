import { View, Text, Image, StyleSheet, Pressable, Linking } from 'react-native';
import { Link } from '@/types';

interface LinkCardProps {
  link: Link;
  onPress?: () => void;
}

export default function LinkCard({ link, onPress }: LinkCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Linking.openURL(link.url);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      {link.imageUrl && (
        <Image
          source={{ uri: link.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        {link.memo && (
          <View style={styles.memoContainer}>
            <Text style={styles.memoText}>{link.memo}</Text>
          </View>
        )}

        <Text style={styles.title} numberOfLines={2}>
          {link.title}
        </Text>

        {link.description && (
          <Text style={styles.description} numberOfLines={2}>
            {link.description}
          </Text>
        )}

        {link.siteName && (
          <Text style={styles.siteName}>{link.siteName}</Text>
        )}

        {link.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {link.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  memoContainer: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  memoText: {
    fontSize: 14,
    color: '#059669',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  siteName: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '500',
  },
});
