import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDatesheet } from '../../../src/hooks/useDatesheet';
import { useSharedUploadedDatesheets } from '../../../src/hooks/useSharedUploadedDatesheets';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { ExamEntry, ExamGroup } from '../../../src/types';

// Demo exam data for parent view
const DEMO_EXAMS: ExamEntry[] = [
  { id: '1', class_name: 'Class 10-A', subject: 'Mathematics', exam_date: '2026-03-20', start_time: '09:00', end_time: '11:00', room: 'Hall A', school_id: 'demo', exam_type: 'annual' },
  { id: '2', class_name: 'Class 10-A', subject: 'Science', exam_date: '2026-03-22', start_time: '09:00', end_time: '11:00', room: 'Hall B', school_id: 'demo', exam_type: 'annual' },
  { id: '3', class_name: 'Class 10-A', subject: 'English', exam_date: '2026-03-24', start_time: '09:00', end_time: '11:00', room: 'Hall A', school_id: 'demo', exam_type: 'annual' },
  { id: '4', class_name: 'Class 10-A', subject: 'Hindi', exam_date: '2026-03-26', start_time: '09:00', end_time: '11:00', room: 'Hall C', school_id: 'demo', exam_type: 'annual' },
  { id: '5', class_name: 'Class 10-A', subject: 'Social Studies', exam_date: '2026-03-28', start_time: '09:00', end_time: '11:00', room: 'Hall A', school_id: 'demo', exam_type: 'annual' },
  { id: '6', class_name: 'Class 10-A', subject: 'Computer Science', exam_date: '2026-03-30', start_time: '09:00', end_time: '10:00', room: 'Lab 1', school_id: 'demo', exam_type: 'annual' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: colors.primary,
  Science: colors.success,
  English: colors.purple,
  Hindi: colors.warning,
  'Social Studies': colors.info,
  'Computer Science': colors.accent,
};

export default function ParentDatesheetScreen() {
  const { examGroups, loading } = useDatesheet('demo-school', true);
  const { datesheets } = useSharedUploadedDatesheets();
  const [showDemo, setShowDemo] = useState(true);

  const studentDatesheets = datesheets.filter(d => d.target === 'student' || d.target === 'both');
  const exams = showDemo ? DEMO_EXAMS : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerIcon}>
          <Ionicons name="clipboard" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Exam Datesheet</Text>
          <Text style={styles.headerSub}>Arjun Sharma • Class 10-A</Text>
        </View>
      </View>

      {studentDatesheets.length > 0 && (
        <View style={styles.uploadedContainer}>
          <Text style={styles.sectionHeader}>Official Announcements</Text>
          {studentDatesheets.map(d => (
            <View key={d.id} style={styles.uploadedCard}>
              <Image source={{ uri: d.imageUrl }} style={styles.uploadedImage} />
              <View style={styles.uploadedInfo}>
                <Text style={styles.uploadedTitle}>{d.title}</Text>
                <Text style={styles.uploadedDate}>Posted: {new Date(d.datePosted).toLocaleDateString()}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Exam Type Banner */}
      <View style={styles.examTypeBanner}>
        <Ionicons name="school" size={18} color={colors.white} />
        <Text style={styles.examTypeText}>Upcoming Tracked Exams</Text>
      </View>

      {exams.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="clipboard-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No Exams Scheduled</Text>
          <Text style={styles.emptySubText}>Exam datesheet will appear here when published</Text>
        </View>
      ) : (
        exams.map((exam, idx) => {
          const examDate = new Date(exam.exam_date + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isPast = daysUntil < 0;
          const isToday = daysUntil === 0;
          const subjectColor = SUBJECT_COLORS[exam.subject] || colors.textPrimary;

          return (
            <View key={exam.id} style={[styles.examCard, isPast && styles.examCardPast]}>
              {/* Date Column */}
              <View style={[styles.dateColumn, isToday && styles.dateColumnToday]}>
                <Text style={[styles.dateDay, isToday && { color: colors.white }]}>
                  {examDate.getDate()}
                </Text>
                <Text style={[styles.dateMonth, isToday && { color: colors.white }]}>
                  {MONTHS[examDate.getMonth()]}
                </Text>
                <Text style={[styles.dateDayName, isToday && { color: 'rgba(255,255,255,0.8)' }]}>
                  {DAYS[examDate.getDay()]}
                </Text>
              </View>

              {/* Content */}
              <View style={styles.examContent}>
                <View style={styles.examSubjectRow}>
                  <View style={[styles.subjectDot, { backgroundColor: subjectColor }]} />
                  <Text style={[styles.examSubject, isPast && { color: colors.textLight }]}>
                    {exam.subject}
                  </Text>
                </View>
                <View style={styles.examDetails}>
                  <Ionicons name="time-outline" size={13} color={colors.textLight} />
                  <Text style={styles.examDetailText}>
                    {exam.start_time} – {exam.end_time}
                  </Text>
                </View>
                <View style={styles.examDetails}>
                  <Ionicons name="location-outline" size={13} color={colors.textLight} />
                  <Text style={styles.examDetailText}>{exam.room}</Text>
                </View>
              </View>

              {/* Status */}
              <View style={styles.examStatus}>
                {isPast ? (
                  <View style={[styles.statusPill, { backgroundColor: colors.successLight }]}>
                    <Text style={[styles.statusPillText, { color: colors.success }]}>Done</Text>
                  </View>
                ) : isToday ? (
                  <View style={[styles.statusPill, { backgroundColor: colors.dangerLight }]}>
                    <Text style={[styles.statusPillText, { color: colors.danger }]}>Today</Text>
                  </View>
                ) : (
                  <View style={[styles.statusPill, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.statusPillText, { color: colors.primary }]}>
                      {daysUntil}d
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxxl },

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
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
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

  examTypeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  examTypeText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.white,
  },

  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  examCardPast: {
    opacity: 0.6,
  },

  dateColumn: {
    width: 56,
    height: 68,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dateColumnToday: {
    backgroundColor: colors.primary,
  },
  dateDay: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.primary,
  },
  dateMonth: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  dateDayName: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 1,
  },

  examContent: { flex: 1 },
  examSubjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  examSubject: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  examDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  examDetailText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },

  examStatus: { marginLeft: spacing.sm },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusPillText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
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

  uploadedContainer: { marginHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionHeader: { fontSize: fontSize.md, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.sm },
  uploadedCard: {
    flexDirection: 'row', backgroundColor: colors.white, 
    borderRadius: borderRadius.md, marginBottom: spacing.sm, padding: spacing.sm,
    borderWidth: 1, borderColor: colors.border
  },
  uploadedImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#E5E7EB', marginRight: spacing.md },
  uploadedInfo: { flex: 1, justifyContent: 'center' },
  uploadedTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  uploadedDate: { fontSize: 11, color: colors.textLight }
});
