import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../src/context/UserContext';
import { useAllLeaveRequests } from '../src/hooks/useLeaveRequests';
import { updateLeaveStatus } from '../src/services/supabaseService';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';
import type { LeaveRequest, LeaveStatus } from '../src/types';

const STATUS_CONFIG: Record<LeaveStatus, { color: string; bg: string; icon: string }> = {
  pending: { color: colors.warning, bg: colors.warningLight, icon: 'time-outline' },
  approved: { color: colors.success, bg: colors.successLight, icon: 'checkmark-circle-outline' },
  rejected: { color: colors.danger, bg: colors.dangerLight, icon: 'close-circle-outline' },
};

export default function LeaveApprovalsScreen() {
  const { profile } = useUser();
  const { leaves, loading } = useAllLeaveRequests();

  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const pastLeaves = leaves.filter((l) => l.status !== 'pending');

  const handleApprove = (id: string) => {
    Alert.alert('Approve', 'Approve this leave request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => updateLeaveStatus(id, 'approved', profile?.id ?? '') },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject', 'Reject this leave request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => updateLeaveStatus(id, 'rejected', profile?.id ?? '') },
    ]);
  };

  const renderItem = ({ item }: { item: LeaveRequest }) => {
    const config = STATUS_CONFIG[item.status];
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.teacherName}>{item.teacher_name || 'Teacher'}</Text>
            <Text style={styles.dateRange}>
              {item.from_date} → {item.to_date}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon as any} size={14} color={config.color} />
            <Text style={[styles.statusText, { color: config.color }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.reason}>{item.reason}</Text>
        {item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.successLight }]}
              onPress={() => handleApprove(item.id)}
            >
              <Ionicons name="checkmark" size={18} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.success }]}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.dangerLight }]}
              onPress={() => handleReject(item.id)}
            >
              <Ionicons name="close" size={18} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[...pendingLeaves, ...pastLeaves]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={50} color={colors.textLight} />
            <Text style={styles.emptyText}>No leave requests</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  teacherName: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  dateRange: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  statusText: { fontSize: fontSize.xs, fontWeight: '700' },
  reason: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  actionText: { fontSize: fontSize.sm, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: colors.textLight, fontSize: fontSize.md, marginTop: spacing.md },
});
