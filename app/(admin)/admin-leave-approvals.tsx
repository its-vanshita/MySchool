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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../src/context/UserContext';
import { useAllLeaveRequests } from '../src/hooks/useLeaveRequests';
import { useNotificationBadge } from '../src/context/NotificationContext';
import { updateLeaveStatus } from '../src/services/supabaseService';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';
import type { LeaveRequest, LeaveStatus } from '../src/types';

const STATUS_CONFIG: Record<LeaveStatus, { color: string; bg: string; border: string; icon: string; label: string }> = {
  pending:  { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', icon: 'time-outline',     label: 'Pending' },
  approved: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: 'checkmark-circle', label: 'Approved' },
  rejected: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: 'close-circle',     label: 'Rejected' },
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
      <View style={[styles.card, { borderLeftColor: config.color }]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.nameRow}>
              <View style={[styles.avatarCircle, { backgroundColor: config.color + '20' }]}>
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
            <Ionicons name={config.icon as any} size={14} color={config.color} />
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
          <Ionicons name="chatbox-ellipses-outline" size={14} color={colors.textLight} style={{ marginTop: 2 }} />
          <Text style={styles.reasonText} numberOfLines={2}>{item.reason}</Text>
        </View>

        {/* Approval buttons */}
        {item.status === 'pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(item)}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item)}
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
        <View style={[styles.statBox, styles.statBoxPending]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="time" size={20} color="#D97706" />
          </View>
          <Text style={[styles.statBoxNum, { color: '#D97706' }]}>{stats.pendingCount}</Text>
          <Text style={styles.statBoxLabel}>Pending</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxApproved]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
          </View>
          <Text style={[styles.statBoxNum, { color: '#059669' }]}>{stats.approvedCount}</Text>
          <Text style={styles.statBoxLabel}>Approved</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxRejected]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="close-circle" size={20} color="#DC2626" />
          </View>
          <Text style={[styles.statBoxNum, { color: '#DC2626' }]}>{stats.rejectedCount}</Text>
          <Text style={styles.statBoxLabel}>Rejected</Text>
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => {
          const active = statusFilter === f;
          const count = f === 'all' ? stats.total : f === 'pending' ? stats.pendingCount : f === 'approved' ? stats.approvedCount : stats.rejectedCount;
          const chipColor = f === 'pending' ? '#D97706' : f === 'approved' ? '#059669' : f === 'rejected' ? '#DC2626' : colors.primary;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, active && { backgroundColor: chipColor }]}
              onPress={() => setStatusFilter(f)}
            >
              <Text style={[styles.filterChipText, active && { color: '#fff' }]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
              {count > 0 && (
                <View style={[styles.filterChipBadge, active && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Text style={[styles.filterChipBadgeText, active && { color: '#fff' }]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.requestsTitleRow}>
        <Text style={styles.requestsTitle}>Teacher Leave Requests</Text>
        <Text style={styles.requestsCount}>{filteredLeaves.length} showing</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredLeaves}
        keyExtractor={(item) => item.id}
        renderItem={renderLeave}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-text-outline" size={40} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>
              {statusFilter !== 'all'
                ? `No ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Requests`
                : 'No Leave Requests Yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {statusFilter !== 'all'
                ? 'Try a different filter to see other requests.'
                : 'When teachers apply for leave, their requests will appear here for your review.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingBottom: 100 },

  headerSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statBoxApproved: { borderBottomWidth: 3, borderBottomColor: '#059669' },
  statBoxPending:  { borderBottomWidth: 3, borderBottomColor: '#D97706' },
  statBoxRejected: { borderBottomWidth: 3, borderBottomColor: '#DC2626' },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statBoxNum: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  statBoxLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    minWidth: 18,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignItems: 'center',
  },
  filterChipBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  requestsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  requestsTitle: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  requestsCount: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.sm,
    fontWeight: '800',
  },
  teacherName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  agoText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 1,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    borderWidth: 1,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
  },

  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dateCol: {
    flex: 1,
  },
  dateMeta: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1,
    marginBottom: 3,
  },
  dateMain: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  arrowLine: {
    width: 12,
    height: 1.5,
    backgroundColor: colors.border,
  },
  daysPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  daysPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },

  reasonSection: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reasonText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    gap: 6,
  },
  approveBtn: {
    backgroundColor: '#059669',
  },
  approveBtnText: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFFFFF' },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectBtnText: { fontSize: fontSize.sm, fontWeight: '700', color: '#DC2626' },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.xxl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
