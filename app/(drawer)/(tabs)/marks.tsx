import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useUser } from '../../../src/context/UserContext';
import { getTimetableForTeacher } from '../../../src/services/supabaseService';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { TimetableEntry } from '../../../src/types';

// ── Types ──
interface SubjectClass {
  label: string;
  subject: string;
  className: string;
}

interface ExamOption {
  id: string;
  label: string;
}

interface StudentMark {
  id: string;
  name: string;
  rollNumber: string;
  avatar: string;
  marks: string; // user-entered text
  maxMarks: number;
  status: 'entered' | 'pending';
}

// ── Demo Data ──
const DEMO_TIMETABLE: TimetableEntry[] = [
  { id: 't1', teacher_id: 'demo-teacher', subject: 'Mathematics', class_name: 'Class 10A', room: '204', start_time: '09:00', end_time: '09:45', day: 'monday', school_id: 'demo-school' },
  { id: 't2', teacher_id: 'demo-teacher', subject: 'Science', class_name: 'Class 9C', room: 'Lab 02', start_time: '11:30', end_time: '12:15', day: 'monday', school_id: 'demo-school' },
  { id: 't3', teacher_id: 'demo-teacher', subject: 'English', class_name: 'Class 10A', room: '204', start_time: '14:00', end_time: '14:45', day: 'monday', school_id: 'demo-school' },
];

const DEMO_EXAMS: ExamOption[] = [
  { id: 'e1', label: 'Mid-Term Examination 2025' },
  { id: 'e2', label: 'Unit Test 3 - 2025' },
  { id: 'e3', label: 'Pre-Board Examination 2026' },
  { id: 'e4', label: 'Final Examination 2026' },
];

