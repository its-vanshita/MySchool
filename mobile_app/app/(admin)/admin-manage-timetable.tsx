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
  Platform,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAdminTeacherTimetable,
  useAdminStudentTimetable,
} from '../../src/hooks/useAdminTimetable';
import { useClasses } from '../../src/hooks/useClasses';
import { useSharedUsers } from '../../src/hooks/useSharedUsers';
import type { DayOfWeek } from '../../src/types';

const BRAND_NAVY = '#153462';
const BRAND_NAVY_LIGHT = '#2563EB';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const STATUS_RED = '#DC2626';

const { width } = Dimensions.get('window');

const DAY_OPTIONS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
];

export default function AdminManageTimetableScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
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
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [isSupplementary, setIsSupplementary] = useState(false);
  const [note, setNote] = useState('');

  const resetForm = () => {
    setSelectedTeacherId('');
    setSelectedClass('');
    setSubject('');
    setTeacherName('');
    setStartTime('');
    setEndTime('');
    setRoom('');
    setIsSupplementary(false);
    setNote('');
  };

  const handleCreate = () => {
    if (targetType === 'teacher' && !selectedTeacherId) {
      return Alert.alert('Error', 'Please select a teacher.');
    }
    if (!selectedClass) {
      return Alert.alert('Error', 'Please select a class.');
    }
    if (!subject.trim() || !startTime.trim() || !endTime.trim()) {
      return Alert.alert('Error', 'Subject, Start Time, and End Time are required.');
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
    try {
      const [h, m] = time.split(':').map(Number);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 || 12;
      return `${hr}:${m.toString().padStart(2, '0')} ${suffix}`;
    } catch {
      return time;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={[styles.headerArea, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Manage Timetable</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, targetType === 'teacher' && styles.toggleBtnActive]}
            onPress={() => setTargetType('teacher')}
            activeOpacity={0.8}
          >
            <Ionicons name="school" size={16} color={targetType === 'teacher' ? BRAND_NAVY : '#E2E8F0'} />
            <Text style={[styles.toggleText, targetType === 'teacher' && styles.toggleTextActive]}>
              Staff Timetable
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, targetType === 'student' && styles.toggleBtnActive]}
            onPress={() => setTargetType('student')}
            activeOpacity={0.8}
          >
            <Ionicons name="people" size={16} color={targetType === 'student' ? BRAND_NAVY : '#E2E8F0'} />
            <Text style={[styles.toggleText, targetType === 'student' && styles.toggleTextActive]}>
              Class Timetable
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {targetType === 'teacher' ? 'Active Teacher Entries' : 'Active Class Entries'}    
            </Text>
            <View style={styles.badgeWrap}>
              <Text style={styles.sectionCount}>{currentEntries.length}</Text>
            </View>
          </View>

          {currentEntries.length === 0 && !showForm ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={40} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No schedules found</Text>
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
                  {isSup && <View style={styles.supStrip} />}
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
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={18} color={STATUS_RED} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.entryDetailsGrid}>
                    <View style={styles.entryDetailBox}>
                      <Ionicons name="calendar" size={16} color={BRAND_NAVY_LIGHT} />
                      <Text style={styles.entryDetailText}>
                        {DAY_OPTIONS.find((d) => d.key === entryData.day)?.label} 
                      </Text>
                    </View>
                    <View style={styles.entryDetailBox}>
                      <Ionicons name="time" size={16} color={BRAND_NAVY_LIGHT} />
                      <Text style={styles.entryDetailText}>
                        {formatTime12(entryData.start_time)} – {formatTime12(entryData.end_time)}
                      </Text>
                    </View>
                    <View style={styles.entryDetailBox}>
                      <Ionicons name="location" size={16} color={BRAND_NAVY_LIGHT} />
                      <Text style={styles.entryDetailText}>{entryData.room}</Text>
                    </View>
                  </View>

                  <View style={styles.entryMetaRow}>
                    {isTeacher ? (
                      <>
                        <View style={styles.metaItem}>
                          <Text style={styles.metaLabel}>Teacher:</Text>
                          <Text style={styles.metaValue}>{teachers.find((t) => t.id === entryData.teacher_id)?.name || entryData.teacher_id}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Text style={styles.metaLabel}>Class:</Text>
                          <Text style={styles.metaValue}>{entryData.class_name}</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.metaItem}>
                          <Text style={styles.metaLabel}>Class:</Text>
                          <Text style={styles.metaValue}>{entryData.class_name}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Text style={styles.metaLabel}>Teacher:</Text>
                          <Text style={styles.metaValue}>{entryData.teacher_name}</Text>
                        </View>
                      </>
                    )}
                  </View>

                  {entryData.note && (
                    <View style={styles.noteRow}>
                      <Ionicons name="information-circle-outline" size={16} color="#0284C7" />
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
              <View style={styles.formHeader}>
                <Ionicons name="add-circle" size={24} color={BRAND_NAVY} />
                <Text style={styles.formTitle}>
                  Add {targetType === 'teacher' ? 'Staff' : 'Class'} Entry
                </Text>
              </View>

              {/* Teacher selection (for teacher type) */}
              {targetType === 'teacher' && (
                <>
                  <Text style={styles.label}>Select Teacher</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipScrollContent}>
                    {teachersLoading && (
                      <Text style={{ marginVertical: 8, color: SLATE_GREY }}>Loading teachers...</Text>
                    )}
                    {teachers.map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={[styles.chip, selectedTeacherId === t.id && styles.chipActive]}
                        onPress={() => setSelectedTeacherId(t.id)}
                        activeOpacity={0.7}
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipScrollContent}>
                {classesLoading && (
                  <Text style={{ marginVertical: 8, color: SLATE_GREY }}>Loading classes...</Text>
                )}
                {classes.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.chip, selectedClass === c.name && styles.chipActive]}
                    onPress={() => setSelectedClass(c.name)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, selectedClass === c.name && styles.chipTextActive]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.chip, selectedClass === 'All Classes' && styles.chipActive]}
                  onPress={() => setSelectedClass('All Classes')}
                  activeOpacity={0.7}
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
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dayChipText, selectedDay === d.key && styles.dayChipTextActive]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Subject */}
              <Text style={styles.label}>Subject</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Mathematics"
                  placeholderTextColor="#94A3B8"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              {/* Teacher name (student type only) */}
              {targetType === 'student' && (
                <>
                  <Text style={styles.label}>Teacher Name</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Dr. S. Verma"
                      placeholderTextColor="#94A3B8"
                      value={teacherName}
                      onChangeText={setTeacherName}
                    />
                  </View>
                </>
              )}

              {/* Times Row */}
              <View style={styles.timeRow}>
                <View style={styles.timeCol}>
                  <Text style={styles.label}>Start</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={[styles.input, { textAlign: 'center' }]}
                      placeholder="09:00"
                      placeholderTextColor="#94A3B8"
                      value={startTime}
                      onChangeText={setStartTime}
                      maxLength={5}
                    />
                  </View>
                </View>
                <View style={styles.timeCol}>
                  <Text style={styles.label}>End</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={[styles.input, { textAlign: 'center' }]}
                      placeholder="09:45"
                      placeholderTextColor="#94A3B8"
                      value={endTime}
                      onChangeText={setEndTime}
                      maxLength={5}
                    />
                  </View>
                </View>
                <View style={[styles.timeCol, { flex: 1.5 }]}>
                  <Text style={styles.label}>Room</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="204"
                      placeholderTextColor="#94A3B8"
                      value={room}
                      onChangeText={setRoom}
                    />
                  </View>
                </View>
              </View>

              {/* Supplementary toggle */}
              <TouchableOpacity
                style={styles.supToggle}
                onPress={() => setIsSupplementary(!isSupplementary)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, isSupplementary && styles.checkboxActive]}>
                  {isSupplementary && <Ionicons name="checkmark" size={14} color={PURE_WHITE} />}
                </View>
                <Text style={styles.supToggleText}>Mark as Supplementary Class</Text>
              </TouchableOpacity>

              {/* Note (optional) */}
              <Text style={styles.label}>Note (optional)</Text>
              <View style={[styles.inputWrap, { minHeight: 80 }]}>
                <TextInput
                  style={[styles.input, { minHeight: 80, paddingTop: 12 }]}
                  placeholder="Any additional info..."
                  placeholderTextColor="#94A3B8"
                  value={note}
                  onChangeText={setNote}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Actions */}
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelFormBtn}
                  onPress={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelFormBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitFormBtn} onPress={handleCreate} activeOpacity={0.8}>
                  <Ionicons name="save" size={16} color={PURE_WHITE} />
                  <Text style={styles.submitFormBtnText}>Save Entry</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!showForm && (
            <TouchableOpacity 
              style={styles.fabBtn} 
              onPress={() => setShowForm(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color={PURE_WHITE} />
              <Text style={styles.fabBtnText}>Add Timetable Entry</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BG_LIGHT,
  },
  headerArea: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 4,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 6,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  toggleBtnActive: {
    backgroundColor: PURE_WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  toggleTextActive: {
    color: BRAND_NAVY,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  badgeWrap: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: SLATE_GREY,
  },
  emptyCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    alignItems: 'center',
    padding: 40,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: SLATE_GREY,
    textAlign: 'center',
    lineHeight: 20,
  },
  entryCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    overflow: 'hidden',
  },
  entryCardSup: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  supStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#38BDF8',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  entryHeaderLeft: {
    flex: 1,
    paddingRight: 10,
  },
  supBadge: {
    backgroundColor: '#E0F2FE',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  supBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  entrySubject: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryDetailsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  entryDetailBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryDetailText: {
    fontSize: 13,
    color: DARK_TEXT,
    fontWeight: '600',
  },
  entryMetaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 4,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: SLATE_GREY,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 14,
    color: DARK_TEXT,
    fontWeight: '700',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#0369A1',
    lineHeight: 18,
    fontWeight: '500',
  },

  // Form
  formCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  input: {
    padding: 16,
    fontSize: 15,
    color: DARK_TEXT,
    fontWeight: '500',
  },
  chipScroll: {
    marginBottom: 20,
    marginHorizontal: -24,
  },
  chipScrollContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: BRAND_NAVY,
  },
  chipText: {
    fontSize: 14,
    color: SLATE_GREY,
    fontWeight: '600',
  },
  chipTextActive: {
    color: PURE_WHITE,
    fontWeight: '700',
  },
  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dayChip: {
    width: '30%',
    backgroundColor: PURE_WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  dayChipText: {
    fontSize: 14,
    color: SLATE_GREY,
    fontWeight: '600',
  },
  dayChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCol: {
    flex: 1,
  },
  supToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PURE_WHITE,
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  supToggleText: {
    fontSize: 15,
    color: DARK_TEXT,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelFormBtn: {
    flex: 1,
    backgroundColor: PURE_WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelFormBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: SLATE_GREY,
  },
  submitFormBtn: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: BRAND_NAVY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitFormBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: PURE_WHITE,
  },

  // FAB Base CTA
  fabBtn: {
    flexDirection: 'row',
    backgroundColor: BRAND_NAVY,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  fabBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: PURE_WHITE,
  },
});
