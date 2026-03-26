import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useLessonPlans } from '../../src/hooks/useLessonPlans';
import { getTimetableForTeacher } from '../../src/services/supabaseService';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { TimetableEntry } from '../../src/types';

// ── Demo data removed ──
import { useSharedLessonPlans, markTopicCompleted } from '../../src/hooks/useSharedLessonPlans';
import type { UnitItem, TopicItem } from '../../src/hooks/useSharedLessonPlans';

interface SubjectClass {
  label: string;
  subject: string;
  className: string;
}

export default function LessonPlansScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { profile } = useUser();
  const { plans: dbPlans } = useLessonPlans(profile?.id);

  const [subjectClasses, setSubjectClasses] = useState<SubjectClass[]>([]);
  const [selected, setSelected] = useState<SubjectClass | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  // Load subject+class combos from timetable
  useEffect(() => {
    const load = async () => {
      let timetable: TimetableEntry[] = [];
      if (profile?.id) {
        timetable = await getTimetableForTeacher(profile.id);
      }
      const seen = new Set<string>();

      const opts: SubjectClass[] = [];
      for (const entry of timetable) {
        const key = `${entry.subject}|${entry.class_name}`;
        if (!seen.has(key)) {
          seen.add(key);
          opts.push({
            label: `${entry.subject} - ${entry.class_name}`,
            subject: entry.subject,
            className: entry.class_name,
          });
        }
      }
      
      opts.sort((a, b) => a.label.localeCompare(b.label));

      setSubjectClasses(opts);
      if (opts.length > 0) {
        setSelected(opts[0]);
      }
    };
    load();
  }, [profile]);

  // Get units for current selection
  const units = useMemo(() => {
    if (!selected || !profile?.id) return [];

    const relevant = dbPlans.filter(
      (p) => p.subject === selected.subject && p.class_name === selected.className
    );

    if (relevant.length === 0) return [];

    const dummyUnit: UnitItem = {
      id: 'uploaded',
      number: 1,
      name: 'Uploaded Lesson Plans',
      topics: relevant.map((p) => ({
        id: p.id,
        name: p.topic || 'Untitled',
        status: 'completed',
        completedDate: new Date(p.uploaded_at).toLocaleDateString(),
      })),
    };

    return [dummyUnit];
  }, [selected, dbPlans]);

  // Auto-expand first unit that has in-progress topics
  useEffect(() => {
    const activeUnit = units.find((u) =>
      u.topics.some((t) => t.status === 'in-progress')
    );
    setExpandedUnit(activeUnit?.id ?? units[0]?.id ?? null);
  }, [units]);

  // Compute syllabus progress
  const progressInfo = useMemo(() => {
    const allTopics = units.flatMap((u) => u.topics);
    const total = allTopics.length;
    const completed = allTopics.filter((t) => t.status === 'completed').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  }, [units]);

  const getUnitSummary = (unit: UnitItem) => {
    const total = unit.topics.length;
    const done = unit.topics.filter((t) => t.status === 'completed').length;
    if (done === total) return `${total} Topics · 100% Completed`;
    if (done === 0) return 'Not Started';
    return `${done} of ${total} Topics Completed`;
  };

  const isUnitComplete = (unit: UnitItem) =>
    unit.topics.every((t) => t.status === 'completed');

  const isUnitActive = (unit: UnitItem) =>
    unit.topics.some((t) => t.status === 'in-progress');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Subject & Class Selector */}
        <Text style={styles.sectionLabel}>Select Subject & Class</Text>
        <TouchableOpacity
          style={styles.classSelector}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.classSelectorText}>
            {selected?.label ?? 'Select'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Syllabus Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressIconRow}>
              <Ionicons name="bar-chart" size={18} color={colors.primary} />
              <Text style={styles.progressTitle}>Syllabus Progress</Text>
            </View>
            <Text style={styles.progressPct}>{progressInfo.pct}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressInfo.pct}%` },
              ]}
            />
          </View>
          <Text style={styles.progressSubText}>
            {progressInfo.completed} of {progressInfo.total} units completed
          </Text>
        </View>

        {/* Units & Chapters */}
        <Text style={styles.sectionLabel}>Units & Chapters</Text>

        {units.map((unit) => {
          const isExpanded = expandedUnit === unit.id;
          const complete = isUnitComplete(unit);
          const active = isUnitActive(unit);

          return (
            <View key={unit.id} style={styles.unitContainer}>
              <TouchableOpacity
                style={[
                  styles.unitHeader,
                  active && styles.unitHeaderActive,
                ]}
                onPress={() =>
                  setExpandedUnit(isExpanded ? null : unit.id)
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.unitBadge,
                    complete && styles.unitBadgeComplete,
                    active && styles.unitBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.unitBadgeText,
                      (complete || active) && styles.unitBadgeTextLight,
                    ]}
                  >
                    {unit.number}
                  </Text>
                </View>
                <View style={styles.unitInfo}>
                  <Text
                    style={[
                      styles.unitName,
                      active && styles.unitNameActive,
                    ]}
                  >
                    Unit {unit.number}: {unit.name}
                  </Text>
                  <Text
                    style={[
                      styles.unitSummary,
                      active && styles.unitSummaryActive,
                    ]}
                  >
                    {getUnitSummary(unit)}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={active ? colors.white : colors.textSecondary}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.topicsList}>
                  {unit.topics.map((topic, idx) => (
                    <View
                      key={topic.id}
                      style={[
                        styles.topicRow,
                        idx === unit.topics.length - 1 && styles.topicRowLast,
                      ]}
                    >
                      {/* Status icon */}
                      <View style={styles.topicStatusCol}>
                        {topic.status === 'completed' ? (
                          <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={12} color={colors.white} />
                          </View>
                        ) : topic.status === 'in-progress' ? (
                          <View style={styles.inProgressCircle}>
                            <Ionicons name="checkmark" size={12} color={colors.white} />
                          </View>
                        ) : (
                          <View style={styles.emptyCircle} />
                        )}
                        {/* Vertical line connector */}
                        {idx < unit.topics.length - 1 && (
                          <View style={styles.connector} />
                        )}
                      </View>

                      {/* Topic details */}
                      <View style={styles.topicContent}>
                        <Text
                          style={[
                            styles.topicName,
                            topic.status === 'completed' && styles.topicNameCompleted,
                          ]}
                        >
                          {topic.name}
                        </Text>
                        {topic.status === 'completed' && topic.completedDate && (
                          <Text style={styles.topicMeta}>
                            Completed on {topic.completedDate}
                          </Text>
                        )}
                        {topic.status === 'in-progress' && topic.nextDate && (
                          <Text style={styles.topicMetaNext}>
                            Next Lesson: {topic.nextDate}
                          </Text>
                        )}
                      </View>
                      
                      {/* Mark Complete Button */}
                      {topic.status !== 'completed' && profile?.id && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: colors.primaryLight,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                            marginLeft: 10,
                            alignSelf: 'flex-start',
                            borderWidth: 1,
                            borderColor: colors.primary,
                          }}
                          onPress={() => markTopicCompleted(profile.id, selected!.subject, selected!.className, unit.id, topic.id)}
                        >
                          <Text style={{ fontSize: 9, fontWeight: '700', color: colors.primary }}>MARK DONE</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {units.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={50} color={colors.textLight} />
            <Text style={styles.emptyText}>No lesson plans yet</Text>
            <Text style={styles.emptySubText}>
              Select a subject & class to view syllabus
            </Text>
          </View>
        )}

        {/* Spacer for bottom button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add New Topic Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/add-lesson-plan')}
        >
          <Ionicons name="add-circle" size={22} color={colors.white} />
          <Text style={styles.addBtnText}>Add New Topic</Text>
        </TouchableOpacity>
      </View>

      {/* Subject/Class Picker Modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Subject & Class</Text>
            {subjectClasses.length > 0 ? (
              subjectClasses.map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.modalOption,
                    selected?.label === opt.label && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setSelected(opt);
                    setShowPicker(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Ionicons
                      name="book-outline"
                      size={20}
                      color={selected?.label === opt.label ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        selected?.label === opt.label && { color: colors.primary, fontWeight: '600' },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </View>
                  {selected?.label === opt.label && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ paddingVertical: spacing.xl, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="folder-open-outline" size={48} color={colors.textLight} style={{ marginBottom: spacing.md }} />
                <Text style={{ color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.xs }}>
                  No classes available
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center' }}>
                  You don't have any subjects assigned in the timetable.
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 100 },

  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  // ── Class Selector ──
  classSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  classSelectorText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // ── Progress Card ──
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressPct: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressSubText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  // ── Unit Container ──
  unitContainer: {
    marginBottom: spacing.md,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  unitHeaderActive: {
    backgroundColor: colors.primary,
  },
  unitBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  unitBadgeComplete: {
    backgroundColor: colors.success,
  },
  unitBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  unitBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  unitBadgeTextLight: {
    color: colors.white,
  },
  unitInfo: { flex: 1 },
  unitName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  unitNameActive: { color: colors.white },
  unitSummary: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  unitSummaryActive: { color: 'rgba(255,255,255,0.8)' },

  // ── Topics List ──
  topicsList: {
    backgroundColor: colors.white,
    marginTop: -4,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  topicRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  topicRowLast: {
    minHeight: 36,
  },

  // Status column with connector
  topicStatusCol: {
    width: 28,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inProgressCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 2,
  },

  // Topic content
  topicContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  topicName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  topicNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  topicMeta: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  topicMetaNext: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 2,
  },

  // ── Empty State ──
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  emptySubText: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },

  // ── Bottom Add Button ──
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 25,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl,
    paddingBottom: spacing.xxl + 25,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  modalOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  modalOptionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
});



