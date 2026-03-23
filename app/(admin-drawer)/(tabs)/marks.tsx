import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSharedMarks, DEMO_EXAMS } from '../../../src/hooks/useSharedMarks';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

const CLASSES = ['Class 10A', 'Class 9C', 'Class 8B'];
const CLASS_SUBJECTS: Record<string, string[]> = {
  'Class 10A': ['Mathematics', 'English'],
  'Class 9C': ['Science'],
  'Class 8B': ['Social Studies'],
};

export default function AdminUpdateMarksTab() {
  const { store, adminUpdateMarks, adminUnlockPortal } = useSharedMarks();

  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedExam, setSelectedExam] = useState(DEMO_EXAMS[0].id);

  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingMark, setEditingMark] = useState('');

  const subjects = CLASS_SUBJECTS[selectedClass] || [];

  const handleAdminMarkSave = (classKey: string, studentId: string) => {
    if (!editingMark) return;
    adminUpdateMarks(classKey, selectedExam, studentId, editingMark);
    Alert.alert('Success', 'Mark updated successfully by admin override.');
    setEditingStudentId(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.headerTitle}>Update Marks</Text>
        <Text style={styles.subTitle}>View and edit student marks after teacher submission.</Text>

        {/* Global Filters */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {CLASSES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, selectedClass === c && styles.chipSelected]}
                onPress={() => setSelectedClass(c)}
              >
                <Text style={[styles.chipText, selectedClass === c && styles.chipTextSelected]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exam filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {DEMO_EXAMS.map(e => (
              <TouchableOpacity
                key={e.id}
                style={[styles.smallChip, selectedExam === e.id && styles.smallChipSelected]}
                onPress={() => setSelectedExam(e.id)}
              >
                <Text style={[styles.smallChipText, selectedExam === e.id && styles.smallChipTextSelected]}>{e.label}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <View style={{ marginTop: spacing.md }}>
          {subjects.map(subj => {
            const classKey = `${subj}|${selectedClass}`;
            const group = store.find(s => s.classKey === classKey && s.examId === selectedExam);
            
            const deadlinePassed = group?.uploadDeadline ? Date.now() > group.uploadDeadline : false;
            const isLocked = group?.submitted || deadlinePassed;
            
            return (
              <View key={subj} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectTitle}>{subj}</Text>
                  {isLocked ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.lockedBadge, { backgroundColor: deadlinePassed && !group?.submitted ? colors.danger : colors.success }]}>
                        <Ionicons name="lock-closed" size={12} color={colors.white} />
                        <Text style={styles.lockedText}>
                          {deadlinePassed && !group?.submitted ? 'Time Locked' : 'Locked by Teacher'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.unlockBtn}
                        onPress={() => {
                          adminUnlockPortal(classKey, selectedExam, 24);
                          Alert.alert('Portal Unlocked', 'Teacher now has 24 hours to modify and submit marks.');
                        }}
                      >
                        <Ionicons name="time-outline" size={12} color={colors.primary} />
                        <Text style={styles.unlockBtnText}>Unlock 24h</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={{ fontSize: 10, color: colors.warning, fontWeight: '700' }}>PENDING SUBMISSION</Text>
                  )}
                </View>

                {group && group.students.length > 0 ? (
                  group.students.map(st => (
                    <View key={st.id} style={styles.studentMarkRow}>
                      <Text style={styles.studentNameList}>{st.name}</Text>
                      
                      {editingStudentId === `${classKey}|${st.id}` ? (
                        <View style={styles.editMarkWrapper}>
                          <TextInput 
                            style={styles.overrideInput} 
                            value={editingMark}
                            onChangeText={setEditingMark}
                            keyboardType="number-pad"
                            maxLength={3}
                            autoFocus
                          />
                          <TouchableOpacity onPress={() => handleAdminMarkSave(classKey, st.id)}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setEditingStudentId(null)}>
                            <Ionicons name="close-circle" size={24} color={colors.danger} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.scoreActionRow}>
                          <Text style={styles.scoreVal}>
                            {st.marks ? `${st.marks} / ${st.maxMarks}` : '— / 100'}
                          </Text>
                          {isLocked && (
                            <TouchableOpacity onPress={() => { setEditingStudentId(`${classKey}|${st.id}`); setEditingMark(st.marks || ''); }}>
                              <Ionicons name="create-outline" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={{ fontSize: 12, color: colors.textLight, paddingVertical: 8 }}>No marks recorded by the teacher yet.</Text>
                )}
              </View>
            );
          })}
          {subjects.length === 0 && (
             <Text style={{ color: colors.textLight, marginTop: spacing.md }}>No subjects found for this class.</Text>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 100 },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  subTitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  
  filterRow: { marginBottom: spacing.lg },
  chipScroll: { flexDirection: 'row' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextSelected: { color: colors.white },

  smallChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, marginRight: 6,
  },
  smallChipSelected: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  smallChipText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  smallChipTextSelected: { color: colors.white },

  subjectCard: {
    backgroundColor: colors.white, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.md,
    borderWidth: 1, borderColor: colors.border, elevation: 1,
  },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 8, marginBottom: 8 },
  subjectTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  lockedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, gap: 4 },
  lockedText: { fontSize: 9, fontWeight: '700', color: colors.white, textTransform: 'uppercase' },
  
  studentMarkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  studentNameList: { fontSize: 13, color: colors.textPrimary, flex: 1, fontWeight: '500' },
  scoreActionRow: { flexDirection: 'row', alignItems: 'center' },
  scoreVal: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  
  editMarkWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  overrideInput: {
    width: 44, height: 32, borderRadius: 4, borderWidth: 1.5, borderColor: colors.primary,
    textAlign: 'center', fontSize: 14, fontWeight: '700', padding: 0, backgroundColor: colors.primaryLight
  },
  unlockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primaryLight, paddingHorizontal: 6, paddingVertical: 3,
    borderRadius: 4, borderWidth: 1, borderColor: colors.primary
  },
  unlockBtnText: {
    fontSize: 9, fontWeight: '700', color: colors.primary, textTransform: 'uppercase'
  }
});

