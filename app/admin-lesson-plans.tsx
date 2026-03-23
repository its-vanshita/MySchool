import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSharedLessonPlans } from '../src/hooks/useSharedLessonPlans';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';

export default function AdminLessonPlansScreen() {
  const { plans } = useSharedLessonPlans();
  
  // Extract unique teachers from plans
  const teachers = useMemo(() => {
    const map = new Map<string, string>(); // teacherId -> teacherId
    plans.forEach(p => map.set(p.teacherId, p.teacherId === 'demo-teacher' ? 'Demo Teacher' : p.teacherId));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [plans]);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teachers.length > 0 ? teachers[0].id : null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Get plans for selected teacher
  const teacherPlans = useMemo(() => {
    return plans.filter(p => p.teacherId === selectedTeacherId);
  }, [plans, selectedTeacherId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Syllabus Tracking</Text>
        <Text style={styles.subTitle}>Monitor teacher progress and coverage.</Text>

        {/* Teacher Selector */}
        <Text style={styles.sectionLabel}>Select Teacher</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teacherScroll}>
          {teachers.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.teacherChip,
                selectedTeacherId === t.id && styles.teacherChipSelected
              ]}
              onPress={() => setSelectedTeacherId(t.id)}
            >
              <Ionicons name="person-outline" size={16} color={selectedTeacherId === t.id ? colors.white : colors.textSecondary} />
              <Text style={[styles.teacherChipText, selectedTeacherId === t.id && { color: colors.white }]}>
                {t.name}
              </Text>
            </TouchableOpacity>
          ))}
          {teachers.length === 0 && (
            <Text style={{ color: colors.textLight, fontStyle: 'italic', paddingVertical: 8 }}>No teachers with active plans.</Text>
          )}
        </ScrollView>

        {/* Plans for Teacher */}
        {teacherPlans.length > 0 && selectedTeacherId ? (
          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.sectionLabel}>Teacher Classes & Progress</Text>
            
            {teacherPlans.map((plan, idx) => {
              const allTopics = plan.units.flatMap(u => u.topics);
              const total = allTopics.length;
              const completed = allTopics.filter(t => t.status === 'completed').length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              const id = `${plan.subject}-${plan.className}`;
              const isExpanded = expandedPlanId === id;

              return (
                <View key={idx} style={styles.planCard}>
                  <TouchableOpacity
                    style={styles.planHeader}
                    onPress={() => setExpandedPlanId(isExpanded ? null : id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.planInfo}>
                      <Text style={styles.planTitle}>{plan.subject}</Text>
                      <View style={styles.planMetaRow}>
                        <Ionicons name="school-outline" size={14} color={colors.textLight} />
                        <Text style={styles.planClassName}>{plan.className}</Text>
                      </View>
                    </View>

                    <View style={styles.progressCircleContainer}>
                      <Text style={styles.progressCirclePct}>{pct}%</Text>
                      <Text style={styles.progressCircleLabel}>Done</Text>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.planDetails}>
                      {plan.units.map(unit => {
                        const unitTotal = unit.topics.length;
                        const unitDone = unit.topics.filter(t => t.status === 'completed').length;
                        
                        return (
                          <View key={unit.id} style={styles.unitRow}>
                            <View style={styles.unitHeaderRow}>
                              <Text style={styles.unitName}>Unit {unit.number}: {unit.name}</Text>
                              <Text style={styles.unitProgressText}>{unitDone}/{unitTotal} topics</Text>
                            </View>
                            
                            {/* Topics */}
                            <View style={styles.topicsGrid}>
                              {unit.topics.map((topic, tidx) => (
                                <View key={topic.id} style={styles.topicItem}>
                                  <Ionicons 
                                    name={topic.status === 'completed' ? 'checkmark-circle' : 'time-outline'} 
                                    size={16} 
                                    color={topic.status === 'completed' ? colors.success : colors.textLight} 
                                  />
                                  <Text style={[styles.topicItemText, topic.status === 'completed' && { color: colors.textSecondary }]}>
                                    {topic.name}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : selectedTeacherId ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No syllabus data for this teacher</Text>
          </View>
        ) : null}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: spacing.lg },
  
  headerTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  subTitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  
  sectionLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.sm, letterSpacing: 0.5 },
  
  teacherScroll: { flexDirection: 'row', marginBottom: spacing.md },
  teacherChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.lg, paddingVertical: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border,
    marginRight: spacing.sm,
  },
  teacherChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  teacherChipText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  
  planCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
    borderWidth: 1, borderColor: colors.border,
  },
  planHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.lg,
  },
  planInfo: { flex: 1 },
  planTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  planMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planClassName: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },
  
  progressCircleContainer: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
    elevation: 1,
  },
  progressCirclePct: { fontSize: fontSize.md, fontWeight: '800', color: colors.primary, marginTop: -2 },
  progressCircleLabel: { fontSize: 9, fontWeight: '600', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: -2 },
  
  planDetails: {
    borderTopWidth: 1, borderTopColor: colors.divider,
    backgroundColor: '#F9FAFB',
    padding: spacing.lg,
  },
  unitRow: { marginBottom: spacing.md },
  unitHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.sm },
  unitName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  unitProgressText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  
  topicsGrid: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  topicItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  topicItemText: { fontSize: fontSize.sm, color: colors.textPrimary, flex: 1 },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl, opacity: 0.6 },
  emptyText: { marginTop: spacing.md, fontSize: fontSize.md, fontWeight: '500', color: colors.textLight },
});
