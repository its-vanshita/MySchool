import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../../../src/context/UserContext';
import { getClasses } from '../../../src/services/supabaseService';
import { useTheme } from '../../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { ClassInfo, AttendanceStatus } from '../../../src/types';

// Dummy students for demo
const DUMMY_STUDENTS = [
  { id: '1', name: 'Aaron Smith', roll: '10A01', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: '2', name: 'Bella Chen', roll: '10A02', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: '3', name: 'Chris Jordan', roll: '10A03', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: '4', name: 'Diana Prince', roll: '10A04', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: '5', name: 'Ethan Hunt', roll: '10A05', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
  { id: '6', name: 'Fiona Glen', roll: '10A06', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: '7', name: 'George Park', roll: '10A07', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
  { id: '8', name: 'Hannah Lee', roll: '10A08', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
];

const DEMO_CLASSES = ['Grade 10-A', 'Grade 9-C', 'Grade 8-B'];

export default function AttendanceScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { profile, isDemo } = useUser();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo inline attendance state
  const [selectedClass, setSelectedClass] = useState(DEMO_CLASSES[0]);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});

  useEffect(() => {
    if (isDemo) {
      // init all as unmarked
      const map: Record<string, 'present' | 'absent'> = {};
      DUMMY_STUDENTS.forEach((s) => { map[s.id] = 'present'; });
      setAttendance(map);
      setLoading(false);
      return;
    }
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }
    getClasses(profile.school_id).then((data) => {
      setClasses(data);
      setLoading(false);
    });
  }, [profile, isDemo]);

  const toggleStatus = (id: string, status: 'present' | 'absent') => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const map: Record<string, 'present' | 'absent'> = {};
    DUMMY_STUDENTS.forEach((s) => { map[s.id] = 'present'; });
    setAttendance(map);
  };

  const todayFormatted = () => {
    const d = selectedDate;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const onDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Demo mode: show full mark attendance UI inline
  if (isDemo) {
    return (
      <View style={styles.container}>
        {/* Class & Date Picker Row */}
        <View style={styles.pickerRow}>
          <View style={styles.pickerItem}>
            <Text style={styles.pickerLabel}>CLASS</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setShowClassPicker(!showClassPicker)}
            >
              <Text style={styles.pickerBtnText}>{selectedClass}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.pickerItem}>
            <Text style={styles.pickerLabel}>DATE</Text>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={[styles.pickerBtnText, { marginLeft: 6 }]}>{todayFormatted()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Picker */}
        {Platform.OS === 'ios' ? (
          <Modal visible={showDatePicker} transparent animationType="fade">
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Select Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.datePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="inline"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  themeVariant="light"
                />
              </View>
            </View>
          </Modal>
        ) : (
          showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )
        )}

        {/* Class dropdown */}
        {showClassPicker && (
          <View style={styles.dropdown}>
            {DEMO_CLASSES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.dropdownItem, c === selectedClass && styles.dropdownItemActive]}
                onPress={() => { setSelectedClass(c); setShowClassPicker(false); }}
              >
                <Text style={[styles.dropdownItemText, c === selectedClass && { color: colors.primary, fontWeight: '700' }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Students Header */}
        <View style={styles.studentsHeader}>
          <Text style={styles.studentsTitle}>Students ({DUMMY_STUDENTS.length} total)</Text>
          <TouchableOpacity onPress={markAllPresent}>
            <Text style={styles.markAllText}>Mark All Present</Text>
          </TouchableOpacity>
        </View>

        {/* Student List */}
        <FlatList
          data={DUMMY_STUDENTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.studentList}
          renderItem={({ item, index }) => {
            const status = attendance[item.id] || 'present';
            return (
              <View style={styles.studentCard}>
                {/* Number badge */}
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{String(index + 1).padStart(2, '0')}</Text>
                </View>
                {/* Avatar */}
                <Image source={{ uri: item.avatar }} style={styles.studentAvatar} />
                {/* Info */}
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentRoll}>Roll No: {item.roll}</Text>
                </View>
                {/* P / A Buttons */}
                <View style={styles.statusBtns}>
                  <TouchableOpacity
                    style={[
                      styles.statusCircle,
                      status === 'present' && styles.statusCirclePresent,
                    ]}
                    onPress={() => toggleStatus(item.id, 'present')}
                  >
                    <Text style={[
                      styles.statusCircleText,
                      status === 'present' && styles.statusCirclePresentText,
                    ]}>P</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusCircle,
                      status === 'absent' && styles.statusCircleAbsent,
                    ]}
                    onPress={() => toggleStatus(item.id, 'absent')}
                  >
                    <Text style={[
                      styles.statusCircleText,
                      status === 'absent' && styles.statusCircleAbsentText,
                    ]}>A</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />

        {/* Submit */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => Alert.alert('Success', 'Attendance has been submitted!')}
          >
            <Ionicons name="checkmark-done" size={20} color={colors.white} />
            <Text style={styles.submitBtnText}>Submit Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Real mode: class list
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSubtitle}>Select a class to mark attendance</Text>
      </View>

      {classes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={colors.textLight} />
          <Text style={styles.emptyText}>No classes found</Text>
          <Text style={styles.emptySubText}>
            Classes will appear here once assigned by admin
          </Text>
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.classList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.classCard}
              onPress={() =>
                router.push({
                  pathname: '/mark-attendance',
                  params: { classId: item.id, className: item.name },
                })
              }
            >
              <View style={styles.classIcon}>
                <Ionicons name="people" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.classGrade}>
                  Grade {item.grade} {item.section ? `- ${item.section}` : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Header
  headerSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Picker Row
  pickerRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerItem: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  pickerBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Date Picker
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 360,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  datePickerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  datePickerDone: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },

  // Dropdown
  dropdown: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: -1,
  },
  dropdownItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryLight,
  },
  dropdownItemText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  // Students Header
  studentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  studentsTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  markAllText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },

  // Student List
  studentList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  numberText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  studentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: spacing.md,
    backgroundColor: colors.background,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  studentRoll: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  statusBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  statusCircleText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textLight,
  },
  statusCirclePresent: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  statusCirclePresentText: {
    color: colors.white,
  },
  statusCircleAbsent: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  statusCircleAbsentText: {
    color: colors.white,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  submitBtnText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },

  // Class list (real mode)
  classList: { padding: spacing.lg },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
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
  },
  classIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  className: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  classGrade: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