const DEMO_STUDENTS: Record<string, StudentMark[]> = {
  'Mathematics|Class 10A': [
    { id: 's1', name: 'Arjun Sharma', rollNumber: '20230101', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', marks: '85', maxMarks: 100, status: 'entered' },
    { id: 's2', name: 'Diya Kapoor', rollNumber: '20230102', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', marks: '92', maxMarks: 100, status: 'entered' },
    { id: 's3', name: 'Rohan Mehta', rollNumber: '20230103', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's4', name: 'Priya Singh', rollNumber: '20230104', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's5', name: 'Aditya Patel', rollNumber: '20230105', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
  ],
  'Science|Class 9C': [
    { id: 's6', name: 'Kavya Joshi', rollNumber: '20230201', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', marks: '78', maxMarks: 100, status: 'entered' },
    { id: 's7', name: 'Rahul Nair', rollNumber: '20230202', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's8', name: 'Ananya Gupta', rollNumber: '20230203', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
  ],
  'English|Class 10A': [
    { id: 's9', name: 'Arjun Sharma', rollNumber: '20230101', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's10', name: 'Diya Kapoor', rollNumber: '20230102', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's11', name: 'Rohan Mehta', rollNumber: '20230103', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
  ],
};

export default function UploadMarksScreen() {
  const { profile } = useUser();

  const [subjectClasses, setSubjectClasses] = useState<SubjectClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<SubjectClass | null>(null);
  const [showClassPicker, setShowClassPicker] = useState(false);

  const [selectedExam, setSelectedExam] = useState<ExamOption>(DEMO_EXAMS[0]);
  const [showExamPicker, setShowExamPicker] = useState(false);

  const [students, setStudents] = useState<StudentMark[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Hide bottom tab bar when picker modals are open
  const navigation = useNavigation();
  useEffect(() => {
    const parent = navigation.getParent();
    if (showClassPicker || showExamPicker) {
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      parent?.setOptions({ tabBarStyle: undefined });
    }
  }, [showClassPicker, showExamPicker, navigation]);

  // Load timetable-based class options
  useEffect(() => {
    const load = async () => {
      let timetable: TimetableEntry[] = [];
      if (profile?.id) {
        timetable = await getTimetableForTeacher(profile.id);
        if (timetable.length === 0 && profile.school_id === 'demo-school') {
          timetable = DEMO_TIMETABLE;
        }
      }
      const seen = new Set<string>();
      const opts: SubjectClass[] = [];
      for (const entry of timetable) {
        const key = `${entry.subject}|${entry.class_name}`;
        if (!seen.has(key)) {
          seen.add(key);
          opts.push({
            label: `${entry.subject} - ${entry.class_name}`,
            subject: entry.subject,
            className: entry.class_name,
          });
        }
      }
      setSubjectClasses(opts);
      if (opts.length > 0) setSelectedClass(opts[0]);
    };
    load();
  }, [profile]);

  // Load students when selection changes
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    const key = `${selectedClass.subject}|${selectedClass.className}`;
    const demoStudents = DEMO_STUDENTS[key];
    if (demoStudents) {
      // Deep clone so edits don't mutate the constant
      setStudents(demoStudents.map((s) => ({ ...s })));
    } else {
      setStudents([]);
    }
  }, [selectedClass, selectedExam]);

  const enteredCount = students.filter((s) => s.marks.trim() !== '').length;

  const updateMark = (studentId: string, value: string) => {
    // Allow only digits
    const cleaned = value.replace(/[^0-9]/g, '');
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, marks: cleaned, status: cleaned.trim() ? 'entered' : 'pending' }
          : s
      )
    );
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Marks have been saved as draft. You can continue editing later.');
  };

  const handleSubmit = () => {
    const pending = students.filter((s) => s.marks.trim() === '');
    if (pending.length > 0) {
      Alert.alert(
        'Incomplete Marks',
        `${pending.length} student(s) still have pending marks. Do you want to submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: doSubmit },
        ]
      );
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    Alert.alert('Success', 'Marks have been submitted successfully!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Class & Section Selector */}
        <Text style={styles.label}>Class & Section</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowClassPicker(true)}
        >
          <Text style={styles.selectorText}>
            {selectedClass?.label ?? 'Select class'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Exam Type Selector */}
        <Text style={styles.label}>Exam Type</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowExamPicker(true)}
        >
          <Text style={styles.selectorText}>
            {selectedExam.label}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Student List Header */}
        <View style={styles.studentHeader}>
          <Text style={styles.studentHeaderTitle}>Student List</Text>
          <Text style={styles.studentCount}>
            {enteredCount} OF {students.length} ENTERED
          </Text>
        </View>

        {/* Student Cards */}
        {students.map((student, idx) => {
          const isPending = student.marks.trim() === '';
          return (
            <View
              key={student.id}
              style={[
                styles.studentCard,
                isPending && styles.studentCardPending,
              ]}
            >
              {/* Avatar with roll number badge */}
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: student.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.rollBadge}>
                  <Text style={styles.rollBadgeText}>#{String(idx + 1).padStart(2, '0')}</Text>
                </View>
              </View>

              {/* Name & Roll */}
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                {isPending ? (
                  <Text style={styles.pendingText}>Pending entry</Text>
                ) : (
                  <Text style={styles.rollText}>Roll Number: {student.rollNumber}</Text>
                )}
              </View>

              {/* Marks Input */}
              <View style={styles.marksContainer}>
                <TextInput
                  style={[
                    styles.marksInput,
                    isPending && styles.marksInputPending,
                    !isPending && styles.marksInputFilled,
                  ]}
                  value={student.marks}
                  onChangeText={(val) => updateMark(student.id, val)}
                  keyboardType="number-pad"
                  maxLength={3}
                  placeholder="..."
                  placeholderTextColor={colors.textLight}
                />
                <Text style={styles.maxMarksText}>/ {student.maxMarks}</Text>
              </View>
            </View>
          );
        })}

        {students.length > 3 && (
          <Text style={styles.scrollHint}>Scroll for more students</Text>
        )}

        {students.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={50} color={colors.textLight} />
            <Text style={styles.emptyText}>No students found</Text>
            <Text style={styles.emptySubText}>Select a class to view student list</Text>
          </View>
        )}

        {/* Spacer for bottom bar */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      {students.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft}>
            <Ionicons name="save-outline" size={18} color={colors.primary} />
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Submit Marks</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Class Picker Modal */}
      <Modal visible={showClassPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowClassPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Class & Section</Text>
            {subjectClasses.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={[
                  styles.modalOption,
                  selectedClass?.label === opt.label && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setSelectedClass(opt);
                  setShowClassPicker(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons
                    name="school-outline"
                    size={20}
                    color={selectedClass?.label === opt.label ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedClass?.label === opt.label && { color: colors.primary, fontWeight: '600' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </View>
                {selectedClass?.label === opt.label && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Exam Picker Modal */}
      <Modal visible={showExamPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExamPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Exam Type</Text>
            {DEMO_EXAMS.map((exam) => (
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={selectedExam.id === exam.id ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedExam.id === exam.id && { color: colors.primary, fontWeight: '600' },
                    ]}
                  >
                    {exam.label}
                  </Text>
                </View>
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
  content: { padding: spacing.xl },

  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  // Selector dropdowns
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  selectorText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Student list header
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  studentHeaderTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  studentCount: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },

  // Student card
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: colors.border,
  },
  studentCardPending: {
    backgroundColor: '#FAFBFF',
    borderColor: colors.primary + '30',
    borderStyle: 'dashed',
  },

  // Avatar
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
  },
  rollBadge: {
    position: 'absolute',
    bottom: -4,
    left: -2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  rollBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
  },

  // Student info
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rollText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  pendingText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: 1,
  },

  // Marks input
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marksInput: {
    width: 52,
    height: 40,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  marksInputPending: {
    borderColor: colors.primary + '50',
    borderStyle: 'dashed',
    backgroundColor: colors.background,
  },
  marksInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  maxMarksText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },

  // Scroll hint
  scrollHint: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  emptySubText: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  draftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  draftBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  submitBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    gap: spacing.xs,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.white,
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
