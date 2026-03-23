import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';

// ── Types ──
interface ExamOption {
  id: string;
  label: string;
}

interface SubjectMark {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
}

interface ExamResult {
  examId: string;
  subjects: SubjectMark[];
}

interface AttendanceData {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  monthlyBreakdown: { month: string; percentage: number }[];
}

// ── Demo Data ──
const EXAM_OPTIONS: ExamOption[] = [
  { id: 'midterm', label: 'Mid-Term Examination' },
  { id: 'unit3', label: 'Unit Test 3' },
  { id: 'preboard', label: 'Pre-Board Examination' },
  { id: 'final', label: 'Final Examination' },
];

// Marks per student per exam
const DEMO_MARKS: Record<string, ExamResult[]> = {
  s1: [
    { examId: 'midterm', subjects: [
      { subject: 'Mathematics', marks: 85, maxMarks: 100, grade: 'A' },
      { subject: 'Science', marks: 78, maxMarks: 100, grade: 'B+' },
      { subject: 'English', marks: 88, maxMarks: 100, grade: 'A' },
      { subject: 'Hindi', marks: 72, maxMarks: 100, grade: 'B+' },
      { subject: 'Social Science', marks: 90, maxMarks: 100, grade: 'A+' },
    ]},
    { examId: 'unit3', subjects: [
      { subject: 'Mathematics', marks: 90, maxMarks: 100, grade: 'A+' },
      { subject: 'Science', marks: 82, maxMarks: 100, grade: 'A' },
      { subject: 'English', marks: 85, maxMarks: 100, grade: 'A' },
      { subject: 'Hindi', marks: 78, maxMarks: 100, grade: 'B+' },
      { subject: 'Social Science', marks: 88, maxMarks: 100, grade: 'A' },
    ]},
    { examId: 'preboard', subjects: [
      { subject: 'Mathematics', marks: 88, maxMarks: 100, grade: 'A' },
      { subject: 'Science', marks: 85, maxMarks: 100, grade: 'A' },
      { subject: 'English', marks: 91, maxMarks: 100, grade: 'A+' },
      { subject: 'Hindi', marks: 80, maxMarks: 100, grade: 'A' },
      { subject: 'Social Science', marks: 92, maxMarks: 100, grade: 'A+' },
    ]},
    { examId: 'final', subjects: [
      { subject: 'Mathematics', marks: 92, maxMarks: 100, grade: 'A+' },
      { subject: 'Science', marks: 88, maxMarks: 100, grade: 'A' },
      { subject: 'English', marks: 94, maxMarks: 100, grade: 'A+' },
      { subject: 'Hindi', marks: 82, maxMarks: 100, grade: 'A' },
      { subject: 'Social Science', marks: 95, maxMarks: 100, grade: 'A+' },
    ]},
  ],
  s2: [
    { examId: 'midterm', subjects: [
      { subject: 'Mathematics', marks: 92, maxMarks: 100, grade: 'A+' },
      { subject: 'Science', marks: 88, maxMarks: 100, grade: 'A' },
      { subject: 'English', marks: 95, maxMarks: 100, grade: 'A+' },
      { subject: 'Hindi', marks: 85, maxMarks: 100, grade: 'A' },
      { subject: 'Social Science', marks: 91, maxMarks: 100, grade: 'A+' },
    ]},
    { examId: 'unit3', subjects: [
      { subject: 'Mathematics', marks: 95, maxMarks: 100, grade: 'A+' },
      { subject: 'Science', marks: 90, maxMarks: 100, grade: 'A+' },
      { subject: 'English', marks: 92, maxMarks: 100, grade: 'A+' },
      { subject: 'Hindi', marks: 88, maxMarks: 100, grade: 'A' },
      { subject: 'Social Science', marks: 93, maxMarks: 100, grade: 'A+' },
    ]},
    { examId: 'preboard', subjects: [
      { subject: 'Mathematics', marks: 94, maxMarks: 100, grade: 'A+' },
      { subject: 'Science', marks: 91, maxMarks: 100, grade: 'A+' },
      { subject: 'English', marks: 96, maxMarks: 100, grade: 'A+' },
      { subject: 'Hindi', marks: 87, maxMarks: 100, grade: 'A' },
      { subject: 'Social Science', marks: 94, maxMarks: 100, grade: 'A+' },
    ]},
    { examId: 'final', subjects: [
      { subject: 'Mathematics', marks: 97, maxMarks: 100, grade: 'A+' },
      { subject: 'Science', marks: 93, maxMarks: 100, grade: 'A+' },
      { subject: 'English', marks: 98, maxMarks: 100, grade: 'A+' },
      { subject: 'Hindi', marks: 90, maxMarks: 100, grade: 'A+' },
      { subject: 'Social Science', marks: 96, maxMarks: 100, grade: 'A+' },
    ]},
  ],
};

