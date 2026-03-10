import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomework } from '../../../src/hooks/useHomework';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { Homework } from '../../../src/types';

export default function ParentHomeworkScreen() {
  const { homework, loading } = useHomework(undefined, true);

  // Group homework by status (overdue, due soon, upcoming)
  const categorizedHomework = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue: Homework[] = [];
    const dueSoon: Homework[] = [];
    const upcoming: Homework[] = [];

    homework.forEach((hw) => {
      const dueDate = new Date(hw.due_date + 'T00:00:00');
      const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) overdue.push(hw);
      else if (daysLeft <= 2) dueSoon.push(hw);
      else upcoming.push(hw);
    });

    return { overdue, dueSoon, upcoming };
  };

  const { overdue, dueSoon, upcoming } = categorizedHomework();

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading homework...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Child Header */}
      <View style={styles.childHeader}>
        <View style={styles.childAvatar}>
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.childName}>Arjun Sharma</Text>
          <Text style={styles.childClass}>Class 10-A • Roll #12</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{homework.length}</Text>
          <Text style={styles.countLabel}>Total</Text>
        </View>
      </View>

      {homework.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="book-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No Homework</Text>
          <Text style={styles.emptySubText}>No homework has been assigned yet</Text>
        </View>
      ) : (
        <>
          {overdue.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: colors.danger }]} />
                <Text style={[styles.sectionTitle, { color: colors.danger }]}>Overdue ({overdue.length})</Text>
              </View>
              {overdue.map((hw) => <HomeworkItem key={hw.id} hw={hw} type="overdue" />)}
            </>
          )}

          {dueSoon.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: colors.warning }]} />
                <Text style={[styles.sectionTitle, { color: colors.warning }]}>Due Soon ({dueSoon.length})</Text>
              </View>
              {dueSoon.map((hw) => <HomeworkItem key={hw.id} hw={hw} type="dueSoon" />)}
            </>
          )}

          {upcoming.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: colors.purple }]} />
                <Text style={[styles.sectionTitle, { color: colors.purple }]}>Upcoming ({upcoming.length})</Text>
              </View>
              {upcoming.map((hw) => <HomeworkItem key={hw.id} hw={hw} type="upcoming" />)}
            </>
          )}
        </>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function HomeworkItem({ hw, type }: { hw: Homework; type: 'overdue' | 'dueSoon' | 'upcoming' }) {
  const dueDate = new Date(hw.due_date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dueDateStr = `${months[dueDate.getMonth()]} ${dueDate.getDate()}`;

  const accentColor = type === 'overdue' ? colors.danger : type === 'dueSoon' ? colors.warning : colors.purple;
  const bgColor = type === 'overdue' ? colors.dangerLight : type === 'dueSoon' ? colors.warningLight : colors.purpleLight;

  return (
    <View style={[styles.hwCard, { borderLeftColor: accentColor }]}>
      <View style={styles.hwTop}>
        <View style={[styles.subjectBadge, { backgroundColor: bgColor }]}>
          <Text style={[styles.subjectBadgeText, { color: accentColor }]}>{hw.subject}</Text>
        </View>
        <Text style={[styles.hwDue, { color: accentColor }]}>
          {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : `${daysLeft}d left`}
        </Text>
      </View>
      <Text style={styles.hwTitle}>{hw.title}</Text>
      {hw.description ? (
        <Text style={styles.hwDesc} numberOfLines={3}>{hw.description}</Text>
      ) : null}
      <View style={styles.hwFooter}>
        <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
        <Text style={styles.hwFooterText}>Due: {dueDateStr}</Text>
        <Text style={styles.hwFooterDot}>•</Text>
        <Text style={styles.hwFooterText}>{hw.class_name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: fontSize.md, color: colors.textSecondary },

  childHeader: {
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
  childAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  childName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  childClass: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  countText: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primary,
  },
  countLabel: {
    fontSize: fontSize.xs,
    color: colors.primary,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  hwCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  hwTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subjectBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  subjectBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  hwDue: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  hwTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  hwDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  hwFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  hwFooterText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  hwFooterDot: {
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
