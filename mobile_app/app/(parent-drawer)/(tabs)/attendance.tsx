import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const SUCCESS_GREEN = '#10B981';
const DANGER_RED = '#F43F5E';
const LATE_ORANGE = '#F59E0B';
const EXCUSED_BLUE = '#3B82F6';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Demo attendance data for the child
const DEMO_ATTENDANCE: Record<string, { date: string; status: 'present' | 'absent' | 'late' | 'excused' }[]> = {
  'Mar 2026': [
    { date: '2026-03-02', status: 'present' },
    { date: '2026-03-03', status: 'present' },
    { date: '2026-03-04', status: 'present' },
    { date: '2026-03-05', status: 'absent' },
    { date: '2026-03-06', status: 'present' },
    { date: '2026-03-07', status: 'present' },
    { date: '2026-03-09', status: 'present' },
    { date: '2026-03-10', status: 'present' },
  ],
};

const STATUS_LABELS: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
};

const STATUS_COLORS: Record<string, string> = {
  present: SUCCESS_GREEN,
  absent: DANGER_RED,
  late: LATE_ORANGE,
  excused: EXCUSED_BLUE,
};

export default function ParentAttendanceScreen() {
  const insets = useSafeAreaInsets();
  const now = new Date();
  const currentMonthKey = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const monthKeys = Object.keys(DEMO_ATTENDANCE);
  const [selectedMonth, setSelectedMonth] = useState(monthKeys.includes(currentMonthKey) ? currentMonthKey : monthKeys[0]);

  const records = DEMO_ATTENDANCE[selectedMonth] || [];
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const excusedCount = records.filter(r => r.status === 'excused').length;
  const totalDays = records.length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Tabs.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: BRAND_NAVY, elevation: 0, shadowOpacity: 0 },
          headerTintColor: PURE_WHITE,
          headerTitle: 'Attendance',
          headerTitleStyle: {
             fontWeight: '700',
             fontSize: 20,
             fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* The Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.childInfoRow}>
            <View style={styles.avatarWrap}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
                style={styles.childAvatar} 
              />
            </View>
            <View style={styles.childTextWrap}>
              <Text style={styles.childName}>Arjun Sharma</Text>
              <Text style={styles.childClass}>Class 8-B</Text>
            </View>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Campus Open</Text>
          </View>
        </View>

        {/* The Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.heroSection}>
            <View style={styles.ringWrapper}>
               <View style={styles.ringGlow} />
               <View style={styles.circularProgressContainer}>
                  {/* Pseudo Circular Progress */}
                  <View style={[styles.progressCircle, { borderColor: SUCCESS_GREEN + '40', borderWidth: 8 }]} />
                  {/* We fake a partial circle for simplicity in normal React Native View without SVG, 
                      for actual implementation one would use react-native-svg. We'll use a styled container to look like a ring. */}
                  <View style={[styles.progressCircleInner, { borderColor: SUCCESS_GREEN, borderWidth: 8, borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: [{rotate: '45deg'}] }]} />
                  <View style={styles.ringCenterText}>
                     <Text style={styles.ringPercentageText}>88%</Text>
                     <Text style={styles.ringPercentageLabel}>Attendance</Text>
                  </View>
               </View>
            </View>
          </View>
          
          <View style={styles.legendGrid}>
             <View style={styles.legendCol}>
                <Ionicons name="checkmark-circle" size={24} color={BRAND_NAVY} style={{ opacity: 0.8 }} />
                <Text style={styles.legendCount}>{presentCount}</Text>
                <Text style={styles.legendLabel}>Present</Text>
             </View>
             <View style={styles.legendCol}>
                <Ionicons name="close-circle" size={24} color={BRAND_NAVY} style={{ opacity: 0.8 }} />
                <Text style={styles.legendCount}>{absentCount}</Text>
                <Text style={styles.legendLabel}>Absent</Text>
             </View>
             <View style={styles.legendCol}>
                <Ionicons name="time" size={24} color={BRAND_NAVY} style={{ opacity: 0.8 }} />
                <Text style={styles.legendCount}>{lateCount}</Text>
                <Text style={styles.legendLabel}>Late</Text>
             </View>
             <View style={styles.legendCol}>
                <Ionicons name="document-text" size={24} color={BRAND_NAVY} style={{ opacity: 0.8 }} />
                <Text style={styles.legendCount}>{excusedCount}</Text>
                <Text style={styles.legendLabel}>Excused</Text>
             </View>
          </View>
        </View>

        {/* Attendance Chronicle (List) */}
        <Text style={styles.sectionTitle}>Attendance Chronicle</Text>
        
        <View style={styles.listContainer}>
          {records.map((record) => {
            const d = new Date(record.date + 'T00:00:00');
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = dayNames[d.getDay()];
            const color = STATUS_COLORS[record.status];

            return (
              <View key={record.date} style={styles.recordCard}>
                <View style={[styles.cardAccent, { backgroundColor: color }]} />
                
                <View style={styles.recordContent}>
                   <View style={styles.recordDateCol}>
                      <Text style={styles.recordDayNum}>{d.getDate()}</Text>
                      <Text style={styles.recordDayName}>{dayName}</Text>
                   </View>
                   
                   <View style={styles.recordSpacer} />
                   
                   <View style={styles.glassPill}>
                      <Text style={[styles.glassPillText, { color: BRAND_NAVY }]}>{STATUS_LABELS[record.status]}</Text>
                   </View>
                </View>
              </View>
            );
          })}
        </View>

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
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // Identity Card
  identityCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },
  childInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginRight: 14,
  },
  childAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  childTextWrap: {
    justifyContent: 'center',
  },
  childName: {
    fontSize: 17,
    fontWeight: '700',
    color: BRAND_NAVY,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  childClass: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // light-grey capsule
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SUCCESS_GREEN, // Emerald Green dot
    marginRight: 6,
    shadowColor: SUCCESS_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 12,
    color: BRAND_NAVY,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ringWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#34D399',
    opacity: 0.15,
    transform: [{ scale: 1.2 }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  circularProgressContainer: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  progressCircleInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  ringCenterText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercentageText: {
    fontSize: 32,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  ringPercentageLabel: {
    fontSize: 12,
    color: SLATE_GREY,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  legendGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendCol: {
    alignItems: 'center',
  },
  legendCount: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_NAVY,
    marginTop: 8,
    marginBottom: 2,
  },
  legendLabel: {
    fontSize: 11,
    color: SLATE_GREY,
    fontWeight: '600',
  },

  // Chronicle List
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_NAVY,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  listContainer: {
    gap: 12,
  },
  recordCard: {
    flexDirection: 'row',
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    height: 72,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccent: {
    width: 4,
    height: '100%',
  },
  recordContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  recordDateCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordDayNum: {
    fontSize: 20,
    fontWeight: '800',
    color: BRAND_NAVY,
  },
  recordDayName: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_NAVY,
  },
  recordSpacer: {
    flex: 1,
  },
  glassPill: {
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  glassPillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  }
});
