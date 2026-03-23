import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '../../src/context/UserContext';
import { useDatesheet } from '../../src/hooks/useDatesheet';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { ExamEntry, ExamDuty, ExamType } from '../../src/types';

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  'half-yearly': 'Half Yearly Examination',
  'annual': 'Annual Examination',
  'unit-test': 'Unit Test',
  'pre-board': 'Pre-Board Examination',
  'practical': 'Practical Examination',
  'other': 'Examination',
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type TabKey = 'datesheet' | 'my-duty';

function formatTime12(time: string): string {
  if (!time) return '';
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${mStr} ${ampm}`;
}

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface DateSection {
  title: string; // formatted date
  date: string;  // raw date
  data: ExamEntry[];
}

interface DutySection {
  title: string;
  date: string;
  data: ExamDuty[];
}

function ExamRow({ exam }: { exam: ExamEntry }) {
  return (
    <View style={styles.examRow}>
      <View style={styles.examRowLeft}>
        <Text style={styles.subjectName}>{exam.subject}</Text>
        <Text style={styles.className}>{exam.class_name}</Text>
      </View>
      <View style={styles.examRowRight}>
        <View style={styles.timeChip}>
          <Ionicons name="time-outline" size={12} color={colors.primary} />
          <Text style={styles.timeChipText}>
            {formatTime12(exam.start_time)} - {formatTime12(exam.end_time)}
          </Text>
        </View>
        {exam.room ? (
          <View style={styles.roomChip}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.roomChipText}>{exam.room}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function DutyRow({ duty }: { duty: ExamDuty }) {
  return (
    <View style={[styles.examRow, styles.dutyRow]}>
      <View style={styles.dutyIconBox}>
        <Ionicons name="shield-checkmark" size={20} color="#D97706" />
      </View>
      <View style={styles.examRowLeft}>
        <Text style={styles.subjectName}>Invigilation Duty</Text>
        <Text style={styles.className}>{duty.class_name}</Text>
      </View>
      <View style={styles.examRowRight}>
        <View style={styles.timeChip}>
          <Ionicons name="time-outline" size={12} color={colors.primary} />
          <Text style={styles.timeChipText}>
            {formatTime12(duty.start_time)} - {formatTime12(duty.end_time)}
          </Text>
        </View>
        <View style={[styles.roomChip, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="location" size={12} color="#D97706" />
          <Text style={[styles.roomChipText, { color: '#D97706', fontWeight: '700' }]}>
            {duty.room}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function ExamDatesheetScreen() {
  const { examType } = useLocalSearchParams<{ examType: string }>();
  const { profile, isDemo } = useUser();
  const { examGroups, loading } = useDatesheet(profile?.school_id, isDemo);
  const [activeTab, setActiveTab] = useState<TabKey>('datesheet');

  const group = useMemo(
    () => examGroups.find((g) => g.exam_type === examType),
    [examGroups, examType]
  );

  const datesheetSections: DateSection[] = useMemo(() => {
    if (!group) return [];
    const grouped: Record<string, ExamEntry[]> = {};
    group.entries.forEach((e) => {
      if (!grouped[e.exam_date]) grouped[e.exam_date] = [];
      grouped[e.exam_date].push(e);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        title: formatFullDate(date),
        date,
        data,
      }));
  }, [group]);

  const dutySections: DutySection[] = useMemo(() => {
    if (!group) return [];
    const grouped: Record<string, ExamDuty[]> = {};
    group.duties.forEach((d) => {
      if (!grouped[d.exam_date]) grouped[d.exam_date] = [];
      grouped[d.exam_date].push(d);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        title: formatFullDate(date),
        date,
        data,
      }));
  }, [group]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.center}>
        <Ionicons name="clipboard-outline" size={50} color={colors.textLight} />
        <Text style={styles.emptyText}>Exam not found</Text>
      </View>
    );
  }

  const label = EXAM_TYPE_LABELS[(examType as ExamType) ?? 'other'] ?? 'Examination';

  return (
    <View style={styles.container}>
      {/* Summary card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{label}</Text>
        <View style={styles.summaryMeta}>
          <View style={styles.summaryItem}>
            <Ionicons name="book-outline" size={14} color={colors.white} />
            <Text style={styles.summaryItemText}>{group.totalSubjects} Subjects</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="people-outline" size={14} color={colors.white} />
            <Text style={styles.summaryItemText}>{group.classes.length} Classes</Text>
          </View>
          {group.duties.length > 0 && (
            <View style={styles.summaryItem}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.white} />
              <Text style={styles.summaryItemText}>{group.duties.length} Duty Days</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'datesheet' && styles.tabActive]}
          onPress={() => setActiveTab('datesheet')}
        >
          <Ionicons
            name="document-text-outline"
            size={16}
            color={activeTab === 'datesheet' ? colors.primary : colors.textLight}
          />
          <Text style={[styles.tabText, activeTab === 'datesheet' && styles.tabTextActive]}>
            Datesheet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-duty' && styles.tabActive]}
          onPress={() => setActiveTab('my-duty')}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={activeTab === 'my-duty' ? colors.primary : colors.textLight}
          />
          <Text style={[styles.tabText, activeTab === 'my-duty' && styles.tabTextActive]}>
            My Duty
          </Text>
          {group.duties.length > 0 && (
            <View style={styles.dutyBadge}>
              <Text style={styles.dutyBadgeText}>{group.duties.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content based on tab */}
      {activeTab === 'datesheet' ? (
        datesheetSections.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No exams in datesheet</Text>
          </View>
        ) : (
          <SectionList
            sections={datesheetSections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <View style={styles.dateDot} />
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            renderItem={({ item }) => <ExamRow exam={item} />}
            stickySectionHeadersEnabled={false}
          />
        )
      ) : dutySections.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="shield-outline" size={50} color={colors.textLight} />
          <Text style={styles.emptyText}>No duty assigned for this exam</Text>
        </View>
      ) : (
        <SectionList
          sections={dutySections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View style={[styles.dateDot, { backgroundColor: '#D97706' }]} />
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => <DutyRow duty={item} />}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  /* Summary */
  summaryCard: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  summaryTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  summaryMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summaryItemText: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },

  /* Tabs */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.primary,
  },
  dutyBadge: {
    backgroundColor: '#D97706',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  dutyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },

  /* List */
  list: { padding: spacing.lg, paddingBottom: 40 },

  /* Section header (date) */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  sectionHeaderText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  /* Exam rows */
  examRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    alignItems: 'center',
  },
  dutyRow: {
    borderLeftWidth: 3,
    borderLeftColor: '#D97706',
  },
  dutyIconBox: {
    marginRight: spacing.md,
  },
  examRowLeft: { flex: 1 },
  subjectName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  className: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  examRowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  timeChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  roomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.divider,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  roomChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  emptyText: { color: colors.textLight, fontSize: fontSize.md, marginTop: spacing.md },
});
