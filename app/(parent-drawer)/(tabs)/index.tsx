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
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import { useAdminStudentEntries } from '../../../src/hooks/useAdminTimetable';

const DEMO_CHILD = {
  name: 'Arjun Sharma',
  class: '8-B',
  rollNumber: '24',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
};

const DEMO_TIMETABLE = [
  {
    id: '1',
    startTime: '08:00',
    endTime: '08:45',
    subject: 'Mathematics',
    subjectShort: 'MATHEMATICS',
    chapter: 'Algebra Foundations',
    teacher: 'Dr. S. Verma',
    room: 'Room 204',
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
  {
    id: '2',
    startTime: '08:50',
    endTime: '09:35',
    subject: 'Science',
    subjectShort: 'SCIENCE',
    chapter: 'Chemical Reactions',
    teacher: 'Mrs. Anjali Rao',
    room: 'Lab A',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
  {
    id: '3',
    startTime: '09:40',
    endTime: '10:25',
    subject: 'English',
    subjectShort: 'ENGLISH',
    chapter: 'Creative Writing',
    teacher: 'Mr. David Smith',
    room: 'Room 108',
    color: '#E65100',
    bgColor: '#FFF3E0',
    isOngoing: true,
  },
  {
    id: '4',
    startTime: '10:30',
    endTime: '11:15',
    subject: 'Hindi',
    subjectShort: 'HINDI',
    chapter: 'Kavya Sangrah',
    teacher: 'Mrs. Sunita Devi',
    room: 'Room 204',
    color: '#7B1FA2',
    bgColor: '#F3E5F5',
  },
  {
    id: '5',
    startTime: '11:30',
    endTime: '12:15',
    subject: 'Social Studies',
    subjectShort: 'SOCIAL STUDIES',
    chapter: 'Indian Constitution',
    teacher: 'Mr. Rajesh Kumar',
    room: 'Room 301',
    color: '#00838F',
    bgColor: '#E0F7FA',
  },
  {
    id: '6',
    startTime: '12:20',
    endTime: '01:05',
    subject: 'Computer Science',
    subjectShort: 'COMPUTERS',
    chapter: 'Python Programming',
    teacher: 'Ms. Priya Nair',
    room: 'Lab 2',
    color: '#AD1457',
    bgColor: '#FCE4EC',
  },
];

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, isDemo } = useUser();

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (!user && !isDemo) {
      router.replace('/login');
    }
  }, [user, isDemo]);

  // Get admin-created timetable entries for this student's class
  const adminClassEntries = useAdminStudentEntries(`Class ${DEMO_CHILD.class}`);

  // Merge admin entries into timetable display
  const adminAsTimetable = adminClassEntries.map((e, idx) => ({
    id: `admin-${e.id}`,
    startTime: e.start_time,
    endTime: e.end_time,
    subject: e.subject,
    subjectShort: e.subject.toUpperCase().split(' ')[0],
    chapter: e.is_supplementary ? 'Supplementary Class' : (e.note || ''),
    teacher: e.teacher_name,
    room: e.room,
    color: e.is_supplementary ? '#D97706' : '#6366F1',
    bgColor: e.is_supplementary ? '#FFFBEB' : '#EEF2FF',
    isSupplementary: e.is_supplementary,
  }));
  const allTimetable = [...DEMO_TIMETABLE, ...adminAsTimetable]
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const todayString = () => {
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const quickActions = [
    {
      icon: 'checkmark-circle' as const,
      label: 'Attendance',
      color: '#1565C0',
      bgColor: '#E3F2FD',
      onPress: () => router.push('/(parent-drawer)/(tabs)/attendance'),
    },
    {
      icon: 'book' as const,
      label: 'Homework',
      color: '#7B1FA2',
      bgColor: '#F3E5F5',
      onPress: () => router.push('/(parent-drawer)/(tabs)/homework'),
    },
    {
      icon: 'calendar' as const,
      label: 'Academic\nCalendar',
      color: '#E65100',
      bgColor: '#FFF3E0',
      onPress: () => router.push('/(parent-drawer)/calendar'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
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
      {/* Student Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: DEMO_CHILD.photo }}
            style={styles.profileImage}
          />
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.studentName}>{DEMO_CHILD.name}</Text>
          <Text style={styles.studentClass}>
            Class {DEMO_CHILD.class} • Roll No. {DEMO_CHILD.rollNumber}
          </Text>
          <View style={styles.datePill}>
            <Ionicons name="calendar" size={13} color={colors.primary} />
            <Text style={styles.datePillText}>{todayString()}</Text>
          </View>
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
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: action.bgColor }]}>
              <Ionicons name={action.icon} size={22} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's Timetable */}
      <View style={styles.timetableHeader}>
        <Text style={styles.sectionTitle}>Today's Timetable</Text>
        <TouchableOpacity>
          <Text style={styles.seeWeeklyText}>See Weekly</Text>
        </TouchableOpacity>
      </View>

      {allTimetable.map((period) => (
        <View
          key={period.id}
          style={[
            styles.timetableCard,
            (period as any).isOngoing && styles.timetableCardOngoing,
          ]}
        >
          {/* Time column */}
          <View style={styles.timeColumn}>
            <Text style={[styles.startTime, (period as any).isOngoing && styles.ongoingTime]}>
              {period.startTime}
            </Text>
            <Text style={styles.endTime}>{period.endTime}</Text>
          </View>

          {/* Content */}
          <View style={styles.periodContent}>
            {/* Subject badge + Room */}
            <View style={styles.periodTopRow}>
              <View style={[styles.subjectBadge, { backgroundColor: period.bgColor }]}>
                <Text style={[styles.subjectBadgeText, { color: period.color }]}>
                  {period.subjectShort}
                </Text>
              </View>
              <Text style={styles.roomText}>{period.room}</Text>
            </View>

            {/* Chapter title */}
            <Text style={styles.chapterTitle}>{period.chapter}</Text>

            {/* Supplementary badge */}
            {(period as any).isSupplementary && (
              <View style={{
                backgroundColor: '#FFFBEB',
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
                alignSelf: 'flex-start',
                marginBottom: 4,
                borderWidth: 1,
                borderColor: '#FDE68A',
              }}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#D97706', letterSpacing: 0.5 }}>SUPPLEMENTARY</Text>
              </View>
            )}

            {/* Teacher */}
            <View style={styles.teacherRow}>
              <Ionicons name="person-outline" size={12} color={colors.textLight} />
              <Text style={styles.teacherName}>{period.teacher}</Text>
            </View>
          </View>

          {/* Ongoing indicator */}
          {(period as any).isOngoing && (
            <View style={styles.ongoingBadge}>
              <Text style={styles.ongoingText}>Ongoing</Text>
            </View>
          )}
        </View>
      ))}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingBottom: spacing.xxxl,
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: spacing.xl,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  profileImageWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: colors.white,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  studentClass: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  datePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  // Section Title
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginTop: 22,
    marginBottom: 12,
  },

  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 10,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Timetable
  timetableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.xl,
  },
  seeWeeklyText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 22,
  },
  timetableCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  timetableCardOngoing: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#FAFCFF',
  },

  // Time column
  timeColumn: {
    width: 48,
    marginRight: 12,
    paddingTop: 2,
  },
  startTime: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ongoingTime: {
    color: colors.primary,
    fontWeight: '800',
  },
  endTime: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },

  // Period content
  periodContent: {
    flex: 1,
  },
  periodTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roomText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teacherName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Ongoing badge
  ongoingBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  ongoingText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
});
