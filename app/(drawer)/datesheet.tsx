import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../src/context/UserContext';
import { useDatesheet } from '../../src/hooks/useDatesheet';
import { useSharedUploadedDatesheets } from '../../src/hooks/useSharedUploadedDatesheets';
import { useTheme } from '../../src/context/ThemeContext';
import { Image } from 'react-native';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { ExamGroup, ExamType } from '../../src/types';

const EXAM_ICONS: Record<ExamType, keyof typeof Ionicons.glyphMap> = {
  'half-yearly': 'document-text',
  'annual': 'trophy',
  'unit-test': 'create',
  'pre-board': 'school',
  'practical': 'flask',
  'other': 'clipboard',
};

const EXAM_COLORS: Record<ExamType, { bg: string; accent: string }> = {
  'half-yearly': { bg: '#E3F2FD', accent: '#1565C0' },
  'annual': { bg: '#D1FAE5', accent: '#059669' },
  'unit-test': { bg: '#EDE9FE', accent: '#7C3AED' },
  'pre-board': { bg: '#FEF3C7', accent: '#D97706' },
  'practical': { bg: '#FCE4EC', accent: '#E91E63' },
  'other': { bg: '#F3F4F6', accent: '#6B7280' },
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (start === end) {
    return `${s.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
  }
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} - ${e.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
  }
  return `${s.getDate()} ${months[s.getMonth()]} - ${e.getDate()} ${months[e.getMonth()]} ${s.getFullYear()}`;
}

function ExamTypeCard({ group }: { group: ExamGroup }) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
const router = useRouter();
  const colorScheme = EXAM_COLORS[group.exam_type] ?? EXAM_COLORS.other;
  const icon = EXAM_ICONS[group.exam_type] ?? 'clipboard';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: '/exam-datesheet',
          params: { examType: group.exam_type },
        })
      }
    >
      <View style={[styles.iconBox, { backgroundColor: colorScheme.bg }]}>
        <Ionicons name={icon} size={28} color={colorScheme.accent} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.examTitle}>{group.label}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>{formatDateRange(group.startDate, group.endDate)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>{group.classes.join(', ')}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statBadge, { backgroundColor: colorScheme.bg }]}>
            <Text style={[styles.statText, { color: colorScheme.accent }]}>
              {group.totalSubjects} Subjects
            </Text>
          </View>
          {group.duties.length > 0 && (
            <View style={[styles.statBadge, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="shield-checkmark" size={11} color="#D97706" />
              <Text style={[styles.statText, { color: '#D97706' }]}>
                {group.duties.length} Duty{group.duties.length > 1 ? ' Days' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );
}

export default function DatesheetScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { profile, isDemo } = useUser();
  const { examGroups, loading } = useDatesheet(profile?.school_id, isDemo);
  const { datesheets } = useSharedUploadedDatesheets();
  const teacherDatesheets = datesheets.filter(d => d.target === 'teacher' || d.target === 'both');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header info */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exam Datesheet</Text>
        <Text style={styles.headerSub}>
          {examGroups.length} examination{examGroups.length !== 1 ? 's' : ''} scheduled
        </Text>
      </View>

      {examGroups.length === 0 && teacherDatesheets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={50} color={colors.textLight} />
          <Text style={styles.emptyText}>No exams scheduled yet</Text>
        </View>
      ) : (
        <FlatList
          data={examGroups}
          keyExtractor={(item) => item.exam_type}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            teacherDatesheets.length > 0 ? (
              <View style={styles.uploadedContainer}>
                <Text style={styles.sectionHeader}>Official Announcements</Text>
                {teacherDatesheets.map(d => (
                  <View key={d.id} style={styles.uploadedCard}>
                    <Image source={{ uri: d.imageUrl }} style={styles.uploadedImage} />
                    <View style={styles.uploadedInfo}>
                      <Text style={styles.uploadedTitle}>{d.title}</Text>
                      <Text style={styles.uploadedDate}>Posted: {new Date(d.datePosted).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))}
                <Text style={[styles.sectionHeader, { marginTop: spacing.md }]}>Upcoming Tracked Exams</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <ExamTypeCard group={item} />}
        />
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  list: { padding: spacing.lg, paddingBottom: 40 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardContent: { flex: 1 },
  examTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  statText: {
    fontSize: 10,
    fontWeight: '700',
  },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textLight, fontSize: fontSize.md, marginTop: spacing.md },

  uploadedContainer: { marginBottom: spacing.md },
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