// Fallback generator for students without explicit data
function generateMarks(studentId: string): ExamResult[] {
  const seed = studentId.charCodeAt(1) * 7;
  return EXAM_OPTIONS.map((exam, ei) => ({
    examId: exam.id,
    subjects: [
      { subject: 'Mathematics', marks: 60 + ((seed + ei * 5) % 35), maxMarks: 100, grade: '' },
      { subject: 'Science', marks: 55 + ((seed + ei * 7) % 40), maxMarks: 100, grade: '' },
      { subject: 'English', marks: 65 + ((seed + ei * 3) % 30), maxMarks: 100, grade: '' },
      { subject: 'Hindi', marks: 50 + ((seed + ei * 11) % 45), maxMarks: 100, grade: '' },
      { subject: 'Social Science', marks: 60 + ((seed + ei * 9) % 35), maxMarks: 100, grade: '' },
    ].map((s) => ({ ...s, grade: getGrade(s.marks) })),
  }));
}

function getGrade(marks: number): string {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  return 'D';
}

function getAttendanceData(): AttendanceData {
  return {
    totalDays: 220,
    present: 204,
    absent: 10,
    late: 6,
    percentage: 93,
    monthlyBreakdown: [
      { month: 'Apr', percentage: 96 },
      { month: 'May', percentage: 92 },
      { month: 'Jun', percentage: 88 },
      { month: 'Jul', percentage: 95 },
      { month: 'Aug', percentage: 97 },
      { month: 'Sep', percentage: 90 },
      { month: 'Oct', percentage: 94 },
      { month: 'Nov', percentage: 91 },
      { month: 'Dec', percentage: 96 },
      { month: 'Jan', percentage: 93 },
      { month: 'Feb', percentage: 89 },
      { month: 'Mar', percentage: 95 },
    ],
  };
}

// Subject colors
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#6366F1',
  Science: '#10B981',
  English: '#F97316',
  Hindi: '#EC4899',
  'Social Science': '#8B5CF6',
};

