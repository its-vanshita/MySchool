import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar: string;
  attendance: number; // percentage
  grade: string;
}

// Demo students per class
const DEMO_STUDENTS: Record<string, Student[]> = {
  'Class 10A': [
    { id: 's1', name: 'Arjun Sharma', rollNumber: '001', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', attendance: 94, grade: 'A+' },
    { id: 's2', name: 'Diya Kapoor', rollNumber: '002', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', attendance: 98, grade: 'A+' },
    { id: 's3', name: 'Rohan Mehta', rollNumber: '003', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', attendance: 87, grade: 'A' },
    { id: 's4', name: 'Priya Singh', rollNumber: '004', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', attendance: 91, grade: 'A' },
    { id: 's5', name: 'Aditya Patel', rollNumber: '005', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', attendance: 76, grade: 'B+' },
    { id: 's6', name: 'Kavya Joshi', rollNumber: '006', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', attendance: 95, grade: 'A+' },
    { id: 's7', name: 'Rahul Nair', rollNumber: '007', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', attendance: 82, grade: 'B+' },
    { id: 's8', name: 'Ananya Gupta', rollNumber: '008', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', attendance: 96, grade: 'A' },
    { id: 's9', name: 'Vikram Reddy', rollNumber: '009', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', attendance: 88, grade: 'A' },
    { id: 's10', name: 'Neha Verma', rollNumber: '010', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', attendance: 72, grade: 'B' },
  ],
  'Class 9C': [
    { id: 's11', name: 'Aman Kumar', rollNumber: '001', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', attendance: 90, grade: 'A' },
    { id: 's12', name: 'Sneha Rao', rollNumber: '002', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', attendance: 93, grade: 'A+' },
    { id: 's13', name: 'Karthik Iyer', rollNumber: '003', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', attendance: 85, grade: 'A' },
    { id: 's14', name: 'Meera Das', rollNumber: '004', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', attendance: 78, grade: 'B+' },
    { id: 's15', name: 'Siddharth Roy', rollNumber: '005', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', attendance: 89, grade: 'A' },
    { id: 's16', name: 'Tanya Sharma', rollNumber: '006', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', attendance: 97, grade: 'A+' },
  ],
  'Class 9B': [
    { id: 's17', name: 'Ishaan Malhotra', rollNumber: '001', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', attendance: 91, grade: 'A' },
    { id: 's18', name: 'Riya Bose', rollNumber: '002', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', attendance: 88, grade: 'A' },
    { id: 's19', name: 'Dev Chauhan', rollNumber: '003', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', attendance: 79, grade: 'B+' },
    { id: 's20', name: 'Pooja Agarwal', rollNumber: '004', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', attendance: 94, grade: 'A+' },
  ],
};

function getAttendanceColor(pct: number) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  if (pct >= 90) return colors.success;
  if (pct >= 75) return colors.warning;
  return colors.danger;
}

export default function ClassStudentsScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { className, subjects, isClassTeacher } = useLocalSearchParams<{
    className: string;
    subjects: string;
    isClassTeacher: string;
  }>();

  const [search, setSearch] = useState('');
  const isClassTeacherBool = isClassTeacher === '1';
  const subjectList = subjects?.split(',') ?? [];
  const allStudents = DEMO_STUDENTS[className ?? ''] ?? [];

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return allStudents;
    const q = search.toLowerCase();
    return allStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNumber.includes(q)
    );
  }, [allStudents, search]);

  const handleStudentPress = (student: Student) => {
    router.push({
      pathname: '/student-performance',
      params: {
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        avatar: student.avatar,
        className: className ?? '',
        subjects: subjects ?? '',
        isClassTeacher: isClassTeacher ?? '0',
      },
    });
  };

  const avgAttendance = allStudents.length > 0
    ? Math.round(allStudents.reduce((s, st) => s + st.attendance, 0) / allStudents.length)
    : 0;

  const renderStudent = ({ item, index }: { item: Student; index: number }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
const attColor = getAttendanceColor(item.attendance);
    return (
      <TouchableOpacity
        style={styles.studentCard}
        activeOpacity={0.7}
        onPress={() => handleStudentPress(item)}
      >
        {/* Avatar + Roll */}
        <View style={styles.avatarWrap}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.rollBadge}>
            <Text style={styles.rollBadgeText}>#{item.rollNumber}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: attColor }]} />
              <Text style={styles.statText}>{item.attendance}% Attendance</Text>
            </View>
            <View style={[styles.gradeBadge, {
              backgroundColor: item.grade.startsWith('A') ? '#DCFCE7' : '#FEF3C7',
            }]}>
              <Text style={[styles.gradeText, {
                color: item.grade.startsWith('A') ? '#16A34A' : '#B45309',
              }]}>{item.grade}</Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="people" size={20} color={colors.primary} />
          <Text style={[styles.summaryValue, { color: colors.primary }]}>{allStudents.length}</Text>
          <Text style={styles.summaryLabel}>Students</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.successLight }]}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={[styles.summaryValue, { color: colors.success }]}>{avgAttendance}%</Text>
          <Text style={styles.summaryLabel}>Avg Attendance</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#EDE9FE' }]}>
          <Ionicons name="book" size={20} color={colors.purple} />
          <Text style={[styles.summaryValue, { color: colors.purple }]}>{subjectList.length}</Text>
          <Text style={styles.summaryLabel}>Subjects</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or roll number..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tag */}
      <View style={styles.tagRow}>
        <View style={[styles.roleTag, isClassTeacherBool ? styles.roleTagClass : styles.roleTagSubject]}>
          <Ionicons
            name={isClassTeacherBool ? 'shield-checkmark' : 'book'}
            size={13}
            color={isClassTeacherBool ? '#16A34A' : colors.primary}
          />
          <Text style={[styles.roleTagText, {
            color: isClassTeacherBool ? '#16A34A' : colors.primary,
          }]}>
            {isClassTeacherBool ? 'Class Teacher' : 'Subject Teacher'}
          </Text>
        </View>
        <Text style={styles.resultCount}>
          {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Student list */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="people-outline" size={50} color={colors.textLight} />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: 4,
  },
  summaryValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  // Tag row
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  roleTagClass: { backgroundColor: '#DCFCE7' },
  roleTagSubject: { backgroundColor: colors.primaryLight },
  roleTagText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  resultCount: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },

  // List
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Student card
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
  },
  rollBadge: {
    position: 'absolute',
    bottom: -4,
    left: -2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  rollBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  gradeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  gradeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },

  // Empty
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },
});
