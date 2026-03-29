import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedLessonPlans } from '../../src/hooks/useSharedLessonPlans';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';

const STATUS_COLORS = {
  'completed': '#10B981',
  'in-progress': '#F59E0B',
  'not-started': '#94A3B8'
};

const STATUS_ICONS = {
  'completed': 'checkmark-circle',
  'in-progress': 'time',
  'not-started': 'ellipse-outline'
};

export default function AdminSyllabusTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plans } = useSharedLessonPlans();

  const teachers = useMemo(() => {
    const map = new Map<string, string>();
    plans.forEach(p => map.set(p.teacherId, p.teacherId === 'demo-teacher' ? 'Demo Teacher' : p.teacherId));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [plans]);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teachers.length > 0 ? teachers[0].id : null);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  const teacherPlans = useMemo(() => {
    if (!selectedTeacherId) return [];
    return plans.filter(p => p.teacherId === selectedTeacherId);
  }, [plans, selectedTeacherId]);

  const toggleUnit = (id: string) => {
    setExpandedUnitId(prev => prev === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={[styles.mainHeaderArea, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <View style={styles.mainHeaderTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Syllabus Tracking</Text>
            <Text style={styles.headerSubtitle}>Monitor academic progress</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.teacherSection}>
          <Text style={styles.sectionTitle}>Select Teacher</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipScrollContent}>
            {teachers.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.chip, selectedTeacherId === t.id && styles.chipActive]}
                onPress={() => setSelectedTeacherId(t.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selectedTeacherId === t.id && styles.chipTextActive]}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            ))}
            {teachers.length === 0 && (
              <Text style={{ color: SLATE_GREY }}>No teachers found</Text>
            )}
          </ScrollView>
        </View>

        {teacherPlans.length === 0 && selectedTeacherId && (
           <View style={styles.emptyCard}>
             <View style={styles.emptyIconCircle}>
               <Ionicons name="book-outline" size={40} color="#94A3B8" />
             </View>
             <Text style={styles.emptyTitle}>No Syllabus Data</Text>
             <Text style={styles.emptySubtext}>
               This teacher hasn't mapped out any lesson plans yet.
             </Text>
           </View>
        )}

        {teacherPlans.map((plan, planIndex) => {
          // Calculate overall progress for this plan
          let totalTopics = 0;
          let completedTopics = 0;
          plan.units.forEach(u => {
            u.topics.forEach(t => {
              totalTopics++;
              if (t.status === 'completed') completedTopics++;
            });
          });
          const progressPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

          return (
            <View key={`${plan.subject}-${plan.className}-${planIndex}`} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planSubjectBox}>
                  <Text style={styles.planSubject}>{plan.subject}</Text>
                  <View style={styles.classPill}>
                    <Text style={styles.classPillText}>{plan.className}</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressTextRow}>
                    <Text style={styles.progressLabel}>Overall Progress</Text>
                    <Text style={styles.progressValue}>{Math.round(progressPercent)}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                  </View>
                  <Text style={styles.progressCountInfo}>{completedTopics} of {totalTopics} topics completed</Text>
                </View>
              </View>

              <View style={styles.unitsContainer}>
                {plan.units.map((unit) => {
                  const isExpanded = expandedUnitId === unit.id;
                  const uTotal = unit.topics.length;
                  const uCompleted = unit.topics.filter(t => t.status === 'completed').length;
                  
                  return (
                    <View key={unit.id} style={styles.unitCard}>
                      <TouchableOpacity 
                        style={[styles.unitHeader, isExpanded && styles.unitHeaderExpanded]} 
                        onPress={() => toggleUnit(unit.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.unitHeaderLeft}>
                          <View style={styles.unitNumberBox}>
                            <Text style={styles.unitNumber}>U{unit.number}</Text>
                          </View>
                          <View>
                            <Text style={styles.unitTitle} numberOfLines={1}>{unit.name}</Text>
                            <Text style={styles.unitMeta}>{uCompleted}/{uTotal} Topics</Text>
                          </View>
                        </View>
                        <Ionicons 
                          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                          size={20} 
                          color={SLATE_GREY} 
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.topicsContainer}>
                          {unit.topics.map((topic, index) => {
                            const isLast = index === unit.topics.length - 1;
                            const statusColor = STATUS_COLORS[topic.status];
                            return (
                              <View key={topic.id} style={styles.topicRow}>
                                {/* Timeline line */}
                                <View style={styles.timelineCol}>
                                  <Ionicons 
                                    name={STATUS_ICONS[topic.status] as any} 
                                    size={18} 
                                    color={statusColor} 
                                    style={{ zIndex: 2, backgroundColor: PURE_WHITE }}
                                  />
                                  {!isLast && <View style={styles.timelineLine} />}
                                </View>
                                
                                <View style={[styles.topicContent, !isLast && styles.topicContentBorder]}>
                                  <Text style={styles.topicName}>{topic.name}</Text>
                                  <View style={styles.topicMetaRow}>
                                    <Text style={[styles.topicStatusText, { color: statusColor }]}>
                                      {topic.status === 'completed' ? 'Completed' : topic.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                                    </Text>
                                    {topic.completedDate && (
                                      <Text style={styles.topicDateText}> • {topic.completedDate}</Text>
                                    )}
                                    {topic.nextDate && (
                                      <Text style={styles.topicDateText}> • Due {topic.nextDate}</Text>
                                    )}
                                  </View>
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
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  mainHeaderArea: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  mainHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,    paddingVertical: 12,
  },
  backButton: {
    width: 44,    height: 44,
    justifyContent: 'center',    alignItems: 'center',
    marginRight: 4,
  },
  headerTextWrap: {
    flex: 1,    marginLeft: 4,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  teacherSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: SLATE_GREY,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipScroll: {
    marginHorizontal: -20,
  },
  chipScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    backgroundColor: PURE_WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: BRAND_NAVY,
    borderColor: BRAND_NAVY,
  },
  chipText: {
    fontSize: 14,
    color: SLATE_GREY,
    fontWeight: '600',
  },
  chipTextActive: {
    color: PURE_WHITE,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,    alignItems: 'center',
    padding: 40,    marginTop: 20,
    shadowColor: '#000',    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,    shadowRadius: 12,
    elevation: 2,    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  emptyIconCircle: {
    width: 72,    height: 72,
    borderRadius: 36,    backgroundColor: '#F1F5F9',
    alignItems: 'center',    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,    fontWeight: '700',
    color: DARK_TEXT,    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,    color: SLATE_GREY,
    textAlign: 'center',    lineHeight: 20,
  },
  planCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  planHeader: {
    marginBottom: 20,
  },
  planSubjectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planSubject: {
    fontSize: 20,
    fontWeight: '800',
    color: DARK_TEXT,
    flex: 1,
    paddingRight: 10,
  },
  classPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  classPillText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 13,
  },
  progressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 18,
    color: BRAND_NAVY,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressCountInfo: {
    fontSize: 12,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  unitsContainer: {
    gap: 12,
  },
  unitCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  unitHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: PURE_WHITE,
  },
  unitHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    paddingRight: 12,
  },
  unitNumberBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitNumber: {
    color: '#4F46E5',
    fontWeight: '800',
    fontSize: 14,
  },
  unitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 2,
  },
  unitMeta: {
    fontSize: 12,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  topicsContainer: {
    padding: 16,
  },
  topicRow: {
    flexDirection: 'row',
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: -2,
    marginBottom: -2,
    zIndex: 1,
  },
  topicContent: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 8,
  },
  topicContentBorder: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#F1F5F9',
  },
  topicName: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_TEXT,
    marginBottom: 4,
  },
  topicMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  topicDateText: {
    fontSize: 12,
    color: SLATE_GREY,
    fontWeight: '500',
  },
});
