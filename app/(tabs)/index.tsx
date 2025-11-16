import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLinks } from '@/hooks/useLinks';
import SwipeableCard from '@/components/SwipeableCard';
import LinkCard from '@/components/LinkCard';
import MemoModal from '@/components/MemoModal';
import { Link } from '@/types';

export default function FeedScreen() {
  const { links, isLoading, error, loadLinks, archiveLink, updateLink } = useLinks();
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);

  const handleSwipeLeft = useCallback((linkId: string) => {
    archiveLink(linkId);
  }, [archiveLink]);

  const handleSwipeRight = useCallback((link: Link) => {
    setSelectedLink(link);
    setIsMemoModalVisible(true);
  }, []);

  const handleSaveMemo = useCallback((memo: string, tags: string[]) => {
    if (selectedLink) {
      updateLink(selectedLink.id, memo, tags);
    }
  }, [selectedLink, updateLink]);

  const renderItem = useCallback(({ item }: { item: Link }) => (
    <SwipeableCard
      onSwipeLeft={() => handleSwipeLeft(item.id)}
      onSwipeRight={() => handleSwipeRight(item)}
    >
      <LinkCard link={item} />
    </SwipeableCard>
  ), [handleSwipeLeft, handleSwipeRight]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>저장된 링크가 없습니다</Text>
      <Text style={styles.emptySubtext}>
        브라우저에서 공유하기로 링크를 저장해보세요
      </Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>오류가 발생했습니다</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>StackNScroll</Text>
        <Text style={styles.subtitle}>
          나중에 보려고 저장했지만 잊어버린 것들
        </Text>
      </View>

      <FlatList
        data={links}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
