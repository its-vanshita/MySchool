import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useLeaveRequests, useAllLeaveRequests } from '../../../src/hooks/useLeaveRequests';
import { updateLeaveStatus } from '../../../src/services/supabaseService';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';
import type { LeaveRequest, LeaveStatus } from '../../../src/types';

const STATUS_CONFIG: Record<LeaveStatus, { color: string; bg: string; icon: string }> = {
  pending: { color: colors.warning, bg: colors.warningLight, icon: 'time-outline' },
  approved: { color: colors.success, bg: colors.successLight, icon: 'checkmark-circle-outline' },
  rejected: { color: colors.danger, bg: colors.dangerLight, icon: 'close-circle-outline' },
};

export default function LeaveScreen() {
  const router = useRouter();
  const { profile, permissions } = useUser();

  // Teacher sees their own leaves; Principal sees all
  const { leaves: myLeaves, loading: myLoading, applyLeave } = useLeaveRequests(profile?.id);
  const { leaves: allLeaves, loading: allLoading } = useAllLeaveRequests();

  const isApprover = permissions.canApproveLeave;
  const [tab, setTab] = useState<'my' | 'approvals'>(isApprover ? 'approvals' : 'my');

  const leaves = tab === 'my' ? myLeaves : allLeaves;
  const loading = tab === 'my' ? myLoading : allLoading;

  const handleApprove = (id: string) => {
    Alert.alert('Approve Leave', 'Approve this leave request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: () => updateLeaveStatus(id, 'approved', profile?.id ?? ''),
      },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject Leave', 'Reject this leave request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => updateLeaveStatus(id, 'rejected', profile?.id ?? ''),
      },
    ]);
  };

  const renderLeave = ({ item }: { item: LeaveRequest }) => {
    const config = STATUS_CONFIG[item.status];
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {tab === 'approvals' && item.teacher_name && (
            <Text style={styles.teacherName}>{item.teacher_name}</Text>
          )}
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon as any} size={14} color={config.color} />
            <Text style={[styles.statusText, { color: config.color }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.dateText}>
            {item.from_date} → {item.to_date}
          </Text>
        </View>
        <Text style={styles.reason}>{item.reason}</Text>

        {/* Approval buttons for principal */}
        {tab === 'approvals' && item.status === 'pending' && isApprover && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.successLight }]}
              onPress={() => handleApprove(item.id)}
            >
              <Ionicons name="checkmark" size={18} color={colors.success} />
              <Text style={[styles.actionBtnText, { color: colors.success }]}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.dangerLight }]}
              onPress={() => handleReject(item.id)}
            >
              <Ionicons name="close" size={18} color={colors.danger} />
              <Text style={[styles.actionBtnText, { color: colors.danger }]}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab bar for principal */}
      {isApprover && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, tab === 'approvals' && styles.tabActive]}
            onPress={() => setTab('approvals')}
          >
            <Text style={[styles.tabText, tab === 'approvals' && styles.tabTextActive]}>
              All Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'my' && styles.tabActive]}
            onPress={() => setTab('my')}
          >
            <Text style={[styles.tabText, tab === 'my' && styles.tabTextActive]}>My Leaves</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={leaves}
        keyExtractor={(item) => item.id}
        renderItem={renderLeave}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="airplane-outline" size={50} color={colors.textLight} />
            <Text style={styles.emptyText}>No leave requests</Text>
          </View>
        }
      />

      {/* FAB for applying leave */}
      {permissions.canRequestLeave && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/apply-leave')}>
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textLight },
  tabTextActive: { color: colors.primary },
  list: { padding: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  teacherName: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  statusText: { fontSize: fontSize.xs, fontWeight: '700' },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dateText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  reason: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  actionBtnText: { fontSize: fontSize.sm, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: colors.textLight, fontSize: fontSize.md, marginTop: spacing.md },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.purple,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
