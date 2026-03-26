import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useTimetable } from '../../../src/hooks/useTimetable';
import type { ScheduleStatus } from '../../../src/types';

const BRAND_NAVY = '#153462';
const BG_COLOR = '#F8F9FB';

export default function DashboardScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { todaySchedule, loading: scheduleLoading } = useTimetable(profile?.id);
  const [refreshing, setRefreshing] = React.useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); }, 1000);
  }, []);

  const quickActions = [
    { icon: 'checkmark-circle-outline' as const, label: 'Attendance', route: '/mark-attendance' },
    { icon: 'book-outline' as const, label: 'Homework', route: '/add-homework' },
    { icon: 'trending-up-outline' as const, label: 'Enter Marks', route: '/marks' }
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <Text style={styles.greetingHeader}>{greeting()}, Gaurav Daultani</Text>
          <Text style={styles.roleText}>Subject Teacher - 10A</Text>
        </View>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200' }} 
            style={styles.avatarImage} 
          />
          <View style={styles.statusIndicator} />
        </View>
      </View>

      {/* Quick Actions Scroll */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.actionScrollContent}
        style={styles.actionScroll}
      >
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() => router.push(action.route as any)}
          >
            <Ionicons name={action.icon} size={28} color={BRAND_NAVY} style={{ marginBottom: 12, fontWeight: '300' }} />
            <Text style={styles.actionCardLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Today's Schedule List */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleNoMargin}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => router.push('/timetable')}>
          <Text style={styles.viewAllText}>View Timetable</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Live Class */}
      <View style={styles.featuredClassCard}>
        <View style={styles.featuredClassHeader}>
          <Text style={styles.timeText}>09:00 AM - 09:45 AM</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDotAnimated} />
            <Text style={styles.liveText}>Ongoing</Text>
          </View>
        </View>
        <View style={styles.featuredClassBody}>
          <View style={styles.accentLine} />
          <View style={styles.featuredClassInfo}>
            <Text style={styles.featuredSubjectText}>Mathematics</Text>
            <Text style={styles.featuredMetaText}>Class 10-A  |  Room 204</Text>
          </View>
        </View>
      </View>
      
      {/* Additional Schedule Sample */}
       <View style={[styles.scheduleCard, styles.scheduleCardDimmed]}>
        <View style={[styles.timelineStatus, { backgroundColor: '#E2E8F0' }]} />
        <View style={styles.scheduleInfo}>
          <View style={styles.scheduleHeaderRow}>
            <Text style={[styles.timeText, styles.textDimmed]}>10:00 AM - 10:45 AM</Text>
          </View>
          <Text style={[styles.subjectText, styles.textDimmed]}>Science</Text>
          <View style={styles.scheduleMeta}>
            <View style={styles.metaBadge}>
              <Ionicons name="school-outline" size={14} color="#64748B" />
              <Text style={styles.metaLabel}>Class 10-B</Text>
            </View>
            <View style={styles.metaBadge}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.metaLabel}>Lab 1</Text>
            </View>
          </View>
        </View>
      </View>


      {/* Reminders Tile */}
      <Text style={styles.sectionTitle}>Priority Reminders</Text>
      <View style={styles.infoTile}>
        <View style={styles.infoWrapper}>
          <Ionicons name="alert-circle-outline" size={24} color="#D97706" />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoContentTitle}>Lesson Plans Due</Text>
          <Text style={styles.infoContentDesc}>Upload this week's syllabus by EOD.</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  content: {
    paddingTop: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  profileInfo: {
    flex: 1,
    paddingRight: 16,
  },
  greetingHeader: {
    fontSize: 22,
    color: '#1E293B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  roleText: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionTitleNoMargin: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  actionScroll: {
    flexGrow: 0,
    marginBottom: 28,
  },
  actionScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 104,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  actionCardLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    textAlign: 'center',
  },
  featuredClassCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  featuredClassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredClassBody: {
    flexDirection: 'row',
  },
  accentLine: {
    width: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    marginRight: 16,
  },
  featuredClassInfo: {
    flex: 1,
  },
  featuredSubjectText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  featuredMetaText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  scheduleCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 28,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  scheduleCardDimmed: {
    backgroundColor: '#F8FAFC',
    opacity: 0.7,
  },
  timelineStatus: {
    width: 6,
    backgroundColor: BRAND_NAVY,
  },
  scheduleInfo: {
    flex: 1,
    padding: 16,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subjectText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  textDimmed: {
    color: '#94A3B8',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  liveDotAnimated: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scheduleMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  infoTile: {
    marginHorizontal: 20,
    backgroundColor: '#FFFDF5', // Light cream base
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  infoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3C7', // Softer amber wrapper
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoContentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E', // Deeper amber text
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  infoContentDesc: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
    fontWeight: '500',
  }
});
