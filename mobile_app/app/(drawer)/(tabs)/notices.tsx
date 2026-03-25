import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useNotices } from '../../../src/hooks/useNotices';
import { useAnnouncements } from '../../../src/hooks/useAnnouncements';
import { useTheme } from '../../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { Notice, Announcement } from '../../../src/types';

type Tab = 'notices' | 'announcements';

export default function NoticesScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { permissions, profile } = useUser();
  const { notices, loading: noticesLoading, removeNotice } = useNotices();
  const { announcements, loading: announcementsLoading, removeAnnouncement } = useAnnouncements();
  const [activeTab, setActiveTab] = useState<Tab>('notices');

  const handleDeleteNotice = (id: string) => {
    Alert.alert('Delete Notice', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeNotice(id) },
    ]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    Alert.alert('Delete Announcement', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeAnnouncement(id) },
    ]);
  };

  const renderNotice = ({ item }: { item: Notice }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                item.type === 'urgent' ? colors.dangerLight : colors.infoLight,
            },
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              { color: item.type === 'urgent' ? colors.danger : colors.info },
            ]}
          >
            {item.type?.toUpperCase() ?? 'GENERAL'}
          </Text>
        </View>
        {item.created_by === profile?.id && (
          <TouchableOpacity onPress={() => handleDeleteNotice(item.id)}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMessage} numberOfLines={3}>{item.message}</Text>
      {item.class_name && (
        <View style={styles.cardMeta}>
          <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.cardMetaText}>{item.class_name}</Text>
        </View>
      )}
      <Text style={styles.cardDate}>
        {new Date(item.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
    </View>
  );

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor:
                item.priority === 'urgent'
                  ? colors.dangerLight
                  : item.priority === 'high'
                  ? colors.warningLight
                  : colors.infoLight,
            },
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              {
                color:
                  item.priority === 'urgent'
                    ? colors.danger
                    : item.priority === 'high'
                    ? colors.warning
                    : colors.info,
              },
            ]}
          >
            {item.priority?.toUpperCase() ?? 'NORMAL'}
          </Text>
        </View>
        {item.created_by === profile?.id && (
          <TouchableOpacity onPress={() => handleDeleteAnnouncement(item.id)}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMessage} numberOfLines={3}>{item.message}</Text>
      {item.creator_name && (
        <View style={styles.cardMeta}>
          <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.cardMetaText}>By {item.creator_name}</Text>
        </View>
      )}
      <Text style={styles.cardDate}>
        {new Date(item.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notices' && styles.tabActive]}
          onPress={() => setActiveTab('notices')}
        >
          <Ionicons name="megaphone" size={18} color={activeTab === 'notices' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'notices' && styles.tabTextActive]}>
            Notices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'announcements' && styles.tabActive]}
          onPress={() => setActiveTab('announcements')}
        >
          <Ionicons name="chatbubbles" size={18} color={activeTab === 'announcements' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'announcements' && styles.tabTextActive]}>
            Announcements
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'notices' ? (
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          renderItem={renderNotice}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="megaphone-outline" size={50} color={colors.textLight} />
              <Text style={styles.emptyText}>No notices yet</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          renderItem={renderAnnouncement}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={50} color={colors.textLight} />
              <Text style={styles.emptyText}>No announcements yet</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      {((activeTab === 'notices' && permissions.canPublishNotice) ||
        (activeTab === 'announcements' && permissions.canPublishAnnouncement)) && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            router.push(activeTab === 'notices' ? '/create-notice' : '/create-announcement')
          }
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textLight },
  tabTextActive: { color: colors.primary },
  list: { padding: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  priorityBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  typeBadgeText: { fontSize: fontSize.xs, fontWeight: '700' },
  cardTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  cardMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  cardMetaText: { fontSize: fontSize.xs, color: colors.textSecondary },
  cardDate: { fontSize: fontSize.xs, color: colors.textLight, marginTop: spacing.sm },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: colors.textLight, fontSize: fontSize.md, marginTop: spacing.md },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
