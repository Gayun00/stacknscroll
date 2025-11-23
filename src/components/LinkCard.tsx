import { View, Text, Image, StyleSheet, Pressable, Linking } from 'react-native';
import { Link } from '@/types';

interface LinkCardProps {
  link: Link;
  onPress?: () => void;
  onMemo?: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
}

export default function LinkCard({ link, onPress, onMemo, onArchive, onUnarchive }: LinkCardProps) {
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
          <Text style={styles.description} numberOfLines={3}>
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

        {(onMemo || onArchive || onUnarchive) && (
          <View style={styles.buttonRow}>
            {onMemo && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onMemo();
                }}
                style={({ pressed }) => [
                  styles.button,
                  styles.memoButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.memoButtonText}>메모</Text>
              </Pressable>
            )}
            {onArchive && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onArchive();
                }}
                style={({ pressed }) => [
                  styles.button,
                  styles.archiveButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.archiveButtonText}>아카이브</Text>
              </Pressable>
            )}
            {onUnarchive && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onUnarchive();
                }}
                style={({ pressed }) => [
                  styles.button,
                  styles.unarchiveButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.unarchiveButtonText}>복원</Text>
              </Pressable>
            )}
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
    height: 220,
    backgroundColor: '#f3f4f6',
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
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 22,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  memoButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  memoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  archiveButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  archiveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  unarchiveButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  unarchiveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
});