export default function StudentPerformanceScreen() {
  const params = useLocalSearchParams<{
    studentId: string;
    studentName: string;
    rollNumber: string;
    avatar: string;
    className: string;
    subjects: string;
    isClassTeacher: string;
  }>();

  const isClassTeacher = params.isClassTeacher === '1';
  const teacherSubjects = params.subjects?.split(',') ?? [];
  const attendance = getAttendanceData();

  // Exam picker
  const [selectedExam, setSelectedExam] = useState<ExamOption>(EXAM_OPTIONS[0]);
  const [showExamPicker, setShowExamPicker] = useState(false);

  // Get marks
  const allExamResults = DEMO_MARKS[params.studentId ?? ''] ?? generateMarks(params.studentId ?? 's1');

  const currentExamResult = allExamResults.find((r) => r.examId === selectedExam.id);

  // Filter subjects based on teacher role
  const visibleSubjects = useMemo(() => {
    if (!currentExamResult) return [];
    if (isClassTeacher) return currentExamResult.subjects;
    return currentExamResult.subjects.filter((s) =>
      teacherSubjects.some((ts) => s.subject.toLowerCase().includes(ts.toLowerCase()))
    );
  }, [currentExamResult, isClassTeacher, teacherSubjects]);

  const totalMarks = visibleSubjects.reduce((s, sub) => s + sub.marks, 0);
  const totalMax = visibleSubjects.reduce((s, sub) => s + sub.maxMarks, 0);
  const overallPct = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Student Profile Card ── */}
        <View style={styles.profileCard}>
          <Image source={{ uri: params.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{params.studentName}</Text>
            <Text style={styles.profileDetail}>
              {params.className} • Roll #{params.rollNumber}
            </Text>
          </View>
        </View>

        {/* ══════════ 1. ATTENDANCE REPORT ══════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Attendance Report</Text>
          </View>

          {/* Stats row */}
          <View style={styles.attendanceStats}>
            <View style={styles.attStatItem}>
              <Text style={[styles.attStatValue, { color: colors.primary }]}>{attendance.percentage}%</Text>
              <Text style={styles.attStatLabel}>Overall</Text>
            </View>
            <View style={styles.attStatItem}>
              <Text style={[styles.attStatValue, { color: colors.success }]}>{attendance.present}</Text>
              <Text style={styles.attStatLabel}>Present</Text>
            </View>
            <View style={styles.attStatItem}>
              <Text style={[styles.attStatValue, { color: colors.danger }]}>{attendance.absent}</Text>
              <Text style={styles.attStatLabel}>Absent</Text>
            </View>
            <View style={styles.attStatItem}>
              <Text style={[styles.attStatValue, { color: colors.warning }]}>{attendance.late}</Text>
              <Text style={styles.attStatLabel}>Late</Text>
            </View>
          </View>

          {/* Monthly attendance bar chart */}
          <Text style={styles.chartLabel}>Monthly Attendance</Text>
          <View style={styles.barChart}>
            {attendance.monthlyBreakdown.map((m) => {
              const height = (m.percentage / 100) * 80;
              const barColor = m.percentage >= 90 ? colors.success
                : m.percentage >= 75 ? colors.warning : colors.danger;
              return (
                <View key={m.month} style={styles.barCol}>
                  <Text style={styles.barValue}>{m.percentage}</Text>
                  <View style={[styles.bar, { height, backgroundColor: barColor }]} />
                  <Text style={styles.barLabel}>{m.month}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ══════════ 2. MARKS ══════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color={colors.purple} />
            <Text style={styles.sectionTitle}>Marks & Grades</Text>
          </View>

          {/* Exam type selector */}
          <TouchableOpacity
            style={styles.examSelector}
            onPress={() => setShowExamPicker(true)}
          >
            <Text style={styles.examSelectorText}>{selectedExam.label}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Role indicator */}
          <View style={styles.roleNote}>
            <Ionicons
              name={isClassTeacher ? 'shield-checkmark' : 'book'}
              size={13}
              color={isClassTeacher ? '#16A34A' : colors.primary}
            />
            <Text style={[styles.roleNoteText, {
              color: isClassTeacher ? '#16A34A' : colors.primary,
            }]}>
              {isClassTeacher
                ? 'Showing all subjects (Class Teacher)'
                : `Showing: ${teacherSubjects.join(', ')}`}
            </Text>
          </View>

          {/* Overall */}
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Overall</Text>
            <Text style={styles.overallValue}>{totalMarks}/{totalMax}</Text>
            <View style={[styles.overallBadge, {
              backgroundColor: overallPct >= 80 ? '#DCFCE7' : overallPct >= 60 ? '#FEF3C7' : '#FEE2E2',
            }]}>
              <Text style={[styles.overallPct, {
                color: overallPct >= 80 ? '#16A34A' : overallPct >= 60 ? '#B45309' : colors.danger,
              }]}>{overallPct}%</Text>
            </View>
          </View>

          {/* Subject marks */}
          {visibleSubjects.map((sub) => {
            const pct = Math.round((sub.marks / sub.maxMarks) * 100);
            const barColor = SUBJECT_COLORS[sub.subject] ?? colors.primary;
            return (
              <View key={sub.subject} style={styles.markRow}>
                <View style={styles.markInfo}>
                  <View style={[styles.subjectDot, { backgroundColor: barColor }]} />
                  <Text style={styles.markSubject}>{sub.subject}</Text>
                </View>
                <View style={styles.markBarWrap}>
                  <View style={styles.markBarBg}>
                    <View style={[styles.markBarFill, {
                      width: `${pct}%`,
                      backgroundColor: barColor,
                    }]} />
                  </View>
                </View>
                <Text style={styles.markValue}>{sub.marks}</Text>
                <View style={[styles.gradePill, {
                  backgroundColor: sub.grade.startsWith('A') ? '#DCFCE7' : '#FEF3C7',
                }]}>
                  <Text style={[styles.gradePillText, {
                    color: sub.grade.startsWith('A') ? '#16A34A' : '#B45309',
                  }]}>{sub.grade}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Exam Picker Modal ── */}
      <Modal visible={showExamPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExamPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Exam Type</Text>
            {EXAM_OPTIONS.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={[
                  styles.modalOption,
                  selectedExam.id === exam.id && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setSelectedExam(exam);
                  setShowExamPicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedExam.id === exam.id && { color: colors.primary, fontWeight: '600' },
                ]}>{exam.label}</Text>
                {selectedExam.id === exam.id && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  // Profile
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.lg,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileDetail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Section
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Attendance
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  attStatItem: { alignItems: 'center' },
  attStatValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  attStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chartLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 2,
  },
  bar: {
    width: 14,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },

  // Marks
  examSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  examSelectorText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  roleNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  roleNoteText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  overallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  overallLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    flex: 1,
  },
  overallValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  overallBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  overallPct: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  markRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  markInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  markSubject: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  markBarWrap: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  markBarBg: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  markBarFill: {
    height: 8,
    borderRadius: 4,
  },
  markValue: {
    width: 28,
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  gradePill: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  gradePillText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  modalOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  modalOptionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
});
