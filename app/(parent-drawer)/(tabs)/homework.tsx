import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomework } from '../../../src/hooks/useHomework';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { Homework } from '../../../src/types';

const SUBJECT_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  Mathematics: { color: '#1565C0', bg: '#E3F2FD', icon: 'calculator' },
  Science: { color: '#2E7D32', bg: '#E8F5E9', icon: 'flask' },
  English: { color: '#7B1FA2', bg: '#F3E5F5', icon: 'book' },
  Hindi: { color: '#E65100', bg: '#FFF3E0', icon: 'language' },
  'Social Studies': { color: '#00838F', bg: '#E0F7FA', icon: 'earth' },
  'Computer Science': { color: '#AD1457', bg: '#FCE4EC', icon: 'laptop' },
  Other: { color: '#546E7A', bg: '#ECEFF1', icon: 'document-text' },
};

function getSubjectConfig(subject: string) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS['Other'];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Demo homework for when DB returns empty
const DEMO_HOMEWORK: Homework[] = [
  {
    id: 'demo-1',
    teacher_id: 'demo',
    class_id: 'demo',
    class_name: 'Class 8-B',
    subject: 'Mathematics',
    title: 'Algebra Worksheet',
    description: 'Complete exercises 1-10 from the Chapter 4 workbook focusing on linear equations and inequalities.',
    due_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      return d.toISOString().split('T')[0];
    })(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    teacher_id: 'demo',
    class_id: 'demo',
    class_name: 'Class 8-B',
    subject: 'Science',
    title: 'Plant Cells Diagram',
    description: 'Draw and label a plant cell including chloroplasts, cell wall, and vacuole on an A4 sheet.',
    due_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 6);
      return d.toISOString().split('T')[0];
    })(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    teacher_id: 'demo',
    class_id: 'demo',
    class_name: 'Class 8-B',
    subject: 'English',
    title: 'Essay: Modern Literature',
    description: 'Write a 500-word essay on the impact of technology on modern narrative structures.',
    due_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 12);
      return d.toISOString().split('T')[0];
    })(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    teacher_id: 'demo',
    class_id: 'demo',
    class_name: 'Class 8-B',
    subject: 'Hindi',
    title: 'Kavya Sangrah - Poem Analysis',
    description: 'Read the poem "Veer Ras" and write a summary with key literary devices used.',
    due_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      return d.toISOString().split('T')[0];
    })(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    teacher_id: 'demo',
    class_id: 'demo',
    class_name: 'Class 8-B',
    subject: 'Social Studies',
    title: 'Indian Constitution Project',
    description: 'Prepare a chart on Fundamental Rights and Duties as given in the Indian Constitution.',
    due_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 8);
      return d.toISOString().split('T')[0];
    })(),
    created_at: new Date().toISOString(),
  },
];

export default function ParentHomeworkScreen() {
  const { homework: dbHomework, loading } = useHomework(undefined, true);
  const [selectedTab] = useState<'assigned'>('assigned');

  // Use demo data if DB returns empty
  const homework = dbHomework.length > 0 ? dbHomework : DEMO_HOMEWORK;

  // Sort by due date (soonest first)
  const sortedHomework = [...homework].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  const totalCount = sortedHomework.length;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading homework...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Tab Header */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Assigned</Text>
          <View style={styles.tabIndicator} />
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="book" size={18} color={colors.primary} />
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="alert-circle" size={18} color="#EF4444" />
          <Text style={styles.statNumber}>
            {sortedHomework.filter((hw) => {
              const d = new Date(hw.due_date + 'T00:00:00');
              const t = new Date(); t.setHours(0,0,0,0);
              return Math.ceil((d.getTime() - t.getTime()) / 86400000) <= 2;
            }).length}
          </Text>
          <Text style={styles.statLabel}>Due Soon</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={18} color="#10B981" />
          <Text style={styles.statNumber}>
            {sortedHomework.filter((hw) => {
              const d = new Date(hw.due_date + 'T00:00:00');
              const t = new Date(); t.setHours(0,0,0,0);
              return Math.ceil((d.getTime() - t.getTime()) / 86400000) > 2;
            }).length}
          </Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
      </View>

      {/* Homework Cards */}
      {sortedHomework.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="book-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No Homework</Text>
          <Text style={styles.emptySubText}>No homework has been assigned yet</Text>
        </View>
      ) : (
        sortedHomework.map((hw) => (
          <HomeworkCard key={hw.id} hw={hw} />
        ))
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function HomeworkCard({ hw }: { hw: Homework }) {
  const dueDate = new Date(hw.due_date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isDueSoon = daysLeft >= 0 && daysLeft <= 2;
  const isUpcoming = daysLeft > 2;

  const dueDateStr = `${MONTHS[dueDate.getMonth()]} ${String(dueDate.getDate()).padStart(2, '0')}, ${dueDate.getFullYear()}`;
  const config = getSubjectConfig(hw.subject);

  // Due badge text
  let dueBadgeText = '';
  let dueBadgeColor = '';
  let dueBadgeBg = '';
  if (daysLeft < 0) {
    dueBadgeText = `Overdue`;
    dueBadgeColor = '#EF4444';
    dueBadgeBg = '#FEE2E2';
  } else if (daysLeft === 0) {
    dueBadgeText = 'Due Today';
    dueBadgeColor = '#EF4444';
    dueBadgeBg = '#FEE2E2';
  } else if (daysLeft === 1) {
    dueBadgeText = 'Due Tomorrow';
    dueBadgeColor = '#E65100';
    dueBadgeBg = '#FFF3E0';
  } else if (daysLeft <= 3) {
    dueBadgeText = `Due in ${daysLeft} days`;
    dueBadgeColor = '#E65100';
    dueBadgeBg = '#FFF3E0';
  } else {
    dueBadgeText = 'Upcoming';
    dueBadgeColor = colors.primary;
    dueBadgeBg = '#E3F2FD';
  }

  return (
    <View style={[styles.hwCard, { borderLeftColor: config.color }]}>
      {/* Subject Row + Due Badge */}
      <View style={styles.hwTopRow}>
        <View style={styles.subjectRow}>
          <View style={[styles.subjectDot, { backgroundColor: config.color }]} />
          <Text style={[styles.subjectText, { color: config.color }]}>
            {hw.subject.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.dueBadge, { backgroundColor: dueBadgeBg }]}>
          <Text style={[styles.dueBadgeText, { color: dueBadgeColor }]}>
            {dueBadgeText}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.hwTitle}>{hw.title}</Text>

      {/* Description */}
      {hw.description ? (
        <Text style={styles.hwDesc} numberOfLines={2}>
          {hw.description}
        </Text>
      ) : null}

      {/* Footer: Deadline + View Details */}
      <View style={styles.hwFooter}>
        <View style={styles.deadlineRow}>
          <Text style={styles.deadlineLabel}>DEADLINE</Text>
          <Text style={styles.deadlineDate}>{dueDateStr}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.viewDetailsBtn,
            isDueSoon && { backgroundColor: colors.primary },
            isUpcoming && { backgroundColor: colors.primary },
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.viewDetailsBtnText,
              (isDueSoon || isUpcoming) && { color: '#fff' },
            ]}
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Tab
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: colors.white,
  },
  tab: {
    paddingBottom: 12,
    marginRight: 24,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },

  // Homework Card
  hwCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  hwTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Title
  hwTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },

  // Description
  hwDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },

  // Footer
  hwFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  deadlineRow: {},
  deadlineLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  deadlineDate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewDetailsBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  // Empty
  emptyCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
});
