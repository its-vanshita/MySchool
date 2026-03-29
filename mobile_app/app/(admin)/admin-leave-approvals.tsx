import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../../src/context/UserContext';
import { useAllLeaveRequests } from '../../src/hooks/useLeaveRequests';
import { useNotificationBadge } from '../../src/context/NotificationContext';
import { updateLeaveStatus } from '../../src/services/supabaseService';
import type { LeaveRequest, LeaveStatus } from '../../src/types';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const { width } = Dimensions.get('window');

const STATUS_CONFIG: Record<LeaveStatus, { color: string; bg: string; border: string; icon: string; label: string }> = {
  pending:  { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', icon: 'time-outline',     label: 'Pending' },
  approved: { color: '#059669', bg: '#D1FAE5', border: '#A7F3D0', icon: 'checkmark-circle', label: 'Approved' },
  rejected: { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', icon: 'close-circle',     label: 'Rejected' },
};

function daysBetween(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.round(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const created = new Date(dateStr);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(dateStr);
}

export default function AdminLeaveApprovalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useUser();
  const { addNotification } = useNotificationBadge();
  const { leaves: allLeaves, loading, refreshing, refresh } = useAllLeaveRequests();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const filteredLeaves = useMemo(() => {
    if (statusFilter === 'all') return allLeaves;
    return allLeaves.filter((l) => l.status === statusFilter);
  }, [allLeaves, statusFilter]);

  const stats = useMemo(() => {
    const approved = allLeaves.filter((l) => l.status === 'approved');
    const pending = allLeaves.filter((l) => l.status === 'pending');
    const rejected = allLeaves.filter((l) => l.status === 'rejected');
    return {
      total: allLeaves.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
    };
  }, [allLeaves]);

  const handleApprove = (item: LeaveRequest) => {
    Alert.alert('Approve Leave', `Approve leave request from ${item.teacher_name || 'Teacher'}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          await updateLeaveStatus(item.id, 'approved', profile?.id ?? '');      
          addNotification({
            title: 'Leave Approved',
            message: `You approved ${item.teacher_name}'s leave from ${formatDateShort(item.from_date)} to ${formatDateShort(item.to_date)}.`,
            type: 'leave',
          });
          refresh();
        },
      },
    ]);
  };

  const handleReject = (item: LeaveRequest) => {
    Alert.alert('Reject Leave', `Reject leave request from ${item.teacher_name || 'Teacher'}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          await updateLeaveStatus(item.id, 'rejected', profile?.id ?? '');      
          addNotification({
            title: 'Leave Rejected',
            message: `You rejected ${item.teacher_name}'s leave from ${formatDateShort(item.from_date)} to ${formatDateShort(item.to_date)}.`,
            type: 'leave',
          });
          refresh();
        },
      },
    ]);
  };

  const renderLeave = ({ item }: { item: LeaveRequest }) => {
    const config = STATUS_CONFIG[item.status];
    const days = daysBetween(item.from_date, item.to_date);
    const ago = item.created_at ? timeAgo(item.created_at) : '';

    return (
      <View style={[styles.card, { borderLeftColor: config.color, borderLeftWidth: 4 }]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.nameRow}>
              <View style={[styles.avatarCircle, { backgroundColor: config.bg, borderColor: config.border, borderWidth: 1 }]}>
                <Text style={[styles.avatarText, { color: config.color }]}>     
                  {(item.teacher_name || 'T').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.teacherName}>{item.teacher_name || 'Teacher'}</Text>
                <Text style={styles.agoText}>Applied {ago}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusChip, { backgroundColor: config.bg, borderColor: config.border }]}>
            <View style={[styles.statusDot, { backgroundColor: config.color }]} />
            <Text style={[styles.statusLabel, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>

        {/* Date range */}
        <View style={styles.dateSection}>
          <View style={styles.dateCol}>
            <Text style={styles.dateMeta}>FROM</Text>
            <Text style={styles.dateMain}>{formatDateShort(item.from_date)}</Text>
          </View>
          <View style={styles.dateArrow}>
            <View style={styles.arrowLine} />
            <View style={styles.daysPill}>
              <Text style={styles.daysPillText}>{days} {days === 1 ? 'day' : 'days'}</Text>
            </View>
            <View style={styles.arrowLine} />
          </View>
          <View style={[styles.dateCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.dateMeta}>TO</Text>
            <Text style={styles.dateMain}>{formatDateShort(item.to_date)}</Text>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.reasonSection}>
          <Ionicons name="chatbox-ellipses-outline" size={16} color={SLATE_GREY} style={{ marginTop: 2 }} />
          <Text style={styles.reasonText} numberOfLines={2}>{item.reason}</Text>
        </View>

        {/* Approval buttons */}
        {item.status === 'pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />    
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle" size={18} color="#DC2626" />        
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerSection}>
      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time" size={24} color="#D97706" />
          </View>
          <View>
            <Text style={[styles.statBoxNum, { color: '#D97706' }]}>{stats.pendingCount}</Text>
            <Text style={styles.statBoxLabel}>Pending</Text>
          </View>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.statIconCircle, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />      
          </View>
          <View>
            <Text style={[styles.statBoxNum, { color: '#059669' }]}>{stats.approvedCount}</Text>
            <Text style={styles.statBoxLabel}>Approved</Text>
          </View>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="close-circle" size={24} color="#DC2626" />
          </View>
          <View>
            <Text style={[styles.statBoxNum, { color: '#DC2626' }]}>{stats.rejectedCount}</Text>
            <Text style={styles.statBoxLabel}>Rejected</Text>
          </View>
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => {     
          const active = statusFilter === f;
          const count = f === 'all' ? stats.total : f === 'pending' ? stats.pendingCount : f === 'approved' ? stats.approvedCount : stats.rejectedCount;        
          const chipColor = f === 'pending' ? '#D97706' : f === 'approved' ? '#059669' : f === 'rejected' ? '#DC2626' : BRAND_NAVY;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, active && { backgroundColor: chipColor, borderColor: chipColor }]}
              onPress={() => setStatusFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, active && { color: '#fff' }]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
              {count > 0 && (
                <View style={[styles.filterChipBadge, active ? { backgroundColor: 'rgba(255,255,255,0.3)' } : { backgroundColor: '#E2E8F0' }]}>
                  <Text style={[styles.filterChipBadgeText, active ? { color: '#fff' } : { color: SLATE_GREY }]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={[styles.mainHeaderArea, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <View style={styles.mainHeaderTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Leave Approvals</Text>
          </View>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={BRAND_NAVY} />
        </View>
      ) : (
        <FlatList
          data={filteredLeaves}
          keyExtractor={(item) => item.id}
          renderItem={renderLeave}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[BRAND_NAVY]} tintColor={BRAND_NAVY} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="document-text-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Leave Requests</Text>
              <Text style={styles.emptySubtext}>
                {statusFilter === 'all' 
                  ? 'There are no leave requests at this time.' 
                  : `There are no ${statusFilter} leave requests.`}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  mainHeaderArea: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  mainHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 4,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Stats Grid matching modern style
  headerSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    gap: 12,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  statBoxLabel: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '600',
    marginTop: 2,
  },

  // Filter Chips Custom
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURE_WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: SLATE_GREY,
  },
  filterChipBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Cards
  card: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
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
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  agoText: {
    fontSize: 12,
    color: SLATE_GREY,
    fontWeight: '500',
    marginTop: 2,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dateCol: {
    flex: 1,
  },
  dateMeta: {
    fontSize: 10,
    fontWeight: '700',
    color: SLATE_GREY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateMain: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  dateArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  arrowLine: {
    width: 12,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  daysPill: {
    backgroundColor: PURE_WHITE,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  daysPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: SLATE_GREY,
  },
  reasonSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: SLATE_GREY,
    lineHeight: 20,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  approveBtn: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  approveBtnText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#FFFFFF' 
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectBtnText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#DC2626' 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: DARK_TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: SLATE_GREY,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
