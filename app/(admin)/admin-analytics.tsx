import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useSharedMarks, DEMO_EXAMS } from '../../src/hooks/useSharedMarks';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

const screenWidth = Dimensions.get('window').width;

const CLASSES = ['Class 10A', 'Class 9C', 'Class 8B'];
const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const CLASS_SUBJECTS: Record<string, string[]> = {
  'Class 10A': ['Mathematics', 'English'],
  'Class 9C': ['Science'],
  'Class 8B': ['Social Studies'],
};

export default function AdminAnalyticsScreen() {
  const { store, adminUpdateMarks, adminUnlockPortal } = useSharedMarks();

  const [activeTab, setActiveTab] = useState<'analytics' | 'marks'>('analytics');

  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
  const [selectedExam, setSelectedExam] = useState(DEMO_EXAMS[0].id);

  // Edit Mark state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingMark, setEditingMark] = useState('');

  // 1. Mock Attendance Data based on Period
  const attendanceData = useMemo(() => {
    let present = 85;
    let absent = 10;
    let leave = 5;

    if (selectedPeriod === 'Weekly') { present = 80; absent = 12; leave = 8; }
    if (selectedPeriod === 'Monthly') { present = 88; absent = 7; leave = 5; }
    if (selectedPeriod === 'Yearly') { present = 92; absent = 5; leave = 3; }

    return [
      { name: 'Present', population: present, color: colors.success, legendFontColor: colors.textPrimary, legendFontSize: 12 },
      { name: 'Absent', population: absent, color: colors.danger, legendFontColor: colors.textPrimary, legendFontSize: 12 },
      { name: 'On Leave', population: leave, color: colors.warning, legendFontColor: colors.textPrimary, legendFontSize: 12 },
    ];
  }, [selectedPeriod]);

  // 2. Compute Marks for Selected Class and Exam
  const subjects = CLASS_SUBJECTS[selectedClass] || [];
  
  // Aggregate students and find top performers
  // A top student logic: we combine their marks across subjects for this exam
  const studentStats = useMemo(() => {
    const stats: Record<string, { name: string; avatar: string; totalMarks: number; maxMarks: number }> = {};
    
    subjects.forEach(subject => {
      const classKey = `${subject}|${selectedClass}`;
      const group = store.find(s => s.classKey === classKey && s.examId === selectedExam);
      if (group) {
        group.students.forEach(st => {
          if (!stats[st.id]) {
            stats[st.id] = { name: st.name, avatar: st.avatar, totalMarks: 0, maxMarks: 0 };
          }
          if (st.marks && st.status === 'entered') {
            stats[st.id].totalMarks += parseInt(st.marks, 10);
            stats[st.id].maxMarks += st.maxMarks;
          }
        });
      }
    });
    
    const list = Object.values(stats);
    list.sort((a, b) => b.totalMarks - a.totalMarks);
    return list;
  }, [store, selectedClass, selectedExam, subjects]);

  const schoolStats = useMemo(() => {
    const stats: Record<string, { name: string; avatar: string; totalMarks: number; maxMarks: number }> = {};
    
    store.forEach(group => {
      // Aggregate across all classes and subjects
      group.students.forEach(st => {
        if (!stats[st.id]) {
          stats[st.id] = { name: st.name, avatar: st.avatar, totalMarks: 0, maxMarks: 0 };
        }
        if (st.marks && st.status === 'entered') {
          stats[st.id].totalMarks += parseInt(st.marks, 10);
          stats[st.id].maxMarks += st.maxMarks;
        }
      });
    });

    const list = Object.values(stats);
    list.sort((a, b) => b.totalMarks - a.totalMarks);
    return list;
  }, [store]);

  const topStudent = studentStats[0];
  const wholeSchoolTopper = schoolStats[0];

  const handleAdminMarkSave = (classKey: string, studentId: string) => {
    if (!editingMark) return;
    adminUpdateMarks(classKey, selectedExam, studentId, editingMark);
    Alert.alert('Success', 'Mark updated successfully by admin override.');
    setEditingStudentId(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Global Filters */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {CLASSES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, selectedClass === c && styles.chipSelected]}
                onPress={() => setSelectedClass(c)}
              >
                <Text style={[styles.chipText, selectedClass === c && styles.chipTextSelected]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Attendance Section */}
        {activeTab === 'analytics' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Attendance Overview</Text>
              <View style={styles.periodRow}>
                {PERIODS.map(p => (
                  <TouchableOpacity key={p} onPress={() => setSelectedPeriod(p)}>
                    <Text style={[styles.periodText, selectedPeriod === p && styles.periodTextSelected]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <PieChart
              data={attendanceData}
              width={screenWidth - spacing.xl * 2 - 32}
              height={160}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Top Performing Section */}
        {activeTab === 'analytics' && (
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={styles.sectionLabel}>Top Performance Highlights</Text>
            <View style={styles.row}>
              <View style={[styles.highlightCard, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="trophy" size={24} color={colors.primary} />
                <Text style={styles.highlightTitle}>Class Top Student</Text>
                <Text style={styles.highlightVal} numberOfLines={1}>{topStudent?.name || 'N/A'}</Text>
                <Text style={styles.highlightSub}>
                  {topStudent ? `${topStudent.totalMarks} / ${topStudent.maxMarks} Marks` : 'No data'}
                </Text>
              </View>
              
              <View style={[styles.highlightCard, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="star" size={24} color={colors.purple} />
                <Text style={styles.highlightTitle}>Overall School Topper</Text>
                <Text style={styles.highlightVal} numberOfLines={1}>{wholeSchoolTopper?.name || 'N/A'}</Text>
                <Text style={styles.highlightSub}>
                  {wholeSchoolTopper ? `${wholeSchoolTopper.totalMarks} / ${wholeSchoolTopper.maxMarks} Marks` : 'No data'}
                </Text>
              </View>

              <View style={[styles.highlightCard, { backgroundColor: '#E8F5E9', marginTop: spacing.md }]}>
                <Ionicons name="shield-checkmark" size={24} color={colors.success} />
                <Text style={styles.highlightTitle}>Best Attendance</Text>
                <Text style={styles.highlightVal} numberOfLines={1}>N/A</Text>
                <Text style={styles.highlightSub}>No data</Text>
              </View>
            </View>
          </View>
        )}
          {/* Marks Tracking & Admin Override System */}
        {activeTab === 'marks' && (
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={styles.sectionLabel}>Marks Tracking & Overrides</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {DEMO_EXAMS.map(e => (
                  <TouchableOpacity
                    key={e.id}
                    style={[styles.smallChip, selectedExam === e.id && styles.smallChipSelected]}
                    onPress={() => setSelectedExam(e.id)}
                  >
                    <Text style={[styles.smallChipText, selectedExam === e.id && styles.smallChipTextSelected]}>{e.label}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={{ marginTop: spacing.md }}>
              {subjects.map(subj => {
                const classKey = `${subj}|${selectedClass}`;
                const group = store.find(s => s.classKey === classKey && s.examId === selectedExam);
                
                const deadlinePassed = group?.uploadDeadline ? Date.now() > group.uploadDeadline : false;
                const isLocked = group?.submitted || deadlinePassed;
                
                return (
                  <View key={subj} style={styles.subjectCard}>
                    <View style={styles.subjectHeader}>
                      <Text style={styles.subjectTitle}>{subj}</Text>
                      {isLocked ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={[styles.lockedBadge, { backgroundColor: deadlinePassed && !group?.submitted ? colors.danger : colors.success }]}>
                            <Ionicons name="lock-closed" size={12} color={colors.white} />
                            <Text style={styles.lockedText}>
                              {deadlinePassed && !group?.submitted ? 'Time Locked' : 'Locked by Teacher'}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.unlockBtn}
                            onPress={() => {
                              adminUnlockPortal(classKey, selectedExam, 24);
                              Alert.alert('Portal Unlocked', 'Teacher now has 24 hours to modify and submit marks.');
                            }}
                          >
                            <Ionicons name="time-outline" size={12} color={colors.primary} />
                            <Text style={styles.unlockBtnText}>Unlock 24h</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Text style={{ fontSize: 10, color: colors.warning, fontWeight: '700' }}>PENDING SUBMISSION</Text>
                      )}
                    </View>

                    {group && group.students.length > 0 ? (
                      group.students.map(st => (
                        <View key={st.id} style={styles.studentMarkRow}>
                          <Text style={styles.studentNameList}>{st.name}</Text>
                          
                          {editingStudentId === `${classKey}|${st.id}` ? (
                            <View style={styles.editMarkWrapper}>
                              <TextInput 
                                style={styles.overrideInput} 
                                value={editingMark}
                                onChangeText={setEditingMark}
                                keyboardType="number-pad"
                                autoFocus
                                maxLength={3}
                              />
                              <TouchableOpacity onPress={() => handleAdminMarkSave(classKey, st.id)}>
                                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setEditingStudentId(null)}>
                                <Ionicons name="close-circle" size={24} color={colors.danger} />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.scoreActionRow}>
                              <Text style={styles.scoreVal}>
                                {st.marks ? `${st.marks} / ${st.maxMarks}` : '— / 100'}
                              </Text>
                              {isLocked && (
                                <TouchableOpacity onPress={() => { setEditingStudentId(`${classKey}|${st.id}`); setEditingMark(st.marks); }}>
                                  <Ionicons name="create-outline" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </View>
                      ))
                    ) : (
                      <Text style={{ fontSize: 12, color: colors.textLight, paddingVertical: 8 }}>No marks recorded.</Text>
                    )}
                  </View>
                );
              })}
              {subjects.length === 0 && (
                 <Text style={{ color: colors.textLight, marginTop: spacing.md }}>No subjects found for this class.</Text>
              )}
            </View>
          </View>
        )}

        {/* Padding for fake navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Internal Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'analytics' && styles.navItemSelected]}
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons name="pie-chart" size={24} color={activeTab === 'analytics' ? colors.primary : colors.textLight} />
          <Text style={[styles.navItemText, activeTab === 'analytics' && styles.navItemTextSelected]}>Insights</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'marks' && styles.navItemSelected]}
          onPress={() => setActiveTab('marks')}
        >
          <Ionicons name="document-text" size={24} color={activeTab === 'marks' ? colors.primary : colors.textLight} />
          <Text style={[styles.navItemText, activeTab === 'marks' && styles.navItemTextSelected]}>Update Marks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: spacing.xl },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  subTitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  
  filterRow: { marginBottom: spacing.lg },
  chipScroll: { flexDirection: 'row' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextSelected: { color: colors.white },

  smallChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, marginRight: 6,
  },
  smallChipSelected: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  smallChipText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  smallChipTextSelected: { color: colors.white },

  card: {
    backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
    marginBottom: spacing.xl,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  cardTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  periodRow: { flexDirection: 'row', gap: 10 },
  periodText: { fontSize: 11, color: colors.textLight, fontWeight: '600' },
  periodTextSelected: { color: colors.primary, fontWeight: '700' },

  sectionLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.sm, letterSpacing: 0.5 },
  
  row: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  highlightCard: {
    width: '45%', borderRadius: borderRadius.lg, padding: spacing.md,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
    marginBottom: spacing.sm
  },
  highlightTitle: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginTop: 8 },
  highlightVal: { fontSize: fontSize.md, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  highlightSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },

  subjectCard: {
    backgroundColor: colors.white, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 8, marginBottom: 8 },
  subjectTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  lockedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, gap: 4 },
  lockedText: { fontSize: 9, fontWeight: '700', color: colors.white, textTransform: 'uppercase' },
  
  studentMarkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  studentNameList: { fontSize: 13, color: colors.textPrimary, flex: 1, fontWeight: '500' },
  scoreActionRow: { flexDirection: 'row', alignItems: 'center' },
  scoreVal: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  
  editMarkWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  overrideInput: {
    width: 40, height: 28, borderRadius: 4, borderWidth: 1.5, borderColor: colors.primary,
    textAlign: 'center', fontSize: 12, fontWeight: '700', padding: 0, backgroundColor: colors.primaryLight
  },
  unlockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primaryLight, paddingHorizontal: 6, paddingVertical: 3,
    borderRadius: 4, borderWidth: 1, borderColor: colors.primary
  },
  unlockBtnText: {
    fontSize: 9, fontWeight: '700', color: colors.primary, textTransform: 'uppercase'
  },
  
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingBottom: 24, paddingTop: 12, elevation: 15,
  },
  navItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4
  },
  navItemSelected: {
    opacity: 1,
  },
  navItemText: {
    fontSize: 11, fontWeight: '600', color: colors.textLight
  },
  navItemTextSelected: {
    color: colors.primary, fontWeight: '700'
  }
});
