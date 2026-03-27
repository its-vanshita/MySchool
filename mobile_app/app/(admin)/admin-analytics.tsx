import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const TREND_UP = '#10B981';
const TREND_FLAT = '#F59E0B';
const TREND_DOWN = '#EF4444';

const { width } = Dimensions.get('window');

const MOCK_CLASSES = [
  { id: '1', name: '10-A', attendance: 95, avgMarks: 82, status: 'Green' },
  { id: '2', name: '10-B', attendance: 88, avgMarks: 76, status: 'Amber' },
  { id: '3', name: '9-A', attendance: 92, avgMarks: 85, status: 'Green' },
  { id: '4', name: '9-B', attendance: 74, avgMarks: 65, status: 'Red' },
  { id: '5', name: '8-A', attendance: 90, avgMarks: 78, status: 'Amber' },
];

const MOCK_STUDENTS = [
  { id: '1', name: 'Aarav Sharma', attendance: 'Present', marks: 88, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Diya Patel', attendance: 'Absent', marks: 92, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Rohan Gupta', attendance: 'Present', marks: 75, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Ananya Singh', attendance: 'Present', marks: 85, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Kartik Verma', attendance: 'Present', marks: 68, avatar: 'https://i.pravatar.cc/150?u=5' },
];

export default function AdminAnalytics() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState<typeof MOCK_CLASSES[0] | null>(null);
  const [drillDownType, setDrillDownType] = useState<'Attendance' | 'Marks'>('Attendance');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Green': return '#D1FAE5';
      case 'Amber': return '#FEF3C7';
      case 'Red': return '#FEE2E2';
      default: return '#F1F5F9';
    }
  };
  
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Green': return '#059669';
      case 'Amber': return '#D97706';
      case 'Red': return '#DC2626';
      default: return SLATE_GREY;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
      <View style={[styles.headerArea, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTitleRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
                <Text style={styles.headerTitle}>School Overview</Text>
            </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
               <View style={styles.summaryTopRow}>
                   <Text style={styles.summaryLabel}>Total School Attendance</Text>
                   <View style={styles.trendWrap}>
                       <Ionicons name="arrow-up" size={12} color={TREND_UP} />
                       <Text style={[styles.trendText, { color: TREND_UP }]}>1.2%</Text>
                   </View>
               </View>
               <Text style={styles.summaryValue}>92.5%</Text>
            </View>

            <View style={styles.summaryCard}>
               <View style={styles.summaryTopRow}>
                   <Text style={styles.summaryLabel}>Global Avg. Marks</Text>
                   <View style={[styles.trendWrap, { backgroundColor: '#FEF3C7' }]}>
                       <Text style={[styles.trendText, { color: TREND_FLAT, marginLeft: 0 }]}>— Flat</Text>
                   </View>
               </View>
               <Text style={styles.summaryValue}>78<Text style={styles.summaryValueSuffix}>/100</Text></Text>
            </View>
        </View>

        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Class Performance</Text>
            
            {MOCK_CLASSES.map((cls) => (
                <TouchableOpacity 
                  key={cls.id} 
                  style={styles.classCard}
                  activeOpacity={0.7}
                  onPress={() => setSelectedClass(cls)}
                >
                    <View style={styles.classCardLeft}>
                        <Text style={styles.className}>{cls.name}</Text>
                        <View style={styles.classMetrics}>
                            <Text style={styles.classMetricText}>Attendance: {cls.attendance}%</Text>
                            <View style={styles.metricDivider} />
                            <Text style={styles.classMetricText}>Avg Marks: {cls.avgMarks}%</Text>
                        </View>
                    </View>
                    <View style={styles.classCardRight}>
                        <View style={[styles.statusPill, { backgroundColor: getStatusColor(cls.status) }]}>
                            <Text style={[styles.statusText, { color: getStatusTextColor(cls.status) }]}>
                                {cls.status === 'Green' ? 'Optimal' : cls.status === 'Amber' ? 'At Risk' : 'Critical'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={BRAND_NAVY} style={{ marginLeft: 8 }} />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedClass}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedClass(null)}
      >
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedClass(null)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Done</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedClass ? selectedClass.name : ''} Overview</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.toggleContainer}>
                <TouchableOpacity 
                   style={[styles.toggleBtn, drillDownType === 'Attendance' ? styles.toggleBtnActive : null]}
                   onPress={() => setDrillDownType('Attendance')}
                >
                    <Text style={[styles.toggleBtnText, drillDownType === 'Attendance' ? styles.toggleBtnTextActive : null]}>
                        Attendance
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   style={[styles.toggleBtn, drillDownType === 'Marks' ? styles.toggleBtnActive : null]}
                   onPress={() => setDrillDownType('Marks')}
                >
                    <Text style={[styles.toggleBtnText, drillDownType === 'Marks' ? styles.toggleBtnTextActive : null]}>
                        Marks
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={SLATE_GREY} style={styles.searchIcon} />
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search students..."
                    placeholderTextColor={SLATE_GREY}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="words"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={SLATE_GREY} />
                    </TouchableOpacity>
                ) : null}
            </View>

            <ScrollView style={styles.studentList} showsVerticalScrollIndicator={false}>
                {filteredStudents.map(student => (
                    <View key={student.id} style={styles.studentRow}>
                        <View style={styles.studentInfo}>
                            <Image source={{ uri: student.avatar }} style={styles.studentAvatar} />
                            <Text style={styles.studentName}>{student.name}</Text>
                        </View>
                        <View style={styles.studentMetricWrap}>
                            {drillDownType === 'Attendance' ? (
                                <Text style={[
                                    styles.studentMetricText, 
                                    { color: student.attendance === 'Present' ? '#059669' : '#DC2626' }
                                ]}>
                                    {student.attendance}
                                </Text>
                            ) : (
                                <Text style={[styles.studentMetricText, { color: BRAND_NAVY }]}>
                                    {student.marks}/100
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
                {filteredStudents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No students found tuning "{searchQuery}"</Text>
                    </View>
                ) : null}
                <View style={{ height: 40 }}/>
            </ScrollView>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  headerArea: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    zIndex: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerTextWrap: {
      flex: 1,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: 0.5,
  },
  scrollContent: {
      paddingBottom: 40,
  },
  summaryContainer: {
      paddingHorizontal: 20,
      paddingTop: 24,
      flexDirection: 'column',
      gap: 16,
  },
  summaryCard: {
      backgroundColor: PURE_WHITE,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
  },
  summaryTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  summaryLabel: {
      fontSize: 15,
      color: SLATE_GREY,
      fontWeight: '600',
  },
  trendWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
  },
  trendText: {
      fontSize: 12,
      fontWeight: '700',
      marginLeft: 4,
  },
  summaryValue: {
      fontSize: 28,
      fontWeight: '800',
      color: DARK_TEXT,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  summaryValueSuffix: {
      fontSize: 16,
      color: SLATE_GREY,
      fontWeight: '600',
  },
  sectionContainer: {
      paddingHorizontal: 20,
      marginTop: 28,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: BRAND_NAVY,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
      marginBottom: 16,
  },
  classCard: {
      backgroundColor: PURE_WHITE,
      borderRadius: 16,
      padding: 18,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 2,
  },
  classCardLeft: {
      flex: 1,
  },
  className: {
      fontSize: 18,
      fontWeight: '800',
      color: BRAND_NAVY,
      marginBottom: 6,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  classMetrics: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  classMetricText: {
      fontSize: 13,
      color: SLATE_GREY,
      fontWeight: '500',
  },
  metricDivider: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#CBD5E1',
      marginHorizontal: 8,
  },
  classCardRight: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  statusPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
  },
  statusText: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
  },
  modalContainer: {
      flex: 1,
      backgroundColor: BG_LIGHT,
  },
  modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 20 : 24,
      paddingBottom: 16,
      backgroundColor: PURE_WHITE,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
  },
  closeButton: {
      padding: 4,
  },
  closeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#3B82F6',
  },
  modalTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: BRAND_NAVY,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  toggleContainer: {
      flexDirection: 'row',
      backgroundColor: '#E2E8F0',
      borderRadius: 12,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 4,
  },
  toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
  },
  toggleBtnActive: {
      backgroundColor: PURE_WHITE,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  toggleBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: SLATE_GREY,
  },
  toggleBtnTextActive: {
      color: BRAND_NAVY,
      fontWeight: '700',
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: PURE_WHITE,
      borderRadius: 12,
      marginHorizontal: 20,
      marginTop: 20,
      paddingHorizontal: 16,
      height: 48,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 6,
      elevation: 1,
      borderWidth: 1,
      borderColor: '#F1F5F9',
  },
  searchIcon: {
      marginRight: 10,
  },
  searchInput: {
      flex: 1,
      fontSize: 15,
      color: DARK_TEXT,
      fontWeight: '500',
  },
  studentList: {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 16,
      paddingTop: 8,
  },
  studentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: PURE_WHITE,
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 6,
      elevation: 1,
  },
  studentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  studentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: '#F1F5F9',
  },
  studentName: {
      fontSize: 16,
      fontWeight: '700',
      color: BRAND_NAVY,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  studentMetricWrap: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#F8FAFC',
      borderRadius: 10,
  },
  studentMetricText: {
      fontSize: 14,
      fontWeight: '700',
  },
  emptyState: {
      padding: 40,
      alignItems: 'center',
  },
  emptyStateText: {
      fontSize: 14,
      color: SLATE_GREY,
      fontStyle: 'italic',
  }
});
