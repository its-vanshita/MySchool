import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { useUser } from '../../../src/context/UserContext';
import { useHomework } from '../../../src/hooks/useHomework';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { Homework } from '../../../src/types';

// Demo child info for parent
const DEMO_CHILD = {
  name: 'Arjun Sharma',
  class: 'Class 10-A',
  rollNumber: '12',
  attendance: 92,
  totalPresent: 184,
  totalDays: 200,
};

// Demo attendance summary
type AttendanceDayStatus = 'present' | 'absent' | 'late' | 'excused';

const DEMO_ATTENDANCE_WEEKLY: { day: string; status: AttendanceDayStatus }[] = [
  { day: 'Mon', status: 'present' },
  { day: 'Tue', status: 'present' },
  { day: 'Wed', status: 'absent' },
  { day: 'Thu', status: 'present' },
  { day: 'Fri', status: 'present' },
  { day: 'Sat', status: 'present' },
];

const STATUS_DOT_COLORS: Record<string, string> = {
  present: colors.success,
  absent: colors.danger,
  late: colors.warning,
  excused: colors.info,
};

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, isDemo } = useUser();
  const { homework: recentHomework } = useHomework(undefined, true);

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (!user && !isDemo) {
      router.replace('/login');
    }
  }, [user, isDemo]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayString = () => {
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  const quickActions = [
    {
      icon: 'checkmark-circle' as const,
      label: 'Attendance',
      color: colors.success,
      bgColor: colors.successLight,
      onPress: () => router.push('/(parent-drawer)/(tabs)/attendance'),
    },
    {
      icon: 'book' as const,
      label: 'Homework',
      color: colors.purple,
      bgColor: colors.purpleLight,
      onPress: () => router.push('/(parent-drawer)/(tabs)/homework'),
    },
    {
      icon: 'megaphone' as const,
      label: 'Notices',
      color: colors.info,
      bgColor: colors.infoLight,
      onPress: () => router.push('/(parent-drawer)/(tabs)/notices'),
    },
    {
      icon: 'clipboard' as const,
      label: 'Exams',
      color: colors.warning,
      bgColor: colors.warningLight,
      onPress: () => router.push('/(parent-drawer)/(tabs)/datesheet'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 600);
          }}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' }}
          style={styles.profileImage}
        />
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingText}>
            {greeting()}, {profile?.name?.split(' ')[0] || 'Parent'}
          </Text>
          <Text style={styles.roleSubtitle}>Parent</Text>
          <View style={styles.todayPill}>
            <Text style={styles.todayPillText}>{todayString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      {/* Child Info Card */}
      <Text style={styles.sectionTitle}>Your Child</Text>
      <View style={styles.childCard}>
        <View style={styles.childAvatarContainer}>
          <View style={styles.childAvatar}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
        </View>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{DEMO_CHILD.name}</Text>
          <Text style={styles.childClass}>{DEMO_CHILD.class} • Roll #{DEMO_CHILD.rollNumber}</Text>
        </View>
        <View style={styles.attendanceBadge}>
          <Text style={styles.attendancePercent}>{DEMO_CHILD.attendance}%</Text>
          <Text style={styles.attendanceLabel}>Attendance</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionCard}
            onPress={action.onPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* This Week's Attendance */}
      <Text style={styles.sectionTitle}>This Week's Attendance</Text>
      <View style={styles.weeklyCard}>
        <View style={styles.weeklyRow}>
          {DEMO_ATTENDANCE_WEEKLY.map((d) => (
            <View key={d.day} style={styles.weeklyDay}>
              <View style={[styles.weeklyDot, { backgroundColor: STATUS_DOT_COLORS[d.status] }]} />
              <Text style={styles.weeklyDayText}>{d.day}</Text>
              <Text style={[styles.weeklyStatus, { color: STATUS_DOT_COLORS[d.status] }]}>
                {d.status === 'present' ? 'P' : d.status === 'absent' ? 'A' : d.status === 'late' ? 'L' : 'E'}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.weeklyLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
        </View>
      </View>

      {/* Attendance Summary Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: colors.success }]}>
          <Text style={styles.statNumber}>{DEMO_CHILD.totalPresent}</Text>
          <Text style={styles.statLabel}>Days Present</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.danger }]}>
          <Text style={styles.statNumber}>{DEMO_CHILD.totalDays - DEMO_CHILD.totalPresent}</Text>
          <Text style={styles.statLabel}>Days Absent</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
          <Text style={styles.statNumber}>{DEMO_CHILD.totalDays}</Text>
          <Text style={styles.statLabel}>Total Days</Text>
        </View>
      </View>

      {/* Recent Homework */}
      <View style={styles.scheduleTitleRow}>
        <Text style={styles.sectionTitle}>Homework</Text>
        <TouchableOpacity onPress={() => router.push('/(parent-drawer)/(tabs)/homework')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentHomework.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="book-outline" size={40} color={colors.textLight} />
          <Text style={styles.emptyText}>No homework assigned</Text>
          <Text style={styles.emptySubText}>Your child is all caught up!</Text>
        </View>
      ) : (
        recentHomework.slice(0, 4).map((hw) => (
          <HomeworkCard key={hw.id} hw={hw} />
        ))
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function HomeworkCard({ hw }: { hw: Homework }) {
  const dueDate = new Date(hw.due_date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;
  const isDueSoon = daysLeft >= 0 && daysLeft <= 1;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dueDateStr = `${months[dueDate.getMonth()]} ${dueDate.getDate()}`;

  return (
    <View style={styles.homeworkCard}>
      <View style={styles.homeworkLeft}>
        <View style={[
          styles.homeworkSubjectBadge,
          { backgroundColor: isOverdue ? colors.dangerLight : isDueSoon ? colors.warningLight : colors.purpleLight },
        ]}>
          <Ionicons
            name="book-outline"
            size={16}
            color={isOverdue ? colors.danger : isDueSoon ? colors.warning : colors.purple}
          />
        </View>
      </View>
      <View style={styles.homeworkContent}>
        <Text style={styles.homeworkTitle} numberOfLines={1}>{hw.title}</Text>
        <Text style={styles.homeworkMeta}>
          {hw.subject} • {hw.class_name}
        </Text>
        {hw.description ? (
          <Text style={styles.homeworkDesc} numberOfLines={2}>{hw.description}</Text>
        ) : null}
      </View>
      <View style={styles.homeworkRight}>
        <Text style={[
          styles.homeworkDue,
          isOverdue && { color: colors.danger },
          isDueSoon && { color: colors.warning },
        ]}>
          {dueDateStr}
        </Text>
        <Text style={[
          styles.homeworkDueLabel,
          isOverdue && { color: colors.danger },
          isDueSoon && { color: colors.warning },
        ]}>
          {isOverdue ? 'Overdue' : daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d left`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: spacing.xxxl },

  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.lg,
  },
  greetingTextContainer: { flex: 1 },
  greetingText: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  roleSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  todayPill: {
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  todayPillText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#2E7D32',
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  // Child card
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  childAvatarContainer: { marginRight: spacing.md },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childInfo: { flex: 1 },
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
  attendanceBadge: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  attendancePercent: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.success,
  },
  attendanceLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },

  // Quick actions
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Weekly attendance
  weeklyCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
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
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyDay: { alignItems: 'center', gap: 6 },
  weeklyDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weeklyDayText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  weeklyStatus: {
    fontSize: fontSize.xs,
    fontWeight: '800',
  },
  weeklyLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Schedule title row
  scheduleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.xl,
  },
  viewAllText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.xl,
  },

  // Empty
  emptyCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  emptySubText: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },

  // Homework
  homeworkCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  homeworkLeft: { marginRight: spacing.md },
  homeworkSubjectBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeworkContent: { flex: 1 },
  homeworkTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  homeworkMeta: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  homeworkDesc: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
    lineHeight: 16,
  },
  homeworkRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  homeworkDue: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.purple,
  },
  homeworkDueLabel: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 1,
  },
});
