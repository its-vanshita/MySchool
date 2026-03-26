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
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';

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
    { icon: 'megaphone-outline' as const, label: 'Notices', route: '/notices' },
    { icon: 'book-outline' as const, label: 'Homework', route: '/homework', badge: '2 New', badgeColor: '#3B82F6' },
    { icon: 'ribbon-outline' as const, label: 'Marks', route: '/marks' },
    { icon: 'wallet-outline' as const, label: 'Fee', route: '/fee', badge: 'Due', badgeColor: '#F87171' },
  ];

  const studentName = (profile as any)?.metadata?.studentName || 'Arjun Sharma';
  const studentClass = (profile as any)?.metadata?.studentClass || 'Class 8-B';

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      {/* Identity Section */}
      <View style={styles.headerSection}>
        <Text style={styles.greetingText}>{greeting()},</Text>
        <Text style={styles.userNameText}>{profile?.name || 'Mr. Rajesh Sharma'}</Text>

        {/* Child Profile Card */}
        <View style={styles.childCard}>
          <View style={styles.childInfoRow}>
            <View style={styles.avatarWrap}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
                style={styles.childAvatar} 
              />
            </View>
            <View style={styles.childTextWrap}>
              <Text style={styles.childName}>{studentName}</Text>
              <Text style={styles.childClass}>{studentClass}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.switchBtn} activeOpacity={0.7}>
            <Ionicons name="swap-horizontal" size={18} color={BRAND_NAVY} style={{ marginRight: 6 }} />
            <Text style={styles.switchBtnText}>Switch</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Access Grid */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.gridContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridTile}
            activeOpacity={0.7}
            onPress={() => router.push(action.route as any)}
          >
            <View style={styles.iconHeader}>
               <Ionicons name={action.icon} size={28} color={BRAND_NAVY} strokeWidth={2} />
               {action.badge && (
                  <View style={[styles.tileBadge, { backgroundColor: `${action.badgeColor}15` }]}>
                     <Text style={[styles.tileBadgeText, { color: action.badgeColor }]}>{action.badge}</Text>
                  </View>
               )}
            </View>
            <Text style={styles.gridLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Insights Section */}
      <Text style={styles.sectionTitle}>Academic Overview</Text>
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightTitle}>Attendance This Month</Text>
          <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
        </View>
        <View style={styles.insightBody}>
          <Text style={styles.insightValue}>94.5%</Text>
          <View style={styles.insightPill}>
             <Text style={styles.insightPillText}>Excellent</Text>
          </View>
        </View>
        <View style={styles.progressBarWrap}>
           <View style={[styles.progressBarFill]} />
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  content: {
    padding: 20,
    paddingTop: 12,
  },
  
  // Identity
  headerSection: {
    marginBottom: 28,
  },
  greetingText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 24,
    color: BRAND_NAVY,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 20,
  },
  childCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
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
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  childClass: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  switchBtnText: {
    fontSize: 13,
    color: BRAND_NAVY,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_NAVY,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  gridTile: {
    width: '48%', 
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 4,
  },
  iconHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tileBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tileBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  gridLabel: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  // Insights
  insightCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  insightBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  insightValue: {
    fontSize: 34,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  insightPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  insightPillText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarWrap: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '94.5%',
    height: '100%',
    backgroundColor: BRAND_NAVY,
    borderRadius: 2,
  },
});
