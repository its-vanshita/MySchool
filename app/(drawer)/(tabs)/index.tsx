import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { useUser } from '../../../src/context/UserContext';
import { useTimetable } from '../../../src/hooks/useTimetable';
// Announcements removed from dashboard (available via bell notifications)
import { useHomework } from '../../../src/hooks/useHomework';
import { useAdminTeacherEntries } from '../../../src/hooks/useAdminTimetable';
import { useSharedDuties } from '../../../src/hooks/useSharedDuties';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { ScheduleItem, ScheduleStatus, Homework } from '../../../src/types';

const STATUS_COLORS: Record<ScheduleStatus, string> = {
  upcoming: colors.info,
  ongoing: colors.success,
  completed: colors.textLight,
};

// Dummy schedule for demo mode
const DUMMY_SCHEDULE: ScheduleItem[] = [
  {
    id: '1',
    teacher_id: 'demo-teacher',
    subject: 'Mathematics',
    class_name: 'Class 10A',
    room: '204',
    start_time: '09:00',
    end_time: '09:45',
    day: 'monday',
    school_id: 'demo-school',
    status: 'completed',
  },
  {
    id: '2',
    teacher_id: 'demo-teacher',
    subject: 'Science',
    class_name: 'Class 9C',
    room: 'Lab 02',
    start_time: '11:30',
    end_time: '12:15',
    day: 'monday',
    school_id: 'demo-school',
    status: 'ongoing',
  },
  {
    id: '3',
    teacher_id: 'demo-teacher',
    subject: 'Lunch Break',
    class_name: 'Staff Room',
    room: '',
    start_time: '01:30',
    end_time: '02:00',
    day: 'monday',
    school_id: 'demo-school',
    status: 'upcoming',
  },
  {
    id: '4',
    teacher_id: 'demo-teacher',
    subject: 'English',
    class_name: 'Class 10A',
    room: '204',
    start_time: '02:00',
    end_time: '02:45',
    day: 'monday',
    school_id: 'demo-school',
    status: 'upcoming',
  },
];

