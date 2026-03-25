import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

const DEMO_SUBJECTS = [
  {
    id: '1',
    subject: 'Mathematics',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    term1: 85,
    term2: 92,
    maxMarks: 100,
    grade: 'A+',
  },
  {
    id: '2',
    subject: 'Science',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    term1: 78,
    term2: 88,
    maxMarks: 100,
    grade: 'A',
  },
  {
    id: '3',
    subject: 'English',
    color: '#E65100',
    bgColor: '#FFF3E0',
    term1: 90,
    term2: 85,
    maxMarks: 100,
    grade: 'A',
  },
  {
    id: '4',
    subject: 'Hindi',
    color: '#7B1FA2',
    bgColor: '#F3E5F5',
    term1: 72,
    term2: 80,
    maxMarks: 100,
    grade: 'B+',
  },
  {
    id: '5',
    subject: 'Social Studies',
    color: '#00838F',
    bgColor: '#E0F7FA',
    term1: 88,
    term2: 91,
    maxMarks: 100,
    grade: 'A+',
  },
  {
    id: '6',
    subject: 'Computer Science',
    color: '#AD1457',
    bgColor: '#FCE4EC',
    term1: 95,
    term2: 97,
    maxMarks: 100,
    grade: 'A+',
  },
];

const EXAM_TYPES = ['All', 'Term 1', 'Term 2', 'Unit Test'];

export default function ParentMarksScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const [selectedExam, setSelectedExam] = useState('All');

  const totalTerm1 = DEMO_SUBJECTS.reduce((sum, s) => sum + s.term1, 0);
  const totalTerm2 = DEMO_SUBJECTS.reduce((sum, s) => sum + s.term2, 0);
  const totalMax = DEMO_SUBJECTS.length * 100;
  const overallPercent = Math.round(((totalTerm1 + totalTerm2) / (totalMax * 2)) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewLeft}>
          <View style={styles.percentCircle}>
            <Text style={styles.percentText}>{overallPercent}%</Text>
          </View>
          <Text style={styles.overviewLabel}>Overall</Text>
        </View>
        <View style={styles.overviewRight}>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{totalTerm1}/{totalMax}</Text>
            <Text style={styles.overviewStatLabel}>Term 1</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{totalTerm2}/{totalMax}</Text>
            <Text style={styles.overviewStatLabel}>Term 2</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={[styles.overviewStatValue, { color: '#2E7D32' }]}>A</Text>
            <Text style={styles.overviewStatLabel}>Grade</Text>
          </View>
        </View>
      </View>

      {/* Exam Type Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {EXAM_TYPES.map((exam) => (
          <TouchableOpacity
            key={exam}
            style={[styles.filterPill, selectedExam === exam && styles.filterPillActive]}
            onPress={() => setSelectedExam(exam)}
          >
            <Text style={[styles.filterText, selectedExam === exam && styles.filterTextActive]}>
              {exam}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Subject-wise Marks */}
      <Text style={styles.sectionTitle}>Subject-wise Performance</Text>

      {DEMO_SUBJECTS.map((subject) => {
        const avg = Math.round((subject.term1 + subject.term2) / 2);
        const barWidth = `${avg}%`;
        return (
          <View key={subject.id} style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
              <Text style={styles.subjectName}>{subject.subject}</Text>
              <View style={[styles.gradeBadge, { backgroundColor: subject.bgColor }]}>
                <Text style={[styles.gradeText, { color: subject.color }]}>{subject.grade}</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: barWidth as any, backgroundColor: subject.color }]} />
            </View>

            <View style={styles.marksRow}>
              <Text style={styles.markLabel}>
                Term 1: <Text style={styles.markValue}>{subject.term1}/{subject.maxMarks}</Text>
              </Text>
              <Text style={styles.markLabel}>
                Term 2: <Text style={styles.markValue}>{subject.term2}/{subject.maxMarks}</Text>
              </Text>
              <Text style={styles.markLabel}>
                Avg: <Text style={[styles.markValue, { color: subject.color }]}>{avg}%</Text>
              </Text>
            </View>
          </View>
        );
      })}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingBottom: 100 },

  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  overviewLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  percentCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  percentText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
  },
  overviewRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  overviewStatLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },

  filterScroll: {
    paddingHorizontal: 16,
    marginTop: 16,
    maxHeight: 44,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },

  subjectCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  subjectName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  marksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  markValue: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

