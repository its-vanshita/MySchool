const fs = require('fs');

const content = `import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useSharedUsers } from '../../../src/hooks/useSharedUsers';

const BRAND_NAVY = '#153462';
const BG_COLOR = '#F5F7FA'; // Slightly softer background to make white cards pop

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  // Using specific names as requested for the high-resolution photographic mockup
  const displayName = 'Gaurav Daultani';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); }, 1000);
  }, []);

  const quickActions = [
    { icon: 'megaphone-outline' as const, label: 'Assign Notice', route: '/assign-notice' },
    { icon: 'document-text-outline' as const, label: 'Leave Approvals', route: '/admin-leave-approvals' },
    { icon: 'time-outline' as const, label: 'Manage Timetable', route: '/admin-manage-timetable' },
    { icon: 'calendar-outline' as const, label: 'Manage Calendar', route: '/admin-manage-calendar' },
    { icon: 'book-outline' as const, label: 'Lesson Plans', route: '/admin-lesson-plans' },
    { icon: 'pie-chart-outline' as const, label: 'Analytics', route: '/admin-analytics' },
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
          <Text style={styles.greetingHeader}>Good Morning, {displayName}</Text>
          <Text style={styles.roleText}>School Administrator</Text>
        </View>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://ui-avatars.com/api/?name=Gaurav+Daultani&background=153462&color=fff&size=128' }} 
            style={styles.avatarImage} 
          />
          <View style={styles.statusIndicator} />
        </View>
      </View>

      {/* Quick Actions Grid */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridTile}
            activeOpacity={0.7}
            onPress={() => router.push(action.route as any)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={action.icon} size={28} color={BRAND_NAVY} />
            </View>
            <Text style={styles.gridLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Overview */}
      <Text style={styles.sectionTitle}>Daily Overview</Text>
      
      {/* Primary Data Card */}
      <View style={styles.overviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="people-outline" size={22} color="#64748B" />
            <Text style={styles.cardTitle}>Total Students</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/admin-analytics')}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.primaryDataNumber}>80</Text>
          <View style={styles.insightTag}>
            <Text style={styles.insightTagText}>91.7% Present Today</Text>
          </View>
        </View>
        
        {/* Segmented Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressSegment, { width: '91.7%', backgroundColor: '#10B981', borderTopRightRadius: 0, borderBottomRightRadius: 0 }]} />
          <View style={[styles.progressSegment, { width: '8.3%', backgroundColor: '#F43F5E', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]} />
        </View>
        
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>73 Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F43F5E' }]} />
            <Text style={styles.legendText}>7 Absent</Text>
          </View>
          <View style={styles.trendContainer}>
            <Ionicons name="trending-up-outline" size={16} color="#10B981" />
          </View>
        </View>
      </View>

      {/* Partially visible secondary cards laid out horizontally */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardsScroll}>
        <View style={[styles.secondaryCard, { width: 220 }]}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="document-text-outline" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>Pending Leave Req</Text>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.secondaryDataNumber}>3</Text>
            <Text style={styles.secondarySubText}>Awaiting your approval</Text>
          </View>
        </View>
        
        <View style={[styles.secondaryCard, { width: 220 }]}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="megaphone-outline" size={20} color="#3B82F6" />
            <Text style={styles.cardTitle}>Event Notifications</Text>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.secondaryDataNumber}>2</Text>
            <Text style={styles.secondarySubText}>Upcoming this week</Text>
          </View>
        </View>
      </ScrollView>

      {/* Today's Schedule */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleNoMargin}>Today's Schedule</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.scheduleEmptyCard}>
        <View style={styles.scheduleIconWrapper}>
          <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
        </View>
        <View style={styles.scheduleEmptyTextContainer}>
          <Text style={styles.scheduleEmptyTitle}>No classes scheduled today</Text>
          <Text style={styles.scheduleEmptySub}>Enjoy your free day!</Text>
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
    padding: 20,
    paddingTop: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  profileInfo: {
    flex: 1,
    paddingRight: 16,
  },
  greetingHeader: {
    fontSize: 20,
    color: '#1E293B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  roleText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_NAVY,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
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
    fontWeight: '600',
    color: '#3B82F6',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  gridTile: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  iconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  gridLabel: {
    fontSize: 12,
    color: '#334155',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '700',
    lineHeight: 16,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  primaryDataNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    lineHeight: 56,
    letterSpacing: -1,
  },
  insightTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  insightTagText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  progressContainer: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  progressSegment: {
    height: '100%',
    borderRadius: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  trendContainer: {
    marginLeft: 'auto',
    backgroundColor: '#ECFDF5',
    padding: 4,
    borderRadius: 12,
  },
  horizontalCardsScroll: {
    gap: 14,
    paddingBottom: 28,
  },
  secondaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  secondaryDataNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  secondarySubText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scheduleEmptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  scheduleIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  scheduleEmptyTextContainer: {
    flex: 1,
  },
  scheduleEmptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  scheduleEmptySub: {
    fontSize: 14,
    color: '#64748B',
  }
});
`
fs.writeFileSync('app/(admin-drawer)/(tabs)/index.tsx', content);
