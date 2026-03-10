import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useDatesheet } from '../../src/hooks/useDatesheet';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { ExamEntry } from '../../src/types';

export default function DatesheetScreen() {
  const { profile } = useUser();
  const { exams, loading } = useDatesheet(profile?.school_id);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Group by date
  const grouped: Record<string, ExamEntry[]> = {};
  exams.forEach((exam) => {
    const key = exam.exam_date;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(exam);
  });
  const sections = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  return (
    <View style={styles.container}>
      {exams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={50} color={colors.textLight} />
          <Text style={styles.emptyText}>No exams scheduled</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={([date]) => date}
          contentContainerStyle={styles.list}
          renderItem={({ item: [date, items] }) => (
            <View style={styles.section}>
              <View style={styles.dateHeader}>
                <Ionicons name="calendar" size={16} color={colors.primary} />
                <Text style={styles.dateHeaderText}>
                  {new Date(date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </Text>
              </View>
              {items.map((exam) => (
                <View key={exam.id} style={styles.examCard}>
                  <View style={styles.examLeft}>
                    <Text style={styles.examSubject}>{exam.subject}</Text>
                    <Text style={styles.examClass}>{exam.class_name}</Text>
                  </View>
                  <View style={styles.examRight}>
                    <View style={styles.timeBox}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.timeText}>
                        {exam.start_time}{exam.end_time ? ` - ${exam.end_time}` : ''}
                      </Text>
                    </View>
                    {exam.room ? (
                      <View style={styles.roomBox}>
                        <Text style={styles.roomText}>Room {exam.room}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.lg },
  section: { marginBottom: spacing.lg },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dateHeaderText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
  examCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  examLeft: { flex: 1 },
  examSubject: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  examClass: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  examRight: { alignItems: 'flex-end' },
  timeBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  timeText: { fontSize: fontSize.sm, color: colors.textSecondary },
  roomBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  roomText: { fontSize: fontSize.xs, color: colors.primary, fontWeight: '600' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textLight, fontSize: fontSize.md, marginTop: spacing.md },
});
