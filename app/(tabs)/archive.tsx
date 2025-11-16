import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLinks } from '@/hooks/useLinks';
import LinkCard from '@/components/LinkCard';
import MemoModal from '@/components/MemoModal';
import { Link } from '@/types';

export default function ArchiveScreen() {
  const { archivedLinks, isLoading, loadLinks, unarchiveLink, updateLink } = useLinks();
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);

  const handleUnarchive = useCallback((linkId: string) => {
    unarchiveLink(linkId);
  }, [unarchiveLink]);

  const handleOpenMemo = useCallback((link: Link) => {
    setSelectedLink(link);
    setIsMemoModalVisible(true);
  }, []);

  const handleSaveMemo = useCallback((memo: string, tags: string[]) => {
    if (selectedLink) {
      updateLink(selectedLink.id, memo, tags);
    }
  }, [selectedLink, updateLink]);

  const renderItem = useCallback(({ item }: { item: Link }) => (
    <View style={styles.cardContainer}>
      <LinkCard link={item} onPress={() => handleOpenMemo(item)} />
      <TouchableOpacity
        style={styles.unarchiveButton}
        onPress={() => handleUnarchive(item.id)}
      >
        <Text style={styles.unarchiveButtonText}>복원</Text>
      </TouchableOpacity>
    </View>
  ), [handleUnarchive, handleOpenMemo]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>아카이브된 항목이 없습니다</Text>
      <Text style={styles.emptySubtext}>
        왼쪽으로 스와이프하면 아카이브됩니다
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>아카이브</Text>
        <Text style={styles.subtitle}>
          {archivedLinks.length}개의 아카이브된 링크
        </Text>
      </View>

      <FlatList
        data={archivedLinks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadLinks}
            tintColor="#6366f1"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <MemoModal
        visible={isMemoModalVisible}
        initialMemo={selectedLink?.memo || ''}
        initialTags={selectedLink?.tags || []}
        onClose={() => {
          setIsMemoModalVisible(false);
          setSelectedLink(null);
        }}
        onSave={handleSaveMemo}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  cardContainer: {
    position: 'relative',
  },
  unarchiveButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unarchiveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});
