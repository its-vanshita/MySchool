import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useAdminTeacherTimetable,
  useAdminStudentTimetable,
} from '../../src/hooks/useAdminTimetable';
import { useClasses } from '../../src/hooks/useClasses';
import { useSharedUsers } from '../../src/hooks/useSharedUsers';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { DayOfWeek } from '../../src/types';

const DAY_OPTIONS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
];

export default function AdminManageTimetableScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  // Tab: teacher or student
  const [targetType, setTargetType] = useState<'teacher' | 'student'>('teacher');

  const { classes, loading: classesLoading } = useClasses();
  const { teachers, loading: teachersLoading } = useSharedUsers();

  // Hooks
  const {
    entries: teacherEntries,
    addEntry: addTeacherEntry,
    deleteEntry: deleteTeacherEntry,
  } = useAdminTeacherTimetable();

  const {
    entries: studentEntries,
    addEntry: addStudentEntry,
    deleteEntry: deleteStudentEntry,
  } = useAdminStudentTimetable();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Set default class when classes are loaded
  React.useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].name);
    }
  }, [classes, selectedClass]);

  // Set default teacher when teachers are loaded
  React.useEffect(() => {
    if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers, selectedTeacherId]);

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [isSupplementary, setIsSupplementary] = useState(false);
  const [note, setNote] = useState('');

  const resetForm = () => {
    setSubject('');
    setRoom('');
    setStartTime('');
    setEndTime('');
    setTeacherName('');
    setIsSupplementary(false);
    setNote('');
  };

  const handleAddEntry = () => {
    if (!subject.trim()) {
      Alert.alert('Missing', 'Please enter a subject.');
      return;
    }
    if (!startTime.trim() || !endTime.trim()) {
      Alert.alert('Missing', 'Please enter start and end times (e.g. 09:00).');
      return;
    }
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert('Invalid Time', 'Use HH:MM format (e.g. 09:00, 14:30).');
      return;
    }

    if (targetType === 'teacher') {
      addTeacherEntry({
        teacher_id: selectedTeacherId,
        subject: isSupplementary ? `${subject.trim()} (Supplementary)` : subject.trim(),
        class_name: selectedClass,
        room: room.trim() || 'TBD',
        start_time: startTime,
        end_time: endTime,
        day: selectedDay,
        school_id: 'demo-school',
      });
    } else {
      addStudentEntry({
        class_name: selectedClass,
        subject: isSupplementary ? `${subject.trim()} (Supplementary)` : subject.trim(),
        teacher_name: teacherName.trim() || 'TBA',
        room: room.trim() || 'TBD',
        start_time: startTime,
        end_time: endTime,
        day: selectedDay,
        school_id: 'demo-school',
        is_supplementary: isSupplementary,
        note: note.trim() || undefined,
      });
    }

    Alert.alert('Success', `Timetable entry added for ${targetType === 'teacher' ? 'teacher' : 'students'}!`);
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Entry', 'Remove this timetable entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (targetType === 'teacher') deleteTeacherEntry(id);
          else deleteStudentEntry(id);
        },
      },
    ]);
  };

  const currentEntries = targetType === 'teacher' ? teacherEntries : studentEntries;

  const formatTime12 = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    return `${hr}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  const selectedTeacherName = teachers.find((t) => t.id === selectedTeacherId)?.name || '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Target Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, targetType === 'teacher' && styles.toggleBtnActive]}
            onPress={() => setTargetType('teacher')}
          >
            <Ionicons
              name="school"
              size={18}
              color={targetType === 'teacher' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.toggleText, targetType === 'teacher' && styles.toggleTextActive]}>
              Teacher Timetable
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, targetType === 'student' && styles.toggleBtnActive]}
            onPress={() => setTargetType('student')}
          >
            <Ionicons
              name="people"
              size={18}
              color={targetType === 'student' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.toggleText, targetType === 'student' && styles.toggleTextActive]}>
              Class Timetable
            </Text>
          </TouchableOpacity>
        </View>

        {/* Existing Entries */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {targetType === 'teacher' ? 'Teacher Entries' : 'Class Entries'}
          </Text>
          <Text style={styles.sectionCount}>{currentEntries.length} total</Text>
        </View>

        {currentEntries.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={36} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the button below to add a new {targetType === 'teacher' ? 'teacher' : 'class'} timetable entry.
            </Text>
          </View>
        ) : (
          currentEntries.map((entry) => {
            const isTeacher = targetType === 'teacher';
            const entryData = entry as any;
            const isSup = entryData.is_supplementary || entryData.subject?.includes('Supplementary');
            return (
              <View key={entry.id} style={[styles.entryCard, isSup && styles.entryCardSup]}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryHeaderLeft}>
                    {isSup && (
                      <View style={styles.supBadge}>
                        <Text style={styles.supBadgeText}>SUPPLEMENTARY</Text>
                      </View>
                    )}
                    <Text style={styles.entrySubject}>{entryData.subject}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(entry.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </TouchableOpacity>
                </View>

                <View style={styles.entryDetails}>
                  <View style={styles.entryDetailItem}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
                    <Text style={styles.entryDetailText}>
                      {DAY_OPTIONS.find((d) => d.key === entryData.day)?.label}
                    </Text>
                  </View>
                  <View style={styles.entryDetailItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textLight} />
                    <Text style={styles.entryDetailText}>
                      {formatTime12(entryData.start_time)} – {formatTime12(entryData.end_time)}
                    </Text>
                  </View>
                  <View style={styles.entryDetailItem}>
                    <Ionicons name="business-outline" size={14} color={colors.textLight} />
                    <Text style={styles.entryDetailText}>{entryData.room}</Text>
                  </View>
                </View>

                <View style={styles.entryMeta}>
                  {isTeacher ? (
                    <>
                      <Text style={styles.entryMetaLabel}>
                        Teacher: {teachers.find((t) => t.id === entryData.teacher_id)?.name || entryData.teacher_id}
                      </Text>
                      <Text style={styles.entryMetaLabel}>Class: {entryData.class_name}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.entryMetaLabel}>Class: {entryData.class_name}</Text>
                      <Text style={styles.entryMetaLabel}>Teacher: {entryData.teacher_name}</Text>
                    </>
                  )}
                </View>

                {entryData.note && (
                  <View style={styles.noteRow}>
                    <Ionicons name="information-circle-outline" size={14} color={colors.info} />
                    <Text style={styles.noteText}>{entryData.note}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* Add Entry Form */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              Add {targetType === 'teacher' ? 'Teacher' : 'Class'} Timetable Entry
            </Text>

            {/* Teacher selection (for teacher type) */}
            {targetType === 'teacher' && (
              <>
                <Text style={styles.label}>Select Teacher</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {teachersLoading && (
                    <Text style={{ marginVertical: 8, color: colors.textLight }}>Loading teachers...</Text>
                  )}
                  {teachers.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.chip, selectedTeacherId === t.id && styles.chipActive]}
                      onPress={() => setSelectedTeacherId(t.id)}
                    >
                      <Text style={[styles.chipText, selectedTeacherId === t.id && styles.chipTextActive]}>
                        {t.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* Class selection */}
            <Text style={styles.label}>Select Class</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {classesLoading && (
                <Text style={{ marginVertical: 8, color: colors.textLight }}>Loading classes...</Text>
              )}
              {classes.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.chip, selectedClass === c.name && styles.chipActive]}
                  onPress={() => setSelectedClass(c.name)}
                >
                  <Text style={[styles.chipText, selectedClass === c.name && styles.chipTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.chip, selectedClass === 'All Classes' && styles.chipActive]}
                onPress={() => setSelectedClass('All Classes')}
              >
                <Text style={[styles.chipText, selectedClass === 'All Classes' && styles.chipTextActive]}>
                  All Classes
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Day selection */}
            <Text style={styles.label}>Day</Text>
            <View style={styles.dayRow}>
              {DAY_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.dayChip, selectedDay === d.key && styles.dayChipActive]}
                  onPress={() => setSelectedDay(d.key)}
                >
                  <Text style={[styles.dayChipText, selectedDay === d.key && styles.dayChipTextActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject */}
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics"
              placeholderTextColor={colors.textLight}
              value={subject}
              onChangeText={setSubject}
            />

            {/* Teacher name (student type only) */}
            {targetType === 'student' && (
              <>
                <Text style={styles.label}>Teacher Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Dr. S. Verma"
                  placeholderTextColor={colors.textLight}
                  value={teacherName}
                  onChangeText={setTeacherName}
                />
              </>
            )}

            {/* Times */}
            <View style={styles.timeRow}>
              <View style={styles.timeCol}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  placeholderTextColor={colors.textLight}
                  value={startTime}
                  onChangeText={setStartTime}
                  maxLength={5}
                />
              </View>
              <View style={styles.timeCol}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:45"
                  placeholderTextColor={colors.textLight}
                  value={endTime}
                  onChangeText={setEndTime}
                  maxLength={5}
                />
              </View>
            </View>

            {/* Room */}
            <Text style={styles.label}>Room</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Room 204"
              placeholderTextColor={colors.textLight}
              value={room}
              onChangeText={setRoom}
            />

            {/* Supplementary toggle */}
            <TouchableOpacity
              style={styles.supToggle}
              onPress={() => setIsSupplementary(!isSupplementary)}
            >
              <View style={[styles.checkbox, isSupplementary && styles.checkboxActive]}>
                {isSupplementary && <Ionicons name="checkmark" size={14} color={colors.white} />}
              </View>
              <Text style={styles.supToggleText}>Mark as Supplementary Class</Text>
            </TouchableOpacity>

            {/* Note (optional) */}
            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              placeholder="Any additional info..."
              placeholderTextColor={colors.textLight}
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
            />

            {/* Actions */}
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelFormBtn}
                onPress={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelFormBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFormBtn} onPress={handleAddEntry}>
                <Ionicons name="add-circle" size={20} color={colors.white} />
                <Text style={styles.addFormBtnText}>Add Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      {!showForm && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: spacing.lg, paddingBottom: 100 },

  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.white,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Empty
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Entry Card
  entryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  entryCardSup: {
    borderLeftColor: '#F59E0B',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  entryHeaderLeft: {
    flex: 1,
  },
  supBadge: {
    backgroundColor: '#FFFBEB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  supBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  entrySubject: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
  entryDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  entryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryDetailText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  entryMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  entryMetaLabel: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  noteText: {
    fontSize: fontSize.xs,
    color: colors.info,
    fontWeight: '500',
    flex: 1,
  },

  // Form
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  formTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipScroll: {
    marginBottom: spacing.xs,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.primary, fontWeight: '700' },

  dayRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  dayChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: '#F3F4F6',
  },
  dayChipActive: {
    backgroundColor: colors.primary,
  },
  dayChipText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  dayChipTextActive: {
    color: colors.white,
  },

  input: {
    backgroundColor: '#F8F9FB',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeCol: {
    flex: 1,
  },

  supToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  supToggleText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  formActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelFormBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: '#F3F4F6',
  },
  cancelFormBtnText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  addFormBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    gap: spacing.sm,
  },
  addFormBtnText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.white,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});

