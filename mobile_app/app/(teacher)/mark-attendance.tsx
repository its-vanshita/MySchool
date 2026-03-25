import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useAttendance } from '../../src/hooks/useAttendance';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { AttendanceStatus } from '../../src/types';

const getStatusOptions = (colors: any): { value: AttendanceStatus; label: string; icon: string; color: string }[] => [
  { value: 'present', label: 'P', icon: 'checkmark-circle', color: colors.present },
  { value: 'absent', label: 'A', icon: 'close-circle', color: colors.absent },
  { value: 'late', label: 'L', icon: 'time', color: colors.warning },
  { value: 'excused', label: 'E', icon: 'shield-checkmark', color: colors.info },
];

export default function MarkAttendanceScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { classId, className } = useLocalSearchParams<{ classId: string; className: string }>();
  const router = useRouter();
  const { profile } = useUser();
  const { students, records, date, setDate, loading, saving, submitAttendance } =
    useAttendance(classId);

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  // Pre-fill with existing records
  useEffect(() => {
    const map: Record<string, AttendanceStatus> = {};
    records.forEach((r) => {
      map[r.student_id] = r.status;
    });
    // Default all students to present
    students.forEach((s) => {
      if (!map[s.id]) map[s.id] = 'present';
    });
    setAttendance(map);
  }, [records, students]);

  const toggleStatus = (studentId: string) => {
    setAttendance((prev) => {
      const current = prev[studentId] || 'present';
      const idx = getStatusOptions(colors).findIndex((o) => o.value === current);
      const next = getStatusOptions(colors)[(idx + 1) % getStatusOptions(colors).length].value;
      return { ...prev, [studentId]: next };
    });
  };

  const handleSubmit = async () => {
    if (!profile) return;
    const entries = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      status,
    }));
    await submitAttendance(entries, profile.id);
    Alert.alert('Success', 'Attendance has been saved!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{students.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.present }]}>{presentCount}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.absent }]}>{absentCount}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.statLabel}>Date</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {getStatusOptions(colors).map((opt) => (
          <View key={opt.value} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: opt.color }]} />
            <Text style={styles.legendText}>{opt.value}</Text>
          </View>
        ))}
      </View>

      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={50} color={colors.textLight} />
          <Text style={styles.emptyText}>No students in this class</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
const status = attendance[item.id] || 'present';
            const opt = getStatusOptions(colors).find((o) => o.value === status)!;
            return (
              <TouchableOpacity
                style={[styles.studentRow, index % 2 === 0 && styles.studentRowAlt]}
                onPress={() => toggleStatus(item.id)}
              >
                <Text style={styles.rollNo}>{item.roll_number || (index + 1)}</Text>
                <Text style={styles.studentName}>{item.name}</Text>
                <View style={[styles.statusBtn, { backgroundColor: opt.color + '20' }]}>
                  <Ionicons name={opt.icon as any} size={20} color={opt.color} />
                  <Text style={[styles.statusBtnText, { color: opt.color }]}>{opt.label}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-done" size={20} color={colors.white} />
              <Text style={styles.submitBtnText}>Submit Attendance</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  dateText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: fontSize.xs, color: colors.textSecondary, textTransform: 'capitalize' },
  list: { padding: spacing.lg },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  studentRowAlt: { backgroundColor: colors.background },
  rollNo: {
    width: 32,
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  studentName: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  statusBtnText: { fontSize: fontSize.sm, fontWeight: '700' },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitBtn: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textLight, fontSize: fontSize.md, marginTop: spacing.md },
});
