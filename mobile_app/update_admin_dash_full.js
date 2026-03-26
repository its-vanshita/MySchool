const fs = require('fs');

const content = `import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useSharedUsers } from '../../../src/hooks/useSharedUsers';
import { useTheme } from '../../../src/context/ThemeContext';

const BRAND_NAVY = '#153462';
const BG_COLOR = '#F5F6F8';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { teachers, students, loading: usersLoading } = useSharedUsers();
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
    { icon: 'notifications-outline' as const, label: 'Assign Notice', route: '/assign-notice' },
    { icon: 'document-text-outline' as const, label: 'Leave Approvals', route: '/admin-leave-approvals' },
    { icon: 'calendar-outline' as const, label: 'Manage Timetable', route: '/admin-manage-timetable' },
    { icon: 'today-outline' as const, label: 'Manage Calendar', route: '/admin-manage-calendar' },
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
      {/* Header Profile Section */}
      <View style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>{profile?.name ?? 'Admin User'}</Text>
          <Text style={styles.roleText}>School Administrator</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-outline" size={28} color={BRAND_NAVY} />
        </View>
      </View>

      {/* Quick Actions (2x3 Grid) */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridTile}
            activeOpacity={0.7}
            onPress={() => router.push(action.route as any)}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name={action.icon} size={24} color={BRAND_NAVY} />
            </View>
            <Text style={styles.gridLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Overview */}
      <Text style={styles.sectionTitle}>Daily Overview</Text>
      
      {/* Total Students Card */}
      <View style={styles.overviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="people-outline" size={20} color="#64748B" />
            <Text style={styles.cardTitle}>Total Students</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/admin-analytics')}>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardNumber}>{students.length > 0 ? students.length : 80}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>91.7% Present Today</Text>
          </View>
        </View>
        {/* Modern Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '91.7%' }]} />
        </View>
      </View>

      {/* Pending Leave Requests Card */}
      <View style={styles.overviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="time-outline" size={20} color="#64748B" />
            <Text style={styles.cardTitle}>Pending Leave Requests</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/admin-leave-approvals')}>
            <Ionicons name="arrow-forward-circle-outline" size={22} color={BRAND_NAVY} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardNumber}>3</Text>
          <Text style={styles.cardSubText}>Staff members awaiting approval</Text>
        </View>
      </View>

      {/* Notice View Count Card */}
      <View style={styles.overviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="megaphone-outline" size={20} color="#64748B" />
            <Text style={styles.cardTitle}>Active Notices</Text>
          </View>
        </View>
        <View style={styles.cardBodyRow}>
          <View>
            <Text style={styles.cardNumberAlt}>12</Text>
            <Text style={styles.cardSubText}>Published this week</Text>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="eye-outline" size={16} color="#10B981" />
            <Text style={styles.statChipText}>850+ Views</Text>
          </View>
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
    paddingTop: 8,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_NAVY,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  gridTile: {
    width: '31%', // Fits 3 items with small gap
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9', // Very light slate
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 12,
    color: '#334155',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
    lineHeight: 16,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  cardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  cardNumberAlt: {
    fontSize: 28,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  badgeContainer: {
    backgroundColor: '#ECFDF5', // Light green
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981', // Success green
    borderRadius: 3,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statChipText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  }
});
`
fs.writeFileSync('app/(admin-drawer)/(tabs)/index.tsx', content);
