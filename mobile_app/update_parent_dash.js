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
import { useAuth } from '../../../src/context/AuthContext';

const BRAND_NAVY = '#153462';
const BG_COLOR = '#F5F6F8';

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { profile } = useUser();
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
    { icon: 'checkmark-circle-outline' as const, label: 'Attendance', route: '/attendance' },
    { icon: 'analytics-outline' as const, label: 'Marks', route: '/marks' },
    { icon: 'card-outline' as const, label: 'Fees', route: '/fee' },
    { icon: 'book-outline' as const, label: 'Homework', route: '/homework' },
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
          <Text style={styles.userName}>{profile?.name ?? 'Guardian'}</Text>
          <Text style={styles.roleText}>Parent Account</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-outline" size={28} color={BRAND_NAVY} />
        </View>
      </View>

      {/* Selected Ward Tile */}
      <View style={styles.wardCard}>
        <View style={styles.wardHeader}>
          <View style={styles.wardAvatar}>
            <Text style={styles.wardInitial}>{profile?.metadata?.studentName?.[0] ?? 'S'}</Text>
          </View>
          <View style={styles.wardInfo}>
            <Text style={styles.wardName}>{profile?.metadata?.studentName ?? 'Your Ward'}</Text>
            <Text style={styles.wardClass}>Class {profile?.metadata?.studentClass ?? '--'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.switchButton}>
          <Ionicons name="swap-horizontal" size={16} color={BRAND_NAVY} />
          <Text style={styles.switchText}>Switch</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions (2x2 Grid for Parents) */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
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

      {/* Academic Overview */}
      <Text style={styles.sectionTitle}>Academic Overview</Text>
      
      <View style={styles.overviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#64748B" />
            <Text style={styles.cardTitle}>Attendance This Month</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/attendance')}>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardNumber}>94.5%</Text>
          <View style={[styles.badgeContainer, { backgroundColor: '#ECFDF5' }]}>
            <Text style={[styles.badgeText, { color: '#059669' }]}>Excellent</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '94.5%', backgroundColor: '#10B981' }]} />
        </View>
      </View>

      {/* Upcoming Events / Fees */}
      <View style={styles.overviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>Fee Due Reminder</Text>
          </View>
        </View>
        <View style={styles.feeBody}>
          <View>
            <Text style={styles.feeAmount}>$450.00</Text>
            <Text style={styles.feeSubText}>2nd Term Tuition Fee</Text>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={() => router.push('/fee')}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
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
  wardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(21, 52, 98, 0.1)',
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  wardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_NAVY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wardInitial: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  wardInfo: {
    justifyContent: 'center',
  },
  wardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  wardClass: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  switchText: {
    fontSize: 12,
    color: BRAND_NAVY,
    fontWeight: '600',
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
    marginBottom: 28,
  },
  gridTile: {
    width: '48%', // Fits 2 items
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    marginBottom: 16,
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
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
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
  cardNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: {
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
    borderRadius: 3,
  },
  feeBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: BRAND_NAVY,
    marginBottom: 4,
  },
  feeSubText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  payButton: {
    backgroundColor: BRAND_NAVY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  }
});
`
fs.writeFileSync('app/(parent-drawer)/(tabs)/index.tsx', content);
