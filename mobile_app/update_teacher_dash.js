const fs = require('fs');

const content = `import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useTimetable } from '../../../src/hooks/useTimetable';
import type { ScheduleStatus } from '../../../src/types';

const BRAND_NAVY = '#153462';
const BG_COLOR = '#F5F6F8';

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
    { icon: 'analytics-outline' as const, label: 'Enter Marks', route: '/marks' },
    { icon: 'calendar-outline' as const, label: 'Apply Leave', route: '/apply-leave' },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Profile Section */}
      <View style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>{profile?.name ?? 'Teacher'}</Text>
          <Text style={styles.roleText}>{profile?.metadata?.subject ?? 'Subject'} Teacher</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-outline" size={28} color={BRAND_NAVY} />
        </View>
      </View>

      {/* Single Row Quick Actions */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.actionScrollContent}
        style={styles.actionScroll}
      >
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionPill}
            activeOpacity={0.7}
            onPress={() => router.push(action.route as any)}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name={action.icon} size={22} color={BRAND_NAVY} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Today's Schedule List */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Today's Classes</Text>
        <TouchableOpacity onPress={() => router.push('/timetable')}>
          <Text style={styles.viewAllText}>View Timetable</Text>
        </TouchableOpacity>
      </View>

      {scheduleLoading || !todaySchedule ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading schedule...</Text>
        </View>
      ) : todaySchedule.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-clear-outline" size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyStateTitle}>No Classes Scheduled</Text>
          <Text style={styles.emptyStateText}>You have a free day today!</Text>
        </View>
      ) : (
        todaySchedule.map((item, index) => {
          const isOngoing = item.status === 'ongoing';
          const isCompleted = item.status === 'completed';
          
          return (
            <View key={item.id ?? index.toString()} style={[styles.scheduleCard, isCompleted && styles.scheduleCardDimmed]}>
              <View style={[styles.timelineStatus, { backgroundColor: isOngoing ? '#10B981' : isCompleted ? '#E2E8F0' : BRAND_NAVY }]} />
              <View style={styles.scheduleInfo}>
                <View style={styles.scheduleHeaderRow}>
                  <Text style={[styles.timeText, isCompleted && styles.textDimmed]}>{item.startTime} - {item.endTime}</Text>
                  {isOngoing && (
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.subjectText, isCompleted && styles.textDimmed]}>{item.subject}</Text>
                <View style={styles.scheduleMeta}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="school-outline" size={14} color="#64748B" />
                    <Text style={styles.metaLabel}>Class {item.class}</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.metaLabel}>Room {item.room}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      )}

      {/* Homework Summary / Quick Summary Tile */}
      <Text style={styles.sectionTitle}>Reminders</Text>
      <View style={styles.infoTile}>
        <View style={styles.infoWrapper}>
          <Ionicons name="document-text-outline" size={24} color="#F59E0B" />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoContentTitle}>Lesson Plans Due</Text>
          <Text style={styles.infoContentDesc}>Remember to upload your weekly syllabus by Friday 4 PM.</Text>
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
    paddingTop: 8,
  },
  headerCard: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '700',
    marginBottom: 2,
  },
  roleText: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(21, 52, 98, 0.05)',
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
    marginTop: 12,
  },
  viewAllText: {
    fontSize: 13,
    color: BRAND_NAVY,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  actionScroll: {
    flexGrow: 0,
    marginBottom: 24,
  },
  actionScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  actionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  scheduleCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
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
    fontWeight: '600',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
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
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  infoTile: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  infoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFBEB', // Light amber
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoContentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  infoContentDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  }
});
`
fs.writeFileSync('app/(drawer)/(tabs)/index.tsx', content);