// Dummy student counts per subject
const STUDENT_COUNTS: Record<string, number> = {
  Mathematics: 42,
  Science: 38,
  English: 40,
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, role, permissions, isDemo } = useUser();
  const { todaySchedule, loading: scheduleLoading } = useTimetable(profile?.id);
  const adminEntries = useAdminTeacherEntries(profile?.id);
  const { duties } = useSharedDuties();

  const { homework: recentHomework } = useHomework(
    role === 'parent' ? undefined : profile?.id,
    role === 'parent'
  );

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!user && !isDemo) {
      router.replace('/login');
      return;
    }
    // Redirect parents to their dedicated dashboard
    if (role === 'parent') {
      router.replace('/(parent-drawer)/(tabs)' as any);
    }
    // Redirect admins to their dedicated dashboard
    if (role === 'admin') {
      router.replace('/(admin-drawer)/(tabs)' as any);
    }
  }, [user, isDemo, role]);

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

  // Merge admin-created entries into today's schedule
  const todayDay = (() => {
    const idx = new Date().getDay();
    const days: Array<import('../../../src/types').DayOfWeek> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return idx === 0 ? 'monday' : days[idx - 1];
  })();
  const adminTodayEntries: ScheduleItem[] = adminEntries
    .filter((e) => e.day === todayDay)
    .map((e) => ({ ...e, status: 'upcoming' as ScheduleStatus }));
  const baseSchedule = isDemo ? DUMMY_SCHEDULE : todaySchedule;
  const schedule = [...baseSchedule, ...adminTodayEntries]
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const myDuties = duties.filter(d => d.teacher_id === (isDemo ? 'demo-teacher' : profile?.id));

  const formatTime12 = (time: string) => {
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return { time: `${h.toString().padStart(2, '0')}:${mStr}`, ampm };
  };

  // Quick actions based on role
  const quickActions = [
    {
      icon: 'checkmark-circle' as const,
      label: 'Mark\nAttendance',
      color: colors.primary,
      bgColor: '#E3F2FD',
      route: '/(drawer)/(tabs)/attendance',
      visible: permissions.canMarkAttendance,
    },
    {
      icon: 'book' as const,
      label: 'Add\nHomework',
      color: colors.purple,
      bgColor: '#EDE9FE',
      route: '/add-homework',
      visible: permissions.canAssignHomework,
    },
    {
      icon: 'chatbubbles' as const,
      label: 'Announce',
      subtitle: 'Teachers',
      color: colors.info,
      bgColor: '#E8EAF6',
      route: '/create-announcement',
      visible: permissions.canPublishAnnouncement,
    },
    {
      icon: 'today' as const,
      label: 'Academic\nCalendar',
      color: colors.success,
      bgColor: '#D1FAE5',
      route: '/(drawer)/calendar',
      visible: true,
    },
  ].filter((a) => a.visible);

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
            {greeting()}, {profile?.name?.split(' ').pop() || 'Teacher'}
          </Text>
          <Text style={styles.roleSubtitle}>
            {role === 'teacher'
              ? 'Class Teacher - 10A'
              : role === 'admin'
              ? 'School Administrator'
              : role === 'parent'
              ? 'Parent'
              : role.charAt(0).toUpperCase() + role.slice(1)}
          </Text>
          <View style={styles.todayPill}>
            <Text style={styles.todayPillText}>{todayString()}</Text>
          </View>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionCard}
            onPress={() => router.push(action.route as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
            {action.subtitle && (
              <Text style={styles.actionSub}>{action.subtitle}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's Schedule */}
      <View style={styles.scheduleTitleRow}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => router.push('/(drawer)/timetable')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {scheduleLoading && !isDemo ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Loading schedule...</Text>
        </View>
      ) : schedule.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={40} color={colors.textLight} />
          <Text style={styles.emptyText}>No classes scheduled today</Text>
          <Text style={styles.emptySubText}>Enjoy your free day!</Text>
        </View>
      ) : (
        schedule.map((item, idx) => (
          <ScheduleCard key={item.id || idx} item={item} isLast={idx === schedule.length - 1} />
        ))
      )}



      {/* Teacher Duties Section */}
      {myDuties.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Assigned Duties</Text>
          {myDuties.map((duty) => (
            <View key={duty.id} style={styles.dutyCard}>
              <View style={styles.dutyLeftBadge}>
                <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.dutyContent}>
                <Text style={styles.dutyTitle}>{duty.activity}</Text>
                <View style={styles.dutyRowInfo}>
                  <Ionicons name="calendar-outline" size={12} color={colors.textLight} />
                  <Text style={styles.dutyMetaText}>{duty.date}</Text>
                  <Text style={styles.dutyDot}> • </Text>
                  <Ionicons name="time-outline" size={12} color={colors.textLight} />
                  <Text style={styles.dutyMetaText}>{duty.time}</Text>
                </View>
                <View style={styles.dutyRowInfo}>
                  <Ionicons name="location-outline" size={12} color={colors.textLight} />
                  <Text style={[styles.dutyMetaText, { color: colors.textSecondary, fontWeight: '600' }]}>{duty.room}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.border} />
            </View>
          ))}
        </>
      )}

      {/* Recent Homework */}
      {recentHomework.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            {role === 'parent' ? 'Homework Assigned' : 'Recent Homework'}
          </Text>
          {recentHomework.slice(0, 5).map((hw) => (
            <HomeworkCard key={hw.id} hw={hw} />
          ))}
        </>
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

function ScheduleCard({ item, isLast }: { item: ScheduleItem; isLast: boolean }) {
  const formatTime12 = (time: string) => {
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return { time: `${h.toString().padStart(2, '0')}:${mStr}`, ampm };
  };

  const { time, ampm } = formatTime12(item.start_time);
  const students = STUDENT_COUNTS[item.subject];
  const isBreak = item.subject.toLowerCase().includes('break') || item.subject.toLowerCase().includes('lunch');

  return (
    <View style={[styles.scheduleCard, isLast && { marginBottom: spacing.md }]}>
      {/* Time Column */}
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.ampmText}>{ampm}</Text>
      </View>

      {/* Timeline dot & line */}
      <View style={styles.timelineColumn}>
        <View style={[styles.timelineDot, isBreak && { backgroundColor: colors.textLight }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Content Card */}
      <View style={[styles.scheduleContent, isBreak && styles.scheduleContentBreak]}>
        <View style={styles.scheduleContentInner}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.scheduleSubject, isBreak && { color: colors.textSecondary }]}>
              {item.subject}
            </Text>
            <Text style={styles.scheduleClass}>
              {item.class_name}
              {item.room ? ` • ${item.room.startsWith('Room') || item.room.startsWith('Lab') ? item.room : `Room ${item.room}`}` : ''}
            </Text>
            {students && (
              <View style={styles.studentsRow}>
                <Ionicons name="people-outline" size={13} color={colors.textLight} />
                <Text style={styles.studentsText}>{students} Students</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-vertical" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: spacing.xxxl },

  // Greeting Section
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

  // Separator
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },

  // Section
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  // Schedule Title Row
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

  // Quick Actions
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
    lineHeight: 15,
  },
  actionSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },

  // Schedule Timeline
  scheduleCard: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    minHeight: 80,
  },
  timeColumn: {
    width: 46,
    alignItems: 'center',
    paddingTop: 4,
  },
  timeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  ampmText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '600',
  },
  timelineColumn: {
    width: 24,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 6,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  scheduleContent: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  scheduleContentBreak: {
    backgroundColor: colors.background,
    borderColor: colors.divider,
    elevation: 0,
    shadowOpacity: 0,
  },
  scheduleContentInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  scheduleSubject: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  scheduleClass: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  studentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },
  studentsText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  moreBtn: {
    padding: spacing.xs,
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
  homeworkLeft: {
    marginRight: spacing.md,
  },
  homeworkSubjectBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeworkContent: {
    flex: 1,
  },
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
  homeworkDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  homeworkRight: { alignItems: 'flex-end', justifyContent: 'center' },
  homeworkDue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  homeworkDueLabel: { fontSize: 11, color: colors.textLight, marginTop: 2, fontWeight: '600', textTransform: 'uppercase' },
  
  dutyCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    marginHorizontal: spacing.xl, marginBottom: spacing.md, padding: spacing.md,
    borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }
  },
  dutyLeftBadge: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md
  },
  dutyContent: { flex: 1, gap: 4 },
  dutyTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  dutyRowInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dutyMetaText: { fontSize: 12, color: colors.textSecondary },
  dutyDot: { fontSize: 12, color: colors.textLight },
});
