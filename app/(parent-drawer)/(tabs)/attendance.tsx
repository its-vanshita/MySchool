import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Demo attendance data for the child
const DEMO_ATTENDANCE: Record<string, { date: string; status: 'present' | 'absent' | 'late' | 'excused' }[]> = {
  'Mar 2026': [
    { date: '2026-03-02', status: 'present' },
    { date: '2026-03-03', status: 'present' },
    { date: '2026-03-04', status: 'present' },
    { date: '2026-03-05', status: 'absent' },
    { date: '2026-03-06', status: 'present' },
    { date: '2026-03-07', status: 'present' },
    { date: '2026-03-09', status: 'present' },
    { date: '2026-03-10', status: 'present' },
  ],
  'Feb 2026': [
    { date: '2026-02-02', status: 'present' },
    { date: '2026-02-03', status: 'present' },
    { date: '2026-02-04', status: 'late' },
    { date: '2026-02-05', status: 'present' },
    { date: '2026-02-06', status: 'present' },
    { date: '2026-02-09', status: 'absent' },
    { date: '2026-02-10', status: 'present' },
    { date: '2026-02-11', status: 'present' },
    { date: '2026-02-12', status: 'present' },
    { date: '2026-02-13', status: 'present' },
    { date: '2026-02-16', status: 'present' },
    { date: '2026-02-17', status: 'present' },
    { date: '2026-02-18', status: 'excused' },
    { date: '2026-02-19', status: 'present' },
    { date: '2026-02-20', status: 'present' },
    { date: '2026-02-23', status: 'present' },
    { date: '2026-02-24', status: 'present' },
    { date: '2026-02-25', status: 'present' },
    { date: '2026-02-26', status: 'absent' },
    { date: '2026-02-27', status: 'present' },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  present: colors.success,
  absent: colors.danger,
  late: colors.warning,
  excused: colors.info,
};

const STATUS_LABELS: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
};

export default function ParentAttendanceScreen() {
  const now = new Date();
  const currentMonthKey = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const monthKeys = Object.keys(DEMO_ATTENDANCE);
  const [selectedMonth, setSelectedMonth] = useState(monthKeys.includes(currentMonthKey) ? currentMonthKey : monthKeys[0]);

  const records = DEMO_ATTENDANCE[selectedMonth] || [];
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const excusedCount = records.filter(r => r.status === 'excused').length;
  const totalDays = records.length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Child Header */}
      <View style={styles.childHeader}>
        <View style={styles.childAvatar}>
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.childName}>Arjun Sharma</Text>
          <Text style={styles.childClass}>Class 10-A • Roll #12</Text>
        </View>
      </View>

      {/* Month Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
        {monthKeys.map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.monthPill, selectedMonth === key && styles.monthPillActive]}
            onPress={() => setSelectedMonth(key)}
          >
            <Text style={[styles.monthPillText, selectedMonth === key && styles.monthPillTextActive]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Overall Stats */}
      <View style={styles.overviewCard}>
        <View style={styles.percentageCircle}>
          <Text style={styles.percentageText}>{percentage}%</Text>
          <Text style={styles.percentageLabel}>Attendance</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: colors.success }]} />
            <Text style={styles.statCount}>{presentCount}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.statCount}>{absentCount}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.statCount}>{lateCount}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: colors.info }]} />
            <Text style={styles.statCount}>{excusedCount}</Text>
            <Text style={styles.statLabel}>Excused</Text>
          </View>
        </View>
      </View>

      {/* Day-by-day list */}
      <Text style={styles.sectionTitle}>Daily Records</Text>
      {records.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={40} color={colors.textLight} />
          <Text style={styles.emptyText}>No attendance records for this month</Text>
        </View>
      ) : (
        records.map((record) => {
          const d = new Date(record.date + 'T00:00:00');
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return (
            <View key={record.date} style={styles.recordRow}>
              <View style={styles.recordDate}>
                <Text style={styles.recordDay}>{d.getDate()}</Text>
                <Text style={styles.recordDayName}>{dayNames[d.getDay()]}</Text>
              </View>
              <View style={styles.recordLine} />
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[record.status] + '20' }]}>
                <View style={[styles.statusDotSmall, { backgroundColor: STATUS_COLORS[record.status] }]} />
                <Text style={[styles.statusText, { color: STATUS_COLORS[record.status] }]}>
                  {STATUS_LABELS[record.status]}
                </Text>
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
  content: { paddingBottom: 100 },

  childHeader: {
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
  childAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  childName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  childClass: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  monthScroll: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    maxHeight: 44,
  },
  monthPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthPillText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthPillTextActive: {
    color: colors.white,
  },

  overviewCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  percentageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xl,
  },
  percentageText: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.success,
  },
  percentageLabel: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: '600',
  },
  statsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    gap: 6,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statCount: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordDate: {
    width: 44,
    alignItems: 'center',
  },
  recordDay: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  recordDayName: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  recordLine: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  statusDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

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
});

