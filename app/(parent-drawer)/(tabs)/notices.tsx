import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotices } from '../../../src/hooks/useNotices';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { Notice, NoticeType } from '../../../src/types';

const TYPE_CONFIG: Record<NoticeType, { icon: string; color: string; bg: string; label: string }> = {
  general: { icon: 'information-circle', color: colors.info, bg: colors.infoLight, label: 'General' },
  urgent: { icon: 'alert-circle', color: colors.danger, bg: colors.dangerLight, label: 'Urgent' },
  event: { icon: 'calendar', color: colors.purple, bg: colors.purpleLight, label: 'Event' },
  holiday: { icon: 'sunny', color: colors.warning, bg: colors.warningLight, label: 'Holiday' },
  exam: { icon: 'school', color: colors.primary, bg: colors.primaryLight, label: 'Exam' },
};

export default function ParentNoticesScreen() {
  const { notices, loading } = useNotices();

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading notices...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Ionicons name="megaphone" size={24} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.headerTitle}>Notices & Circulars</Text>
          <Text style={styles.headerSub}>Notices sent to your child's class</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{notices.length}</Text>
        </View>
      </View>

      {notices.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="megaphone-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No Notices</Text>
          <Text style={styles.emptySubText}>There are no notices at the moment</Text>
        </View>
      ) : (
        notices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  const config = TYPE_CONFIG[notice.type] || TYPE_CONFIG.general;
  const createdAt = new Date(notice.created_at);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${months[createdAt.getMonth()]} ${createdAt.getDate()}, ${createdAt.getFullYear()}`;

  return (
    <View style={styles.noticeCard}>
      <View style={styles.noticeTop}>
        <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon as any} size={14} color={config.color} />
          <Text style={[styles.typeBadgeText, { color: config.color }]}>{config.label}</Text>
        </View>
        <Text style={styles.noticeDate}>{dateStr}</Text>
      </View>
      <Text style={styles.noticeTitle}>{notice.title}</Text>
      {notice.message ? (
        <Text style={styles.noticeMessage} numberOfLines={4}>{notice.message}</Text>
      ) : null}
      <View style={styles.noticeFooter}>
        {notice.class_name ? (
          <View style={styles.classTag}>
            <Ionicons name="school-outline" size={12} color={colors.textLight} />
            <Text style={styles.classTagText}>{notice.class_name}</Text>
          </View>
        ) : null}
        {notice.creator_name ? (
          <View style={styles.classTag}>
            <Ionicons name="person-outline" size={12} color={colors.textLight} />
            <Text style={styles.classTagText}>By {notice.creator_name}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: fontSize.md, color: colors.textSecondary },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.primary,
  },

  noticeCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  noticeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  noticeDate: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  noticeTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  noticeMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  noticeFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  classTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classTagText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },

  emptyCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    borderRadius: borderRadius.lg,
    padding: spacing.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});

