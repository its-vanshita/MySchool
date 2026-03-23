import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useSharedUsers } from '../../../src/hooks/useSharedUsers';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { teachers, students } = useSharedUsers();
  const [refreshing, setRefreshing] = React.useState(false);

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
    return `Today is ${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  // Admin Quick Actions (6 items)
  const quickActions = [
    {
      icon: 'notifications' as const,
      label: 'Assign\nNotice',
      color: colors.primary,
      bgColor: '#E3F2FD',
      route: '/assign-notice',
    },
    {
      icon: 'document-text' as const,
      label: 'Leave\nApprovals',
      color: '#D97706',
      bgColor: '#FFFBEB',
      route: '/admin-leave-approvals',
    },
    {
      icon: 'calendar' as const,
      label: 'Manage\nTimetable',
      color: colors.warning,
      bgColor: '#FFF8E1',
      route: '/admin-manage-timetable',
    },
    {
      icon: 'calendar-outline' as const,
      label: 'Manage\nCalendar',
      color: colors.purple,
      bgColor: '#F3E5F5',
      route: '/admin-manage-calendar',
    },
    {
      icon: 'bar-chart' as const,
      label: 'Syllabus\nTracking',
      color: colors.info,
      bgColor: '#E0F7FA',
      route: '/admin-lesson-plans',
    },
    {
      icon: 'pie-chart' as const,
      label: 'Analytics\nDashboard',
      color: colors.success,
      bgColor: '#E8F5E9',
      route: '/admin-analytics',
    },
  ];

  // Daily changing pseudo-metrics
  const dailyStats = React.useMemo(() => {
    const d = new Date();
    const seed = d.getFullYear() * 1000 + d.getMonth() * 100 + d.getDate();
    
    const studentAttendance = 91 + (seed % 7) + ((seed % 10) / 10);
    const teacherAttendance = 94 + (seed % 5) + ((seed % 8) / 10);

    return {
      totalStudents: students.length,
      studentAttendance: studentAttendance.toFixed(1),
      totalTeachers: teachers.length,
      teacherAttendance: teacherAttendance.toFixed(1),
    };
  }, [students.length, teachers.length]);

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
      {/* Profile / Greeting Section */}
      <View style={styles.greetingSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' }}
          style={styles.profileImage}
        />
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingText}>
            {greeting()}, {profile?.name?.split(' ').pop() || 'Admin'}
          </Text>
          <Text style={styles.roleSubtitle}>School Administrator</Text>
          <View style={styles.todayPill}>
            <Text style={styles.todayPillText}>{todayString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.actionCard}
            onPress={() => {
              if (action.route !== '#') {
                router.push(action.route as any);
              }
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Overview Stats */}
      <Text style={styles.sectionTitle}>Daily Overview</Text>
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[styles.statCard, { borderLeftColor: colors.primary }]}
          onPress={() => router.push('/admin-attendance-list?type=students')}
        >
          <View style={styles.statHeader}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <Text style={styles.statValue}>{dailyStats.totalStudents}</Text>
          <View style={styles.statFooter}>
            <Ionicons name="trending-up" size={14} color={colors.success} />
            <Text style={[styles.statFooterText, { color: colors.success }]}>{dailyStats.studentAttendance}% Present Today</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, { borderLeftColor: colors.purple }]}
          onPress={() => router.push('/admin-attendance-list?type=teachers')}
        >
          <View style={styles.statHeader}>
            <Ionicons name="school" size={20} color={colors.purple} />
            <Text style={styles.statLabel}>Total Teachers</Text>
          </View>
          <Text style={styles.statValue}>{dailyStats.totalTeachers}</Text>
          <View style={styles.statFooter}>
            <Ionicons name="trending-up" size={14} color={colors.success} />
            <Text style={[styles.statFooterText, { color: colors.success }]}>{dailyStats.teacherAttendance}% Present Today</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 100 },

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
  greetingTextContainer: {
    flex: 1,
  },
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },
  statsContainer: {
    paddingHorizontal: spacing.xl,
    flexDirection: 'column',
    gap: 0,
  },
  statCard: {
    backgroundColor: '#FAFAFA',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  statFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statFooterText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    color: colors.success,
  },
});

