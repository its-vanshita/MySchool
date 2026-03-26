import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const SUCCESS_GREEN = '#10B981';
const SUCCESS_BG = '#ECFDF5';
const AMBER_GOLD = '#F59E0B';
const AMBER_BG = '#FFFBEB';
const BLUE_ACCENT = '#3B82F6';

const DEMO_EXAMS = [
  { id: '1', class_name: 'Class 10-A', subject: 'Mathematics', exam_date: '2026-03-20', start_time: '09:00 AM', end_time: '12:00 PM', room: 'Hall A', color: '#3B82F6' },
  { id: '2', class_name: 'Class 10-A', subject: 'Science', exam_date: '2026-03-22', start_time: '09:00 AM', end_time: '12:00 PM', room: 'Hall B', color: '#10B981' },
  { id: '3', class_name: 'Class 10-A', subject: 'English', exam_date: '2026-03-28', start_time: '09:00 AM', end_time: '12:00 PM', room: 'Hall A', color: '#8B5CF6' },
  { id: '4', class_name: 'Class 10-A', subject: 'Hindi', exam_date: '2026-03-30', start_time: '09:00 AM', end_time: '12:00 PM', room: 'Hall C', color: '#EC4899' },
  { id: '5', class_name: 'Class 10-A', subject: 'Social Studies', exam_date: '2026-04-02', start_time: '09:00 AM', end_time: '12:00 PM', room: 'Hall A', color: '#F97316' },
  { id: '6', class_name: 'Class 10-A', subject: 'Computer Science', exam_date: '2026-04-05', start_time: '09:00 AM', end_time: '11:00 AM', room: 'Lab 1', color: '#14B8A6' },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function AdminDatesheetScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Tabs.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: BRAND_NAVY, elevation: 0, shadowOpacity: 0 },
          headerTintColor: PURE_WHITE,
          headerTitle: 'Exams',
          headerTitleStyle: {
             fontWeight: '700',
             fontSize: 20,
             fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Top Announcement Card */}
        <View style={styles.announcementCard}>
          <View style={styles.announcementIconWrap}>
             <Ionicons name="pin" size={20} color={BRAND_NAVY} />
          </View>
          <View style={styles.announcementTextWrap}>
            <Text style={styles.announcementTitle}>Final Examination Datesheet (Class 10)</Text>
            <Text style={styles.announcementSub}>Published on March 15, 2026</Text>
          </View>
        </View>

        {/* Exam Type Banner */}
        <View style={styles.feedHeader}>
          <Ionicons name="school" size={22} color={PURE_WHITE} />
          <Text style={styles.feedHeaderText}>Upcoming Tracked Exams</Text>
        </View>

        {/* Exams List */}
        <View style={styles.listContainer}>
          {DEMO_EXAMS.map((exam, idx) => {
             const examDate = new Date(exam.exam_date + 'T00:00:00');
             const today = new Date();
             today.setHours(0, 0, 0, 0);
             const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
             const isPast = daysUntil < 0;
             const isNext = !isPast && daysUntil >= 0 && daysUntil <= 3; // Highlight as next if within 3 days
             
             return (
               <View key={exam.id} style={[styles.examCard, isPast && styles.examCardPast]}>
                 <View style={[styles.cardAccent, { backgroundColor: exam.color }]} />
                 
                 {/* Left Date Column */}
                 <View style={styles.dateCol}>
                    <Text style={styles.dateNum}>{examDate.getDate()}</Text>
                    <Text style={styles.dateMonthDay}>{DAYS[examDate.getDay()]} • {MONTHS[examDate.getMonth()]}</Text>
                 </View>

                 {/* Divider */}
                 <View style={styles.dateDivider} />

                 {/* Central Content */}
                 <View style={styles.contentCol}>
                    <Text style={styles.subjectText}>{exam.subject}</Text>
                    
                    <View style={styles.detailRow}>
                       <Ionicons name="time-outline" size={14} color={BRAND_NAVY} />
                       <Text style={styles.detailText}>{exam.start_time} - {exam.end_time}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                       <Ionicons name="location-outline" size={14} color={BRAND_NAVY} />
                       <Text style={styles.detailText}>{exam.room}</Text>
                    </View>
                 </View>

                 {/* Status Pill */}
                 <View style={styles.statusCol}>
                    {isPast ? (
                       <View style={[styles.statusPill, { backgroundColor: SUCCESS_BG }]}>
                          <Text style={[styles.statusPillText, { color: SUCCESS_GREEN }]}>Done</Text>
                       </View>
                    ) : isNext ? (
                       <View style={[styles.statusPill, { backgroundColor: AMBER_BG }]}>
                          <Text style={[styles.statusPillText, { color: AMBER_GOLD }]}>In {daysUntil} {daysUntil === 1 ? 'Day' : 'Days'}</Text>
                       </View>
                    ) : null}
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
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  announcementIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  announcementTextWrap: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 4,
  },
  announcementSub: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE_ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: BLUE_ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  feedHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: PURE_WHITE,
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  listContainer: {
    gap: 16,
  },
  examCard: {
    flexDirection: 'row',
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    paddingRight: 12,
  },
  examCardPast: {
    opacity: 0.6,
  },
  cardAccent: {
    width: 4,
    height: '100%',
  },
  dateCol: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dateNum: {
    fontSize: 26,
    fontWeight: '800',
    color: BLUE_ACCENT,
    marginBottom: 4,
  },
  dateMonthDay: {
    fontSize: 10,
    fontWeight: '700',
    color: SLATE_GREY,
    letterSpacing: 0.5,
  },
  dateDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#F1F5F9',
    alignSelf: 'center',
  },
  contentCol: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  subjectText: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_NAVY,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusCol: {
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
