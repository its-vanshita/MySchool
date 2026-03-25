import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { getTimetableForTeacher } from '../../../src/services/supabaseService';
import { useTheme } from '../../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { TimetableEntry } from '../../../src/types';

// ── Types ──
interface ClassInfo {
  key: string;           // e.g. "Class 10A"
  className: string;
  subjects: string[];
  isClassTeacher: boolean;
  studentCount: number;
}

// ── Demo data ──
const DEMO_TIMETABLE: TimetableEntry[] = [
  { id: 't1', teacher_id: 'demo-teacher', subject: 'Mathematics', class_name: 'Class 10A', room: '204', start_time: '09:00', end_time: '09:45', day: 'monday', school_id: 'demo-school' },
  { id: 't2', teacher_id: 'demo-teacher', subject: 'Science', class_name: 'Class 9C', room: 'Lab 02', start_time: '11:30', end_time: '12:15', day: 'monday', school_id: 'demo-school' },
  { id: 't3', teacher_id: 'demo-teacher', subject: 'English', class_name: 'Class 10A', room: '204', start_time: '14:00', end_time: '14:45', day: 'monday', school_id: 'demo-school' },
  { id: 't4', teacher_id: 'demo-teacher', subject: 'Mathematics', class_name: 'Class 9B', room: '201', start_time: '10:00', end_time: '10:45', day: 'tuesday', school_id: 'demo-school' },
];

// Demo: teacher is class teacher of 10A
const CLASS_TEACHER_OF = 'Class 10A';

const STUDENT_COUNTS: Record<string, number> = {
  'Class 10A': 42,
  'Class 9C': 38,
  'Class 9B': 40,
};

// Color palette per class
const CLASS_COLORS = [
  { bg: '#EEF2FF', accent: '#6366F1', light: '#C7D2FE' },
  { bg: '#ECFDF5', accent: '#10B981', light: '#A7F3D0' },
  { bg: '#FFF7ED', accent: '#F97316', light: '#FED7AA' },
  { bg: '#FDF2F8', accent: '#EC4899', light: '#FBCFE8' },
  { bg: '#FFFBEB', accent: '#F59E0B', light: '#FDE68A' },
  { bg: '#F0FDFA', accent: '#14B8A6', light: '#99F6E4' },
];

export default function MyClassScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { profile } = useUser();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      let timetable: TimetableEntry[] = [];
      if (profile?.id) {
        timetable = await getTimetableForTeacher(profile.id);
        if (timetable.length === 0 && profile.school_id === 'demo-school') {
          timetable = DEMO_TIMETABLE;
        }
      }

      // Group by class
      const classMap = new Map<string, Set<string>>();
      for (const entry of timetable) {
        if (!classMap.has(entry.class_name)) {
          classMap.set(entry.class_name, new Set());
        }
        classMap.get(entry.class_name)!.add(entry.subject);
      }

      const result: ClassInfo[] = [];
      for (const [className, subjects] of classMap) {
        result.push({
          key: className,
          className,
          subjects: Array.from(subjects).sort(),
          isClassTeacher: className === CLASS_TEACHER_OF,
          studentCount: STUDENT_COUNTS[className] ?? 35,
        });
      }

      // Sort: class teacher first, then alphabetical
      result.sort((a, b) => {
        if (a.isClassTeacher && !b.isClassTeacher) return -1;
        if (!a.isClassTeacher && b.isClassTeacher) return 1;
        return a.className.localeCompare(b.className);
      });

      setClasses(result);
      setLoading(false);
    };
    load();
  }, [profile]);

  const handleClassPress = (cls: ClassInfo) => {
    router.push({
      pathname: '/class-students',
      params: {
        className: cls.className,
        subjects: cls.subjects.join(','),
        isClassTeacher: cls.isClassTeacher ? '1' : '0',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderClass = ({ item, index }: { item: ClassInfo; index: number }) => {
    const colorSet = CLASS_COLORS[index % CLASS_COLORS.length];
    return (
      <TouchableOpacity
        style={[styles.classCard, { backgroundColor: colorSet.bg }]}
        activeOpacity={0.7}
        onPress={() => handleClassPress(item)}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: colorSet.accent }]} />

        <View style={styles.cardBody}>
          {/* Top: class name + tag */}
          <View style={styles.cardTop}>
            <View style={[styles.classIcon, { backgroundColor: colorSet.accent + '20' }]}>
              <Ionicons name="school" size={22} color={colorSet.accent} />
            </View>
            <View style={styles.cardTitleWrap}>
              <Text style={styles.className}>{item.className}</Text>
              <View style={[
                styles.tag,
                item.isClassTeacher
                  ? { backgroundColor: '#DCFCE7' }
                  : { backgroundColor: colorSet.accent + '15' },
              ]}>
                <Ionicons
                  name={item.isClassTeacher ? 'shield-checkmark' : 'book'}
                  size={12}
                  color={item.isClassTeacher ? '#16A34A' : colorSet.accent}
                />
                <Text style={[
                  styles.tagText,
                  { color: item.isClassTeacher ? '#16A34A' : colorSet.accent },
                ]}>
                  {item.isClassTeacher ? 'Class Teacher' : 'Subject Teacher'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colorSet.accent} />
          </View>

          {/* Subjects */}
          <View style={styles.subjectsRow}>
            {item.subjects.map((sub) => (
              <View key={sub} style={[styles.subjectChip, { backgroundColor: colorSet.accent + '18' }]}>
                <Text style={[styles.subjectChipText, { color: colorSet.accent }]}>{sub}</Text>
              </View>
            ))}
          </View>

          {/* Bottom: student count */}
          <View style={styles.cardBottom}>
            <Ionicons name="people" size={14} color={colors.textSecondary} />
            <Text style={styles.studentCountText}>{item.studentCount} Students</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{classes.length}</Text>
          <Text style={styles.summaryLabel}>Classes</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {classes.reduce((sum, c) => sum + c.studentCount, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Total Students</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {new Set(classes.flatMap((c) => c.subjects)).size}
          </Text>
          <Text style={styles.summaryLabel}>Subjects</Text>
        </View>
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.key}
        renderItem={renderClass}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Summary
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },

  // List
  list: {
    padding: spacing.lg,
  },

  // Card
  classCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  accentBar: {
    width: 5,
  },
  cardBody: {
    flex: 1,
    padding: spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardTitleWrap: {
    flex: 1,
  },
  className: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginTop: 4,
    gap: 4,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },

  // Subjects
  subjectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  subjectChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  subjectChipText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },

  // Bottom
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  studentCountText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
